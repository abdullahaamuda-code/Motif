# 🎨 Motif — The Design Atlas

**A free, premium design-prompt atlas.**

Motif is a live, remixable design catalog where every design renders directly in the browser — not as screenshots. Remix palettes, swap type systems, adjust layouts, and copy the exact prompts your favorite AI coding tools need.

**Live:** [motif-design.vercel.app](https://motif-design.vercel.app) · **Repo:** [github.com/abdullahaamuda-code/Motif](https://github.com/abdullahaamuda-code/Motif)

---

## Why Motif

Most design-inspiration libraries show you what something looks like. Motif gives you the design DNA behind it — palette, typography, layout, effects, and implementation direction — so you can remix it, understand it, and turn it into something new.

**Browse. Remix. Understand. Build.**

---

## Features

- **Live previews** — every design renders as pure CSS, not a static screenshot
- **Remixable DNA** — customize palettes, type systems, layouts, and effects in real time
- **AI Design Director** — streaming chat with full catalog context that asks clarifying questions and generates implementation-ready prompts
- **Copy-ready prompts** — Vibe Brief, Raw Specification, or `AGENTS.md`, ready for Cursor, v0, Lovable, Claude, and other AI coding tools
- **No signup, no paywall** — everything free and copyable
- **Offline-first** — service worker keeps the catalog available and resilient
- **MIT licensed** — fork, modify, self-host, add your own designs

## Tech Stack

| | |
|---|---|
| Language | TypeScript |
| Framework | Next.js (App Router) |
| Styling | Tailwind CSS |
| AI | Cerebras / Groq (rotational) |
| Deployment | Static-ready — Vercel, Cloudflare, or Netlify |

## Status

| Area | Status |
|---|---|
| Design catalog | ✅ 82+ curated designs |
| Live previews | ✅ Functional |
| AI Director | ✅ Streaming chat |
| Prompt compilation | ✅ Functional |
| Remix controls | ✅ Functional |
| Offline support | ✅ Service worker |
| User accounts | ❌ None — intentionally local-only |

---

## Local Setup

**1. Clone the repository**

```bash
git clone https://github.com/abdullahaamuda-code/Motif.git
cd Motif
```

**2. Install dependencies**

```bash
npm install
```

**3. (Optional) Configure the AI Director**

Only needed to enable AI features. Create a `.env.local` in the project root:

```env
CEREBRAS_API_KEY_1=your-key
GROQ_API_KEY_1=your-key
APP_SECRET=any-random-string
CHAT_DAILY_LIMIT=50
```

Add further provider keys if your setup supports key rotation.

**4. Start the dev server**

```bash
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000).

## Project Structure

```
Motif/
├── app/                    # Next.js App Router, pages, and API routes
├── components/             # UI components (Atlas, Director, Preview)
├── lib/
│   ├── data/                # Design catalog, palettes, typography
│   ├── ai/                  # AI provider rotation and catalog indexing
│   ├── render/               # Prompt composition and rendering logic
│   └── security/             # Rate limiting and token management
├── public/                 # Static assets and service worker
├── specs/                  # Design and implementation specifications
└── package.json
```

## AI Design Director

A conversational interface with access to the full Motif catalog. It can:

- Understand a user's design requirements
- Ask clarifying questions when needed
- Recommend relevant design directions
- Combine characteristics from different catalog entries
- Generate implementation-ready master prompts in a format suited to the target AI coding tool

Provider (Cerebras / Groq) is selected by rotation based on the configured environment.

## Prompt Compilation

Any selected design direction can be compiled into:

- **Vibe Brief** — a concise creative direction describing the intended visual identity
- **Raw Specification** — a structured breakdown of layout, typography, color, and interaction requirements
- **AGENTS.md** — structured context and implementation guidance for AI coding agents

Paste directly into Cursor, v0, Lovable, Claude, or any other AI coding assistant.

## Local-First Architecture

Motif intentionally has no user accounts. Preferences, remix settings, and local configuration are stored via `localStorage`, so the catalog is fully usable without signing up.

## Security & Rate Limiting

The AI Director includes server-side protections for API usage. Provider keys stay server-side and are never exposed to the client.

## Contributing

Contributions are welcome — new designs, improved previews, new palettes or typography systems, remix-control improvements, AI Director enhancements, bug fixes, or docs. Please make sure `npm run build` succeeds before submitting a PR.

## License

MIT — see [LICENSE](LICENSE) for the full text.

---

Built with ❤️ by Abdullah A-Amuda
