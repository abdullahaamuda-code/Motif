"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { loadCatalog } from "@/lib/client-data";
import type { DesignDNA } from "@/lib/data/types";
import LivePreview from "./LivePreview";
import { sfx } from "@/lib/sound";
import Reveal from "./Reveal";

const WORDS = ["landing pages", "game HUDs", "dashboards", "portfolios", "design systems", "launch pages", "storefronts", "AGENTS.md files"];
const MARQUEE = [
  "aurora gradients", "editorial serif contrast", "game HUD numerics", "glassmorphism panels",
  "brutalist grid-breaking", "quiet luxury spacing", "neon sign glow", "film grain", "terminal mono",
  "y2k chrome", "constellation particles", "wave dividers", "magnetic buttons", "scroll-driven reveals",
];

export default function Hero() {
  const [wordIdx, setWordIdx] = useState(0);
  const [designs, setDesigns] = useState<DesignDNA[]>([]);
  const [spot, setSpot] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setWordIdx((i) => (i + 1) % WORDS.length), 2400);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    loadCatalog().then((c) =>
      setDesigns(c.designs.filter((d) => d.featured).length >= 4
        ? c.designs.filter((d) => d.featured)
        : c.designs.slice(0, 6))
    );
  }, []);

  useEffect(() => {
    if (designs.length < 2) return;
    const t = setInterval(() => setSpot((s) => (s + 1) % designs.length), 4200);
    return () => clearInterval(t);
  }, [designs]);

  const heroDesign = designs[spot];
  const shadow1 = designs[(spot + 1) % designs.length];
  const shadow2 = designs[(spot + 2) % designs.length];

  return (
    <section className="relative min-h-[92vh] flex flex-col overflow-hidden">
      {/* dot field */}
      <div className="pointer-events-none absolute inset-0 opacity-25" style={{
        backgroundImage: "radial-gradient(rgba(167,139,250,.18) 1px, transparent 1px)", backgroundSize: "30px 30px",
        maskImage: "radial-gradient(75% 60% at 50% 35%, black, transparent)",
      }} />

      <div className="relative mx-auto w-full max-w-6xl px-4 flex-1 grid lg:grid-cols-[1.15fr_0.85fr] gap-12 items-center pt-20 pb-10">
        <div className="reveal">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3.5 py-1.5 text-[11px] text-zinc-400">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
            </span>
            An open atlas of premium design DNA
          </div>

          <h1 className="font-display mt-6 text-[2.6rem] md:text-[4.6rem] font-bold tracking-[-0.03em] leading-[0.98]">
            Steal like<br />an <span className="gradient-text">artist.</span>
            <span key={wordIdx} className="word-swap block text-zinc-500 text-[2rem] md:text-[3rem] font-semibold mt-3">
              for {WORDS[wordIdx]}
            </span>
          </h1>

          <p className="mt-6 max-w-md text-[13px] md:text-[15px] text-zinc-400 leading-relaxed">
            Every design ships as <span className="text-zinc-200 font-medium">living DNA</span> — palette, type, motion
            grammar, layout. Copy it as a vibe brief, an engineering spec, or an AGENTS.md law-file. Remixed in your browser. Yours.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link href="/atlas" onClick={() => sfx.enter()}
              className="group relative rounded-full bg-white text-zinc-950 px-7 py-3.5 text-sm font-semibold transition hover:scale-[1.03] active:scale-[0.98] shadow-[0_16px_50px_-12px_rgba(255,255,255,.35)]">
              <span className="relative z-10 flex items-center gap-2">
                Enter the Design Room
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" className="transition-transform group-hover:translate-x-1"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
              </span>
            </Link>
            <Link href="/atlas" className="text-sm text-zinc-400 hover:text-white transition underline underline-offset-4 decoration-zinc-700 hover:decoration-violet-400">
              or meet the Director first
            </Link>
          </div>

          <p className="mt-8 text-[10px] uppercase tracking-[0.25em] text-zinc-600">no paywalls · no accounts · just taste</p>
        </div>

        {/* floating deck */}
        <div className="relative reveal h-[380px] md:h-[440px]" style={{ animationDelay: "150ms" }}>
          {shadow2 && (
            <div className="deck-shadow-2 absolute inset-6 rounded-2xl opacity-40 pointer-events-none overflow-hidden">
              <LivePreview design={shadow2} className="w-full h-full" />
            </div>
          )}
          {shadow1 && (
            <div className="deck-shadow-1 absolute inset-3 rounded-2xl opacity-60 pointer-events-none overflow-hidden">
              <LivePreview design={shadow1} className="w-full h-full" />
            </div>
          )}
          <div className="floaty relative h-full rounded-2xl overflow-hidden border border-white/12 shadow-[0_40px_120px_-30px_rgba(139,92,246,.45)]">
            {heroDesign && <LivePreview key={heroDesign.slug} design={heroDesign} className="absolute inset-0" />}
            <div className="absolute bottom-0 inset-x-0 p-4 bg-gradient-to-t from-black/70 to-transparent">
              <div className="font-display font-bold text-sm">{heroDesign?.name ?? ""}</div>
              <div className="text-[10px] text-zinc-300 mt-0.5">{heroDesign?.vibe ?? ""}</div>
            </div>
          </div>
        </div>
      </div>

      {/* marquee */}
      <div className="relative border-t border-white/5 py-3.5 overflow-hidden">
        <div className="marquee-track gap-10 whitespace-nowrap text-[10px] uppercase tracking-[0.3em] text-zinc-600">
          {[0, 1].map((k) => (
            <span key={k} className="flex gap-10">
              {MARQUEE.map((m) => <span key={m}>{m} <span className="text-violet-500/60">✦</span></span>)}
            </span>
          ))}
        </div>
      </div>

            <Reveal className="sr-only"><span /></Reveal>
    </section>
  );
}
