import { nextKey } from "./keys";

interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

interface StreamResult {
  stream: ReadableStream<Uint8Array>;
  provider: string;
}

// Model ids are verified against each provider's /v1/models listing.
// A renamed or retired id makes every call fail with 404, so keep these in sync
// with `npm run models:check`.
const CEREBRAS_TEXT = "gpt-oss-120b";
const GROQ_TEXT = "openai/gpt-oss-120b";
const GROQ_VISION = "qwen/qwen3.8-27b";

// 401/402/403 means the account is unauthorized or out of credit, and 404 means
// the model id is wrong: rotating to a sibling key repeats the same failure, so
// abandon the provider and let the next one answer.
const FATAL = new Set([401, 402, 403, 404]);

class ProviderError extends Error {
  constructor(message: string, readonly status: number) {
    super(message);
  }
  get fatal() { return FATAL.has(this.status); }
}

async function streamChat(opts: {
  label: string;
  url: string;
  key: string;
  model: string;
  messages: unknown;
  maxTokens: number;
  temperature: number;
}): Promise<ReadableStream<Uint8Array>> {
  const res = await fetch(opts.url, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${opts.key}` },
    body: JSON.stringify({
      model: opts.model,
      stream: true,
      max_completion_tokens: opts.maxTokens,
      temperature: opts.temperature,
      messages: opts.messages,
    }),
  });
  if (!res.ok || !res.body) {
    // Carry the provider's own reason — a bare "groq 404" hides a dead model id.
    const raw = await res.text().catch(() => "");
    let reason = raw.slice(0, 160);
    try {
      const parsed = JSON.parse(raw);
      reason = parsed.error?.message ?? parsed.message ?? reason;
    } catch { /* keep raw text */ }
    throw new ProviderError(`${opts.label} ${res.status}: ${reason}`, res.status);
  }
  return res.body;
}

export async function completeChat(opts: {
  messages: ChatMessage[];
  vision?: string; // dataURL for image
  maxTokens?: number;
  temperature?: number;
}): Promise<StreamResult> {
  const order: Array<"CEREBRAS_API_KEY" | "GROQ_API_KEY"> = ["CEREBRAS_API_KEY", "GROQ_API_KEY"];
  const maxTokens = opts.maxTokens ?? 2200;
  const temperature = opts.temperature ?? 0.7;
  const failures: string[] = [];

  for (const provider of order) {
    // Cerebras ships no vision model on the free tier — skip it for image asks.
    if (opts.vision && provider === "CEREBRAS_API_KEY") continue;

    const tried = new Set<string>();
    for (let attempt = 0; attempt < 3; attempt++) {
      const cred = nextKey(provider);
      if (!cred) break; // no keys for this provider at all
      if (tried.has(cred.key)) break; // every key already rotated through
      tried.add(cred.key);

      try {
        if (provider === "CEREBRAS_API_KEY") {
          const stream = await streamChat({
            label: "cerebras", url: "https://api.cerebras.ai/v1/chat/completions",
            key: cred.key, model: CEREBRAS_TEXT, messages: opts.messages, maxTokens, temperature,
          });
          return { stream, provider: "cerebras" };
        }

        const messages = opts.vision
          ? opts.messages.map((m) =>
              m.role === "user"
                ? { role: m.role, content: [{ type: "text", text: m.content }, { type: "image_url", image_url: { url: opts.vision } }] }
                : { role: m.role, content: m.content }
            )
          : opts.messages;
        const stream = await streamChat({
          label: "groq", url: "https://api.groq.com/openai/v1/chat/completions",
          key: cred.key, model: opts.vision ? GROQ_VISION : GROQ_TEXT, messages, maxTokens, temperature,
        });
        return { stream, provider: "groq" };
      } catch (e) {
        const err = e instanceof ProviderError ? e : new ProviderError(String(e), 0);
        failures.push(err.message);
        if (err.fatal) break;
      }
    }
  }

  throw new Error(failures.length ? failures.join(" | ") : "No provider configured");
}
