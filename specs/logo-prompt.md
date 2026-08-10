# Motif Logo — AI generation specs

## What to generate
A premium, minimalist app icon + wordmark lockup for "Motif" — an open design-DNA atlas. Think the visual pedigree of Linear, Vercel's triangle, Apple's app icons, Framer's geometry.

## Recommended AI workflow
Use **Midjourney v6** (best for this), Ideogram 2.0 (great for letterforms), or FLUX.1 Pro. Generate at 4K, then downscale.

### Prompt (primary hero — icon only)
```
Minimalist app icon for a design-atlas brand called "Motif", letter M formed by interlocking gradient strokes or weaving ribbons, subtle glass refraction, colors flowing from violet to cyan to magenta, on deep near-black background, award-winning app icon in the style of Linear and Vercel, soft studio lighting, slight ambient rim light, octane render, 8k, centered composition, flat matte background #08080c, clean geometry --v 6 --stylize 400
```

### Prompt (variant — uppercase wordmark)
```
Premium wordmark "MOTIF" in geometric sans-serif, letters formed by overlapping translucent gradient layers (violet #a78bfa, cyan #67e8f9, pink #f472b6), subtle depth, deep charcoal background, cinematic lighting, Behance-featured app branding, clean vector-like edges --v 6 --stylize 400
```

### Prompt (variant — abstract monogram for favicon)
```
Single letter M app icon made of overlapping silk ribbons flowing from violet to cyan to pink, deep matte black background, award-winning mobile app logo, studio lighting, soft shadows, minimal, geometric --v 6 --stylize 400
```

## Production specs
- **File name:** `logo.png` — square sticker-and-raster use
- **Resolution:** 1024×1024 (AI-gen), downscale to **512×512** final
- **Format:** PNG (square-safe). Optionally grab 掩码版 SVG if you vectorize later.
- **Placement:** `/public/logo.png`
- **Where to wire it:** `components/Nav.tsx` line 15 (replace the gradient "M" span), `components/Footer.tsx` line 9, `public/manifest.webmanifest` icons array.

## Font pairings for the logo text
If you do wordmark text yourself: **Space Grotesk Bold** or **Inter Tight ExtraBold**, tight tracking (-0.04em), all caps, in white with a subtle violet→cyan gradient sweep.

## Do NOT do
• No shadows on white background (it should live on dark)
• No text below 16px — it'll die as favicon
• No absolute-circle renders (modern iOS masks crop)
