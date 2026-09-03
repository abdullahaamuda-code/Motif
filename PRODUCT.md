# PRODUCT.md — Motif, the Design Atlas

## What it is
Motif is a free, browser-based atlas of premium **design DNA**. Every catalog entry is
not a screenshot but a live-rendered composition — palette, type system, layout
choreography, craft effects, and voice — defined as a typed `DesignDNA` object and
rendered by pure CSS in `components/LivePreview.tsx`. Visitors browse the atlas, remix
palette + type per entry in real time, and copy a compile-ready prompt in three modes:
**Vibe** (creative brief for any AI chat), **Raw** (engineering spec), **Agent**
(AGENTS.md law file). An optional **AI Director** chat (Cerebras/Groq, SSE streaming,
daily quota) recommends DNA from full-catalog context and composes master prompts.

## Unique mechanism
Designs render live from DNA — nothing is a static image. Remixing updates the
rendering *and* the compiled prompt simultaneously.

## Audience & scene
Vibe coders, indie builders, frontend engineers, and AI-agent workflows picking a
direction for their next landing page, app UI, or game HUD — usually late at night,
in a dark editor, wanting taste they can steal legally and instantly.

## Visitor mode
- Landing (`/`): **Persuade** — earn the enter-click by demonstrating the mechanism in the first viewport.
- Atlas room (`/atlas`): **Operate** — browse, filter, remix, copy; scanability and speed.
- Director chat: **Operate** — task completion with honest streaming status.

## Surface inventory
- `/` — Nav, Hero (live rotating preview deck), CraftSection (featured band), Footer, ProofStrip (3-step how-it-works), marquee.
- `/atlas` — sticky filter bar (rubric tabs, search, style, mood), card grid, DesignModal (preview + remix + prompt compiler + copy/download), Director drawer.
- Director — threads sidebar, question wizard, maximize/immersive mode.

## Constraints
- No accounts, no DB, no paywall; state in localStorage. MIT.
- API keys never ship to client; HMAC quota token; CSP locked to self.
- Static-first; service worker optional hardening.
- Must keep: DesignDNA contract, prompt compilers (server + client), sound design, PWA plumbing.
