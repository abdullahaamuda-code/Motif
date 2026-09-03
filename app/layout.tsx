import type { Metadata, Viewport } from "next";
import SWRegister from "@/components/SWRegister";
import "./globals.css";

export const metadata: Metadata = {
  title: "Motif — The Free Design-Prompt Atlas",
  description:
    "Every entry a live proof, not a screenshot. 360+ design DNA briefs for websites, UIs & games. Copy as vibe brief, raw spec, or AGENTS.md. Free forever.",
  manifest: "/manifest.webmanifest",
  metadataBase: new URL("https://motif-design-one.vercel.app"),
  openGraph: {
    title: "Motif — The Free Design Atlas",
    description: "Every design as living DNA. Copy-ready prompts for vibe coders, engineers & agents.",
    url: "https://motif-design-one.vercel.app",
    siteName: "Motif",
    images: [{ url: "/og.jpg", width: 1200, height: 630, alt: "Motif — every proof, live" }],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Motif — The Free Design Atlas",
    description: "Live premium design DNA, free forever.",
    images: ["/og.jpg"],
  },
};

export const viewport: Viewport = {
  themeColor: "#0e0d0b",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* chrome faces: Bodoni Moda (display), Archivo (UI/body), Fragment Mono (spec data only).
            The preview faces below are CONTENT — they render the catalog's type systems. */}
        <link
          href="https://fonts.googleapis.com/css2?family=Bodoni+Moda:ital,opsz,wght@0,6..96,400..900;1,6..96,400..900&family=Archivo:wght@400;500;600;700&family=Fragment+Mono&family=Playfair+Display:ital,wght@0,600;0,700;1,500&family=JetBrains+Mono:wght@400;700&family=Archivo+Black&family=Sora:wght@600;700&family=Chakra+Petch:wght@600;700&family=Unbounded:wght@500;800&family=Orbitron:wght@600;800&family=Rajdhani:wght@500;600&family=Marcellus&family=Italiana&family=Righteous&family=Source+Serif+4:ital,opsz,wght@0,8..60,400;1,8..60,400&family=Manrope:wght@400;600&family=Jost:wght@400;500&display=swap"
          rel="stylesheet"
        />
        <link rel="icon" type="image/svg+xml" href="/icon.svg" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      </head>
      <body className="ambient min-h-screen">
        {/* MOTIF direction contract — seed key bc064b2a
            THESIS: every entry is a live proof sheet on a printer's dark inspection
            table — never a screenshot, never neon-glass AI chrome.
            OWN-WORLD: warm ink chrome, paper-cream text, hairline rules, one
            proofing-red accent, registration marks, job-ticket mono for spec data.
            STORY: see it rendered live, remix the proof, walk out with the prompt.
            FIRST VIEWPORT: hairline nav; Bodoni display headline, masked line-rise;
            live proof deck with job-ticket spec strip; proof-red enter action.
            FORM: candidate 4, press-proof floor, seed bc064b2a.
            FINISH: unreviewed and undocumented is unfinished; this build ends with
            the finish review, the verdict, DESIGN.md, and every shipping raster
            carrying its provenance. */}
        {children}
        <SWRegister />
      </body>
    </html>
  );
}
