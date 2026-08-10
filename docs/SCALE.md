# SCALE.md — what's next, ranked by effort × value

| # | Play | Effort | Impact | Note |
|---|------|--------|--------|------|
| 1 | **OG dynamic image route** (`/api/og.tsx`, next/og) | 1–2 hrs | 🔥 shareability | every link → a live DNA card. CTA = free virality. |
| 2 | **Admin panel scaffold** (own Next.js, password-gated) | 1 day | content pipeline | notify/add designs from a UI, not the terminal. `docs/ADMIN.md` has the templates. |
| 3 | **Screenshot → DNA restorer** (re-enable `/api/vision` + Groq vision fallback) | 1 day | sticky creator tool | users bring screenshots, you hand them brand-new custom entries. |
| 4 | **Micro-interactions audit** (tilt on cards, spotlight cursor, haptics on toggle) | 2–3 hrs | premium feel | small detail, big retention |
| 5 | **Search vectorization** (embed catalog → Supabase pgvector) | 1 day | smart intent matching | upgrade from TF-IDF when >10k designs |
| 6 | **AGENT.md stacked editing** (card-by-card token override UI) | 1 day | dev-tool magnet | Cursor users love surgical prompts |
| 7 | **Share-to-X template** (OG image + canonical copy) | 1 hr | social proof | pre-written share text in ShareNudge already doubles as this |
| 8 | **Submission email autoresponder** (Brevo transactional) | 30 mins | pro touch | "you submitted X — we're extracting DNA now" |
| 9 | **Variant downloader** (export styled SVG per design) | 2 days | paid wallpaper/asset business | each design becomes downloadable asset |
| 10 | **Motif API** (read-only deadline, rate-limited) | 1 day | ecosystem | devs build surfaces around Motif DNA |

---

## The honest take

**This is legit premium.** Most people who land here will assume it's paid until they realize it's free. The depth of the schema (28 palettes × 12 type systems × 32 craft effects × 31 flows) plus a living AI director + remix engine is squarely *award-agency* territory. Most "design libraries" are static `pngs + download`. This is generative + conversational + slot machine feel.

**Biggest risk:** users need a reason to come back *tomorrow*. That's 1, 2, 3 on the table — they convert one-time visitors into collaborators + give you a channel (Brevo submissions + notify banner) that survives even if you never build accounts.

**Fastest growth loop:** dynamic OG images (1) + submission-based curation (3). Ship those first.

**Mobile:** already good — footer is compact, modal scrolls, install prompt exists. Sound toggle (nav) is accessible and subtle.

**Performance:** all static rendering, 0 images in grids, 233KB total server payload on `/atlas`, Trobopack build in 4s. No hydration bottlenecks.

Deploy. Share in Discord/Reddit communities where vibe coders hang out (`r/lovable`, `r/cursor`, `r/v0`, `r/web_design`, niche Slack workspaces, X #buildinpublic). The submit-a-design CTA is your organic flywheel.

*– signed, the future version of you who got an email about this today.*
