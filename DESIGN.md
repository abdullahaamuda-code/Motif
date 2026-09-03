# DESIGN.md — Motif, "The Press Proof Floor"

Recorded from the built world (not intention). Direction seed key `bc064b2a`, candidate 4.

## World thesis
Every catalog entry is a **live proof sheet** on a printer's dark inspection table — never a
screenshot, never neon-glass AI chrome. The site's chrome is the press room; the catalog's
own palettes are the only source of color on the table.

## Color
- Ground `--color-ink #0e0d0b` (warm black, body + `.ambient` press-light gradient)
- Raised surfaces `--color-ink-2 #14120f`, `--color-ink-3 #1b1915`, `--color-ink-4 #242019`
- Text `--color-paper #f3efe7` (warm cream), secondary `#b9b2a3`, tertiary labels `#847b6c`
- Single accent `--color-proof #ff3e1f` (proofing red): primary actions, live indicators,
  emphasis italics, focus rings, caret. Second tone `--color-proof-soft #ff6a4a` for hover.
- Verification gold `--color-verify #d8a94e` (copy-confirmation state only)
- Hairlines `rgba(243,239,231,0.1)` — all dividers, card borders, table rules
- Strategy: restrained. Chrome stays ink+paper; previews carry the palette range.
- Selection: red ground, ink text. Caret: red. Scrollbars: paper at 18% alpha.

## Type
- Display: **Bodoni Moda** (opsz variable) — headlines, card names, modal titles;
  medium weight, tight tracking (-0.02em), italic + proof-red for emphasis words.
- UI/body: **Archivo** — 13–15px body, 600–700 for controls.
- Spec data: **Fragment Mono** via `.ticket` (9.5px, uppercase, +0.14em tracking) —
  used only for real spec data (slugs, counts, step labels, status). Never decorative.
- The preview faces loaded in layout.tsx are catalog content, not chrome.

## Icon language
- `RegMark` registration mark (circle + crosshair): logo mark, live indicators, marquee
  separators, empty states.
- `Icon` stroke set (1.8 stroke, currentColor): all UI icons. No emoji anywhere in chrome.
- `.crop-corners`: 1.5px paper-faint corner brackets frame proof sheets.

## Components
- `.sheet` / `.sheet-deep`: solid ink surfaces with hairline borders (glass only in
  `.sheet-deep`'s 20px blur on modal/drawer over busy content).
- Buttons: pill; primary = proof-red ground + ink text; secondary = ink-3 + hairline.
  `.btn-press` scale on active. Focus: 2px proof-red outline.
- Proof cards: `.card-lift` hover (-5px + `--shadow-lift`), caption strip (`bg-ink-2`,
  hairline-t) below the preview — captions never overlay busy mock content.
- Elevation declared once: `--shadow-sheet` / `--shadow-lift` (offset + soft blur).

## Motion grammar
- One orchestrated load moment: masked line-rise headline (`line-mask`/`line-rise`),
  blur-in stagger for copy/CTA/stats; hero deck assembles with float + pointer tilt
  (`tilt-scene`, max ~5deg) and sheen sweep on hover.
- Scroll: `reveal-soft` (26px rise + 6px blur, 0.9s expo) via `Reveal` (IO, 12% threshold).
- Grid entrances: `blur-in` wrappers with 55ms stagger (animation on wrapper, hover
  transitions on card — never both on one element).
- Marquee: 46s linear, masked edges (`marquee-fade`).
- Micro: `.caret-css` blinking block, `think-dots`, `msg-in`, `modal-in` (with blur),
  `drawer-in` slide, `loading-sheet` sweep, word-swap mask reveal every 2.4s.
- All motion collapses under `prefers-reduced-motion`.

## Surface notes
- Landing: Nav (sticky, hairline after 8px scroll) → Hero (proof deck + job-ticket strip)
  → Process band (3 steps, divide-x hairlines) → Proof Wall (featured, 1 tall + 4) →
  colophon Footer.
- Atlas: sticky job-ticket filter bar under nav; grid of proof cards; `?open=slug`
  deep-opens the DesignModal.
- Modal: left = proof + markup table (palette/type chips, brief input); right = job
  ticket (modes Vibe/Raw/Agent, compiled prompt, copy/download/Ask Director).
- Director: right drawer (520px desktop, full mobile), threads sidebar, question wizard;
  proof-red accents; honest status line.

## Boundaries
- DesignDNA contract, prompt compilers, sound design (`lib/sound.ts`), PWA plumbing,
  API security surface unchanged by the redesign.
- `LivePreview` internals are catalog content (palette-driven inline styles) — not chrome.
