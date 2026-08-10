// In-memory fixed-window limiter + signed client token-bucket for chat quotas.
// (For multi-instance deploys swap the Map for Upstash — interface is identical.)

const buckets = new Map<string, { count: number; reset: number }>();

export function checkLimit(key: string, max: number, windowMs: number) {
  const now = Date.now();
  const entry = buckets.get(key);
  if (!entry || now > entry.reset) {
    buckets.set(key, { count: 1, reset: now + windowMs });
    return { ok: true, remaining: max - 1, reset: now + windowMs };
  }
  if (entry.count >= max) {
    return { ok: false, remaining: 0, reset: entry.reset };
  }
  entry.count++;
  return { ok: true, remaining: max - entry.count, reset: entry.reset };
}

export async function hmac(data: string, secret: string): Promise<string> {
  const enc = new TextEncoder();
  const cryptoKey = await crypto.subtle.importKey("raw", enc.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const sig = await crypto.subtle.sign("HMAC", cryptoKey, enc.encode(data));
  return Array.from(new Uint8Array(sig)).map((b) => b.toString(16).padStart(2, "0")).join("");
}
