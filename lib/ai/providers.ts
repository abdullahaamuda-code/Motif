import { nextKey } from "./keys";

interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

interface StreamResult {
  stream: ReadableStream<Uint8Array>;
  provider: string;
}

// Attempt providers with key rotation + one retry per provider on 429/quota.
export async function completeChat(opts: {
  messages: ChatMessage[];
  vision?: string; // dataURL for image
  maxTokens?: number;
  temperature?: number;
}): Promise<StreamResult> {
  const order: Array<"CEREBRAS_API_KEY" | "GROQ_API_KEY"> = ["CEREBRAS_API_KEY", "GROQ_API_KEY"];
  let lastError = "No provider configured";

  for (const provider of order) {
    for (let attempt = 0; attempt < 3; attempt++) {
      const cred = nextKey(provider);
      if (!cred) break; // no keys for this provider at all
      try {
        if (!opts.vision && provider === "CEREBRAS_API_KEY") {
          // gpt-oss-120b is Cerebras' best free-tier; gemma-3-27b-it is a strong fallback
          const CEREBRAS_MODEL = "gpt-oss-120b";
          const res = await fetch("https://api.cerebras.ai/v1/chat/completions", {
            method: "POST",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${cred.key}` },
            body: JSON.stringify({
              model: CEREBRAS_MODEL,
              stream: true,
              max_completion_tokens: opts.maxTokens ?? 2200,
              temperature: opts.temperature ?? 0.7,
              messages: opts.messages,
            }),
          });
          if (!res.ok || !res.body) throw new Error(`cerebras ${res.status}`);
          return { stream: res.body, provider: "cerebras" };
        }
        else if (provider === "GROQ_API_KEY") {
          const model = opts.vision ? "meta-llama/llama-4-scout-17b-16e-instruct" : "llama-3.3-70b-versatile";
          const messages = opts.vision
            ? opts.messages.map((m) => ({
                role: m.role,
                content:
                  m.role === "user"
                    ? [
                        { type: "text", text: m.content },
                        { type: "image_url", image_url: { url: opts.vision } },
                      ]
                    : m.content,
              }))
            : opts.messages;
          const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${cred.key}` },
            body: JSON.stringify({
              model,
              stream: true,
              max_completion_tokens: opts.maxTokens ?? 2200,
              temperature: opts.temperature ?? 0.7,
              messages,
            }),
          });
          if (!res.ok || !res.body) throw new Error(`groq ${res.status}`);
          return { stream: res.body, provider: "groq" };
        }
      } catch (e) {
        lastError = e instanceof Error ? e.message : String(e);
        // rotate to next key on failure
      }
    }
  }
  throw new Error(lastError);
}
