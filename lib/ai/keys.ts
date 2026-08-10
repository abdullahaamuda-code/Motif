// Multi-key rotation for free-tier providers (Cerebras, Groq).

declare global {
  // eslint-disable-next-line no-var
  var __keyCursor: Record<string, number> | undefined;
}

function getKeys(prefix: string): string[] {
  const auto = Object.keys(process.env)
    .filter((k) => k.startsWith(prefix + "_"))
    .sort()
    .map((k) => process.env[k] ?? "");
  const legacy = process.env[prefix] ?? "";
  return [...auto, legacy].filter((v) => v && v.length > 6);
}

export function nextKey(prefix: "CEREBRAS_API_KEY" | "GROQ_API_KEY"): { key: string; total: number } | null {
  const keys = getKeys(prefix);
  if (!keys.length) return null;
  globalThis.__keyCursor ??= {};
  const cursor = globalThis.__keyCursor;
  const idx = (cursor[prefix] ?? 0) % keys.length;
  cursor[prefix] = idx + 1;
  return { key: keys[idx], total: keys.length };
}

export function hasAnyKey(): boolean {
  return !!(getKeys("CEREBRAS_API_KEY").length || getKeys("GROQ_API_KEY").length);
}
