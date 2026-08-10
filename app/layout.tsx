import type { Metadata, Viewport } from "next";
import SWRegister from "@/components/SWRegister";
import "./globals.css";

export const metadata: Metadata = {
  openGraph: {
    title: "Motif — The Free Design Atlas",
    description: "Every design as living DNA. Copy-ready prompts for vibe coders, engineers & agents.",
    url: "https://motif-design-one.vercel.app",
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

export const viewport: Viewport = {
  themeColor: "#09090b",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@400;600;700&family=Playfair+Display:ital,wght@0,600;0,700;1,500&family=JetBrains+Mono:wght@400;700&family=Archivo+Black&family=Sora:wght@600;700&family=Chakra+Petch:wght@600;700&family=Unbounded:wght@500;800&family=Orbitron:wght@600;800&family=Rajdhani:wght@500;600&family=Marcellus&family=Italiana&family=Righteous&family=Source+Serif+4:ital,opsz,wght@0,8..60,400;1,8..60,400&family=Manrope:wght@400;600&family=Jost:wght@400;500&display=swap"
          rel="stylesheet"
        />
        <link rel="icon" type="image/png" href="/logo.png" />
        <link rel="apple-touch-icon" href="/logo.png" />
      </head>
      <body className="ambient min-h-screen">{children}<SWRegister /></body>
    </html>
  );
}
