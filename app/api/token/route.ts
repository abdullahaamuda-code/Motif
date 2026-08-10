import { NextResponse } from "next/server";
import { hmac } from "@/lib/security/limiter";

// Issues a signed client token: clientId|expires|sig — used as chat quota bucket.
// Note: public by design (no accounts). Quota is a guardrail, not a wall.
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  let clientId = searchParams.get("c") ?? "";
  if (!/^[A-Za-z0-9-]{8,64}$/.test(clientId)) {
    clientId = crypto.randomUUID();
  }
  const expires = Date.now() + 24 * 60 * 60 * 1000;
  const secret = process.env.APP_SECRET ?? "motif-dev-secret";
  const sig = await hmac(`${clientId}|${expires}`, secret);
  const token = `${clientId}|${expires}|${sig}`;
  return NextResponse.json({ token, limit: Number(process.env.CHAT_DAILY_LIMIT ?? 50) });
}
