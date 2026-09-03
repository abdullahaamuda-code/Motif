// Verifies the model ids in lib/ai/providers.ts against each provider's live
// /v1/models listing, and probes every configured key. Run: npm run models:check
import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();

function loadEnv() {
  const env = { ...process.env };
  for (const file of [".env.local", ".env"]) {
    const p = path.join(ROOT, file);
    if (!fs.existsSync(p)) continue;
    for (const line of fs.readFileSync(p, "utf8").split("\n")) {
      const t = line.trim();
      if (!t || t.startsWith("#")) continue;
      const i = t.indexOf("=");
      if (i < 0) continue;
      const k = t.slice(0, i).trim();
      if (!(k in env)) env[k] = t.slice(i + 1).trim().replace(/^["']|["']$/g, "");
    }
  }
  return env;
}

function wantedModels() {
  const src = fs.readFileSync(path.join(ROOT, "lib/ai/providers.ts"), "utf8");
  const pick = (name) => src.match(new RegExp(`${name}\\s*=\\s*"([^"]+)"`))?.[1] ?? null;
  return {
    cerebras: [pick("CEREBRAS_TEXT")].filter(Boolean),
    groq: [pick("GROQ_TEXT"), pick("GROQ_VISION")].filter(Boolean),
  };
}

function keysFor(env, prefix) {
  return Object.keys(env)
    .filter((k) => k === prefix || k.startsWith(prefix + "_"))
    .sort()
    .map((k) => ({ name: k, key: env[k] }))
    .filter((e) => e.key && e.key.length > 6);
}

async function listModels(base, key) {
  const res = await fetch(`${base}/models`, { headers: { Authorization: `Bearer ${key}` } });
  const raw = await res.text();
  if (!res.ok) return { ok: false, status: res.status, reason: reasonOf(raw) };
  return { ok: true, ids: (JSON.parse(raw).data ?? []).map((m) => m.id) };
}

async function probeKey(base, key, model) {
  const res = await fetch(`${base}/chat/completions`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
    body: JSON.stringify({ model, stream: false, max_completion_tokens: 8, messages: [{ role: "user", content: "hi" }] }),
  });
  if (res.ok) return { ok: true };
  return { ok: false, status: res.status, reason: reasonOf(await res.text().catch(() => "")) };
}

function reasonOf(raw) {
  try {
    const j = JSON.parse(raw);
    return (j.error?.message ?? j.message ?? raw).slice(0, 110);
  } catch {
    return raw.slice(0, 110);
  }
}

const PROVIDERS = [
  { label: "Cerebras", prefix: "CEREBRAS_API_KEY", base: "https://api.cerebras.ai/v1", field: "cerebras" },
  { label: "Groq", prefix: "GROQ_API_KEY", base: "https://api.groq.com/openai/v1", field: "groq" },
];

const env = loadEnv();
const want = wantedModels();
let broken = false;
let anyUsable = false;

for (const p of PROVIDERS) {
  const keys = keysFor(env, p.prefix);
  console.log(`\n${p.label} — ${keys.length} key(s): ${keys.map((k) => k.name).join(", ") || "none"}`);
  if (!keys.length) continue;

  const listing = await listModels(p.base, keys[0].key);
  if (!listing.ok) {
    console.log(`  models listing unavailable (${listing.status}): ${listing.reason}`);
  } else {
    for (const model of want[p.field]) {
      const present = listing.ids.includes(model);
      if (!present) broken = true;
      console.log(`  ${present ? "OK  " : "GONE"} ${model}${present ? "" : `  — not in listing. available: ${listing.ids.slice(0, 6).join(", ")}`}`);
    }
  }

  const model = want[p.field][0];
  if (!model) continue;
  for (const k of keys) {
    const r = await probeKey(p.base, k.key, model);
    if (r.ok) anyUsable = true;
    else if (r.status === 402 || r.status === 401 || r.status === 403) broken = true;
    console.log(`  ${k.name}: ${r.ok ? "usable" : `${r.status} ${r.reason}`}`);
  }
}

console.log(
  anyUsable
    ? "\nAt least one provider can serve the Director."
    : "\nNo provider can serve the Director — the chat endpoint will return PROVIDER_DOWN."
);
process.exit(!anyUsable || broken ? 1 : 0);
