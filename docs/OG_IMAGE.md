# OG / Share-image spec for Motif

## What to generate
An **Open Graph image** — what pops when someone pastes your link in Discord/Twitter/Slack.

## Generation prompt (Midjourney / Ideogram)
```
Elegant dark-mode landing page preview for "Motif — The Free Design Atlas",
hero composition with a floating 3D glass card showing a gradient UI mockup
(violet→cyan→pink), deep charcoal background #08080c, subtle dot-grid
overlay, sharp Space Grotesk-style typography "Motif" large, secondary
line "design DNA for vibe coders, engineers & agents", soft studio
lighting, slight photorealistic depth, award-winning keynote slide feel,
minimal, premium, 1200x630 --v 6 --stylize 400
```

## Resolution & placement
- **Size:** **1200×630** (the OG gold standard)
- **File:** `/public/og.jpg` (JPG, ~100-200KB)
- **Format:** JPG (not PNG — faster, fine for photos)

## Wire it into `app/layout.tsx`
Once `/public/og.jpg` exists, add inside metadata:

```ts
export const metadata: Metadata = {
  // ... existing
  openGraph: {
    title: "Motif — The Free Design Atlas",
    description: "Every design as living DNA. Copy-ready prompts for vibe coders, engineers & agents.",
    url: "https://your-domain.com",
    siteName: "Motif",
    images: [{ url: "/og.jpg", width: 1200, height: 630, alt: "Motif — design DNA atlas" }],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Motif — The Free Design Atlas",
    description: "Every design as living DNA.",
    images: ["/og.jpg"],
  },
};
```

It works as soon as the file exists — no re-audit needed.
