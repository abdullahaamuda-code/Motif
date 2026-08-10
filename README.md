# Motif — The Design Atlas

**Live in-browser.** Every entry in this atlas is *rendered* — not screenshotted.
Remix palettes, swap type systems, bend the layout, and copy the exact prompt
your favorite AI coding tool needs (vibe brief, raw spec, or AGENTS.md).

Already-hosted version: **[Motif Design](https://motif-design-one.vercel.app)** 

---

## 🚀 The Idea

There are thousands of premium design pages on the internet. Almost all of them
show you a PNG, sell you a download, and leave you alone when you sit down to build.

Motif is the opposite. Every design is a **Design DNA** — palette + type
pairer + layout choreography + craft effects + voice — rendered as a **live
preview**, remixable in real-time, and compilable into a paste-ready prompt.

- **Hundreds of curated designs** across Landing / App UI / Games
- **No signup, no paywall.** Copy anything raw.
- **AI Design Director (optional)** that backs you with full-catalog context,
  answers clarifying questions, and emits master prompts you paste into Cursor /
  v0 / Lovable / Claude / anything.
- **MIT licensed** — fork, modify, self-host, and add designs by appending one
  object. No DB. Static. Boring on purpose = reliable.

---

## TOC

- [Quick start](#quick-start)
- [Directory](#directory)
- [Catalog anatomy](#catalog-anatomy)
- [AI Director](#ai-director)
- [Contribute](#contribute)
- [Self-hosting](#self-hosting)
- [Security](#security)


---

## Quick start

```bash
npm install
npm run dev
# open http://localhost:3000
```

### To make the Director work
Create a `.env.local` in the repo root:

```bash
# add as many as you have — rotation happens automatically
CEREBRAS_API_KEY_1=your-cerebras
CEREBRAS_API_KEY_2=
GROQ_API_KEY_1=your-groq

APP_SECRET=any-long-random-string
CHAT_DAILY_LIMIT=50
```

That's it. The Director now has 50 free chats/day/user (configurable),
streams tokens, remembers threads locally, and compiles prompts with the
full catalog exposed as context.

---

## Directory

```
Premium Design site/
├── app/
│   ├── layout.tsx          — fonts, metadata, icon, CSP, SW, OG
│   ├── page.tsx            — landing (Nav + Hero + CraftSection + Footer)
│   ├── atlas/page.tsx      — the gallery (card grid, filter bar,
│   │                          palette/type remix, popup prompt)
│   └── api/
│       ├── chat/route.ts   — streaming chat w/ provider rotation
│       ├── token/route.ts  — HMAC-signed quota token
│       └── data/route.ts   — the catalog payload (slim, static, fast)
├── components/
│   ├── Nav.tsx             — top bar (logo + links + Director + sound toggle)
│   ├── Hero.tsx            — hero, marquee words, rotating word-swap,
│   │                          floating preview deck on the right
│   ├── CraftSection.tsx    — featured designs as a curated asymmetric band
│   ├── AtlasRoom.tsx       — the Room page logic (filter/search/modal)
│   ├── LivePreview.tsx     — pure-CSS renderer for a DesignDNA
│   ├── Director.tsx        — chat UI, sessions, wizard, markdown rendering
│   ├── DesignModal.tsx     — popup modal with copy/download/Ask-Director
│   ├── Footer.tsx
│   └── Icon.tsx, RichText.tsx, Reveal.tsx, ShareNudge.tsx
├── lib/
│   ├── data/               — palette/type/effects/designs (source of truth)
│   │   ├── custom.ts       — ➕ add entries by appending one object
│   │   ├── designs1/2/3.ts — hand-curated roster (82 + spin-offs)
│   │   ├── mini.ts         — programmatic variants (recipe × rotation)
│   │   ├── palettes.ts
│   │   ├── typesystems.ts
│   │   └── craft.ts        — effects + flows + industries
│   ├── ai/
│   │   ├── keys.ts         — rotational loader for CEREBRAS + GROQ
│   │   ├── providers.ts    — one wrapper, multi-provider + model routing
│   │   └── indexer.ts      — TF-IDF lite → context pack for the Director
│   ├── render/
│   │   ├── prompt.ts       — server-side master prompt composition
│   │   └── client-prompt.ts— browser-side mirror used by modal
│   ├── security/limiter.ts — HMAC + fixed-window limiter
│   ├── sse.ts              — SSE delta reader (OpenAI-style)
│   ├── sound.ts            — WebAudio SFX (copy, receive, install, etc.)
│   └── client-data.ts      — typed wrapper for /api/data
├── public/
     ├── logo.png            — your app icon (add once → all PWA plumbing works)
     ├── sw.js               — offline-first service worker (defense-grade)
     └── manifest.webmanifest

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
the palette axes and density buckets, producing deterministic unique spin-offs
(no conflicting slugs, no naming collisions with Romans, and fully compatible
with the renderer).

---

## The AI Director

`components/Director.tsx` is a complete chat client:

- **Multi-thread persistence** — sessions in localStorage, 14d TTL, clear
  button per thread, plus a "Clear thread" in the input footer.
- **The Question wizard** — when a director's reply ends with:
  ```
  QUESTIONS:
  1. Which stack? (React|Next.js|HTML)
  2. Vibe? (dark|light|bold|quiet)
  ```
  …the UI parses it into a compact bar with pills + free-text, and "Next →"
  leads to the next question, then auto-sends the composed answer.
- **Copy buttons** — every reply's prompt code block is one click away.
- **Maximize** — toggles between a floating 500px sheet and a full-viewport
  immersive space.
- **True streaming** — status (`thinking… → writing…`) is honest; no fake pauses.

Server-side route `POST /api/chat` — sanitizes injections, caps history,
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

This repo is audited for common LLM-shot puzzles:

- Content-Security-Policy: `default-src 'self'` + explicit allow-list only.
- `script-src 'self' 'unsafe-inline'` (required by Next dev, and minimal enough to keep attacks at bay).
- API keys are **never** shipped to the client — only the sanitized quota token.
- `app/api/chat` filters messages, caps history, caps sizes, rotates keys,
  and skips auth unless `x-admin-secret` matches (for your privacy).
- Prompt-injection sanitizer — strips phrases like "ignore previous
  instructions" or reprogramming attempts at the boundary.

You can tighten further by swapping `lib/security/limiter.ts` from in-memory
→ Upstash (cache.last 5 minutes).

---

## License

**MIT** — do what you want; credit keeps the karma warm.

```
MIT License
Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation…
```

See [`LICENSE`](./LICENSE).

---

Motif — free forever. Built for people who want design to be *alive* again.
