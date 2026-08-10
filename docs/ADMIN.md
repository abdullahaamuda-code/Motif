# Motif — Admin Panel Architecture (separate project)

The admin layer is deliberately **decoupled**. It's its own Next.js
project, deployed separately (e.g. `motif-admin.vercel.app`), password-gated,
and speaks to this repo two ways:

1. **GitHub API** — writes `lib/data/custom.ts` and `public/notify.json`, then hits the Vercel deploy hook so Motif rebuilds itself live.
2. **Brevo API** — sends "your design was accepted" emails to submitters.

Nothing in the public Motif app calls into the admin. No shared DB. No public
surface.

## The three files to create in your new repo

### `motif-admin/app/api/notify/route.ts`     — POST `{message, id, password}`
```ts
import { NextRequest, NextResponse } from "next/server";
const G = process.env.GITHUB_PAT!; const REPO = process.env.GITHUB_REPO!;
const get = async () => {
  const r = await fetch(`https://api.github.com/repos/${REPO}/contents/public/notify.json`,
    { headers: { Authorization: `Bearer ${G}`, Accept: "application/vnd.github+json" } });
  return r.ok ? (await r.json()).sha : null;
};
export async function POST(req: NextRequest) {
  if (req.headers.get("x-admin-secret") !== process.env.ADMIN_SECRET) return NextResponse.json({ok:false},{status:401});
  const { message, id } = await req.json();
  const sha = await get();
  await fetch(`https://api.github.com/repos/${REPO}/contents/public/notify.json`, {
    method: "PUT", headers: { Authorization: `Bearer ${G}`, "Content-Type": "application/json" },
    body: JSON.stringify({ message: `notify: ${id}`, branch: "main", sha, content: Buffer.from(JSON.stringify({id,message})).toString("base64") }),
  });
  // Brevo not needed for notify — Vercel hook pulls
  await fetch(process.env.VERCEL_DEPLOY_HOOK!, { method: "POST" });
  return NextResponse.json({ ok: true });
}
```

### `motif-admin/app/api/design/add/route.ts`    — POST DesignDNA JSON
Same GitHub Contents PUT pattern to `lib/data/custom.ts`, append-mode (read current → concat → PUT back with new sha).

### `motif-admin/app/api/submissions/route.ts` — list / accept
Fetches from `process.env.BREVO_API_KEY`'s transactional contact lists, or a cheap JSON file you keep inside this admin project.

## Free stack recommendation
- **Hosting**: Vercel free tier (separate project)
- **Submissions DB**: Brevo free tier (transactional contact lists = forms = CRM) OR Supabase free tier if you want richer queries
- **Email**: Brevo transactional email API (`pass process.env.BREVO_API_KEY`)

## Quick start
```bash
npx create-next-app@latest motif-admin --typescript --tailwind --app
cd motif-admin
# pages: page.tsx (password gate) → dashboard.tsx (notify box + submission approve + design add)
# 3 API routes above
```
ENDPOINTS
- `POST /api/notify`      body `{id, message, password}` header `x-admin-secret`
- `POST /api/design/add`  body the DesignDNA (validated against our TS type before publish)
- `GET  /api/submissions` auth: same secret; source: Brevo contacts (tag: `submission`)

Motif doesn't have any admin route — it's just patterns.
