# Motif — The Design Atlas

**The Press Proof Floor.** Every entry in this atlas is *rendered* — not screenshotted.
Remix palettes, swap type systems, bend the layout, and copy the exact prompt your
favorite AI coding tool needs (vibe brief, raw spec, or AGENTS.md).

**Live:** [https://motif-design-one.vercel.app](https://motif-design-one.vercel.app)

---

## The Idea

There are thousands of premium design pages on the internet. Almost all of them
show you a PNG, sell you a download, and leave you alone when you sit down to build.

Motif is the opposite. Every design is a **Design DNA** — palette + type pairer +
layout choreography + craft effects + voice — rendered as a **live proof sheet** on a
dark inspection table, remixable in real time, and compilable into a paste-ready prompt.

- **Hundreds of curated designs** across Landing / App UI / Games
- **No signup, no paywall.** Copy anything raw.
- **AI Design Director (optional)** that backs you with full-catalog context,
  answers clarifying questions, and emits master prompts you paste into Cursor /
  v0 / Lovable / Claude / anything.
- **MIT licensed** — fork, modify, self-host, and add designs by appending one
  object. No DB. Static. Boring on purpose = reliable.

## The design system

The chrome is a printer's press room: warm ink-black ground, paper-cream text,
hairline rules, and a single proofing-red accent. Registration marks and crop
corners are the icon language; job-ticket mono (Fragment Mono) is used only for
real spec data. Display is Bodoni Moda, UI is Archivo. The catalog's own palettes
are the only source of color on the table.

- Tokens & motion grammar: `app/globals.css`
- Recorded system: `DESIGN.md` · product truth: `PRODUCT.md`
- Brand mark: proof-red registration mark on ink (`public/icon.svg`)
- Social card: `public/og.jpg` (1200×630)

## TOC

- [Quick start](#quick-start)
- [Directory](#directory)
- [Catalog anatomy](#catalog-anatomy)
- [AI Director](#ai-director)
- [Contribute](#contribute)
- [Self-hosting](#self-hosting)
- [Security](#security)
- [License](#license)

---

## Quick start

```bash
npm install
npm run dev
# open http://localhost:3000
```

### To make the Director work
Create a `.env.local` in the repo root (and set the same variables in your host's
environment settings — on Vercel: Project → Settings → Environment Variables):

```bash
# add as many as you have — rotation happens automatically
GROQ_API_KEY_1=gsk_...
GROQ_API_KEY_2=
CEREBRAS_API_KEY_1=csk-...

APP_SECRET=any-long-random-string
CHAT_DAILY_LIMIT=50
```

Then verify the keys and model ids actually work before you trust the UI:

```bash
npm run models:check
```

It lists each provider's live models, flags any id in `lib/ai/providers.ts` that
no longer exists, and probes every configured key. `402 Payment required` means
that provider's account is out of credit — the app falls through to the next
provider automatically, so one healthy provider is enough.

**Models in use** (`lib/ai/providers.ts`): Groq `openai/gpt-oss-120b` for text,
Groq `qwen/qwen3.8-27b` for vision, Cerebras `gpt-oss-120b` when that account has
credit. Providers rename and retire ids regularly; when the Director starts
answering with an error, run the check above first.

The Director has 50 free chats/day/user (configurable), streams tokens, remembers
threads locally, and compiles prompts with the full catalog exposed as context.

---

## Directory

```
Motif/
├── app/
│   ├── layout.tsx          — fonts, metadata, OG, favicon, PWA, direction contract
│   ├── page.tsx            — landing (Nav + Hero + Process + Proof Wall + Footer)
│   ├── globals.css         — design tokens + the full motion grammar
│   ├── atlas/page.tsx      — the press room (filter bar, proof wall, ?open= deep links)
│   └── api/
│       ├── chat/route.ts   — streaming chat w/ provider rotation
│       ├── token/route.ts  — HMAC-signed quota token
│       └── data/route.ts   — the catalog payload (slim, static, fast)
├── components/
│   ├── Nav.tsx             — press-room top bar (mark, links, Director, sound)
│   ├── Hero.tsx            — masked line-rise headline, tilting live proof deck,
│   │                          job-ticket spec strip, craft marquee
│   ├── ProofStrip.tsx      — the 3-step process band
│   ├── CraftSection.tsx    — the Proof Wall (featured designs, caption strips)
│   ├── AtlasRoom.tsx       — filter/search/mood logic + proof card grid
│   ├── LivePreview.tsx     — pure-CSS renderer for a DesignDNA (no images, ever)
│   ├── DesignModal.tsx     — proof approval sheet: remix + prompt compiler + copy
│   ├── Director.tsx        — chat UI, threads, question wizard, streaming
│   ├── Icon.tsx            — drawn stroke icon set + RegMark + MotifMark
│   ├── Footer.tsx          — colophon
│   └── Reveal.tsx, RichText.tsx, ShareNudge.tsx, SWRegister.tsx
├── lib/
│   ├── data/               — palette/type/effects/designs (source of truth)
│   │   ├── custom.ts       — ➕ add entries by appending one object
│   │   ├── designs*.ts     — hand-curated roster
│   │   ├── mini.ts         — programmatic variants (recipe × rotation)
│   │   ├── palettes.ts, typesystems.ts, craft.ts
│   ├── ai/                 — key rotation, provider wrapper, TF-IDF indexer
│   ├── render/             — master prompt composition (server + client)
│   ├── security/limiter.ts — HMAC + fixed-window limiter
│   ├── sse.ts, sound.ts, client-data.ts, director-memory.ts
├── public/
│   ├── icon.svg            — the mark: proof-red registration mark on ink
│   ├── logo.png            — 512px PWA icon · apple-touch-icon.png 180px
│   ├── og.jpg              — social share card
│   └── sw.js, manifest.webmanifest
├── DESIGN.md               — the recorded design system (from the build)
└── PRODUCT.md              — durable product context
```

---

## Catalog anatomy

Each design entry conforms to this typed contract (see `lib/data/types.ts`):

```ts
interface DesignDNA {
  slug: string;                // kebab-case, unique
  name: string;
  vibe: string;               // one-line identity
  rubric: "W" | "U" | "G";     // Web / UI / Game
  industries: string[];        // ids from craft.ts
  styles: string[];
  palettes: string[];          // palette ids (see palettes.ts)
  typePair: string;            // type-system id
  effects: string[];           // craft effect ids
  layout: {
    hero: HeroKind;            // statement, split, arena, bento, editorial…
    flow: string[];            // ordered sections (bento-grid, pricing, faq…)
    shell: ShellKind;          // topnav, sidebar, console, canvasdock…
    density: "airy" | "balanced" | "dense";
  };
  preview: { mock: MockKind; stat: string };
  voice: string;
  tags: string[];
  featured?: boolean;
  mini?: boolean;
}
```

**To add a design:** open `lib/data/custom.ts` and append one block. Commit.
That's it — your catalog just grew. The static renderer picks it up.

**Programmatic variants:** `mini.ts` rotates a set of core recipes against
the palette axes and density buckets, producing deterministic unique spin-offs.

---

## The AI Director

`components/Director.tsx` is a complete chat client:

- **Multi-thread persistence** — sessions in localStorage, clear per thread.
- **The Question wizard** — when a reply ends with a `QUESTIONS:` block, the UI
  parses it into a compact bar with pills + free text, then auto-sends the
  composed answer.
- **Copy buttons** — every reply's prompt code block is one click away.
- **Maximize** — floating sheet ↔ full-viewport immersive space.
- **True streaming** — status (`crafting… → writing…`) is honest; no fake pauses.

Server route `POST /api/chat` — sanitizes injections, caps history,
caps the message count, reads provider rotation, and returns raw SSE.

---

## Contribute

PRs welcome! If you want your entry displayed:

1. Fork.
2. Add a best-effort DesignDNA record to `lib/data/custom.ts`.
3. Make sure `slug` is unique (kebab-case) and compilation passes
   (`npm run build`).
4. PR template:
   - Why the design is *premium* — what makes it have taste
   - Screenshots (if applicable)
   - Markdown spec added → we review names + vibe.

---

## Self-hosting

Deploy: any static host (Cloudflare Pages, Vercel, Netlify, one Node box via
`next start`).

The `public/sw.js` service worker gives offline hardening for the catalog.
It's *not* required for the Director (that's stream-based), but it's cheap.

Memory + accounts: none. We intentionally ship the app with **zero account
system** — everything (chat history, preferences) is localStorage.

---

## Security

- Content-Security-Policy: `default-src 'self'` + explicit allow-list only.
- API keys are **never** shipped to the client — only the sanitized quota token.
- `app/api/chat` filters messages, caps history, caps sizes, rotates keys.
- Prompt-injection sanitizer at the boundary.

---

## Why

Design galleries show pictures; builders need prompts. Motif renders the design as a
live proof sheet *and* compiles the exact brief your AI tool needs — the gallery and
the kickoff are the same artifact.

## License

**MIT** — do what you want; credit keeps the karma warm. See [`LICENSE`](./LICENSE).

---

Motif — free forever. Proofed live, never screenshotted.
---

Built by Abdullah A-Amuda.
