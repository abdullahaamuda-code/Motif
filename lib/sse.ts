// Shared SSE delta reader for OpenAI-style streaming responses.
// gpt-oss models stream a `reasoning` channel before any prose; it is never shown,
// but onReasoning lets the caller hold an honest "thinking" status until the first
// visible token rather than parking on an empty bubble.
export async function readSSE(
  res: Response,
  onDelta: (text: string) => void,
  onReasoning?: () => void
): Promise<void> {
  if (!res.body) throw new Error("No response stream");
  const reader = res.body.getReader();
  const dec = new TextDecoder();
  let buf = "";
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    buf += dec.decode(value, { stream: true });
    const lines = buf.split("\n");
    buf = lines.pop() ?? "";
    for (const line of lines) {
      if (!line.startsWith("data:")) continue;
      const data = line.slice(5).trim();
      if (data === "[DONE]") continue;
      try {
        const delta = JSON.parse(data).choices?.[0]?.delta;
        if (delta?.content) onDelta(delta.content);
        else if (delta?.reasoning) onReasoning?.();
      } catch { /* partial */ }
    }
  }
}
