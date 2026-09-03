"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { loadCatalog } from "@/lib/client-data";
import type { DesignDNA, PaletteDef, TypeSystem } from "@/lib/data/types";
import LivePreview from "./LivePreview";
import { sfx } from "@/lib/sound";
import { RegMark } from "./Icon";

const WORDS = ["landing pages", "game HUDs", "dashboards", "portfolios", "design systems", "launch pages", "storefronts", "AGENTS.md files"];
const MARQUEE = [
  "aurora gradients", "editorial serif contrast", "game HUD numerics", "glass panels",
  "brutalist grid-breaking", "quiet luxury spacing", "neon sign glow", "film grain", "terminal mono",
  "y2k chrome", "constellation particles", "wave dividers", "magnetic buttons", "scroll-driven reveals",
];

function JobTicket({ d, palette, type }: { d: DesignDNA; palette?: PaletteDef; type?: TypeSystem }) {
  if (!d) return null;
  const pal = palette?.swatch ?? [];
  return (
    <div className="flex items-center gap-3 text-[10px] text-paper-dim">
      <span className="font-mono uppercase tracking-[0.14em] text-paper-faint">{d.slug}</span>
      <span className="flex -space-x-1">
        {pal.map((c) => <span key={c} className="w-3 h-3 rounded-full border border-ink" style={{ background: c }} />)}
      </span>
      <span className="font-display italic text-paper">{type?.display.family ?? d.typePair}</span>
      <span className="hidden sm:inline text-paper-faint">{d.effects.length} effects</span>
      <span className="ml-auto hidden md:flex items-center gap-1.5 text-proof"><RegMark size={9} /> live proof</span>
    </div>
  );
}

export default function Hero() {
  const [wordIdx, setWordIdx] = useState(0);
  const [designs, setDesigns] = useState<DesignDNA[]>([]);
  const [palettes, setPalettes] = useState<PaletteDef[]>([]);
  const [types, setTypes] = useState<TypeSystem[]>([]);
  const [stats, setStats] = useState<{ designs: number; palettes: number; typeSystems: number } | null>(null);
  const [spot, setSpot] = useState(0);
  const tiltRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const t = setInterval(() => setWordIdx((i) => (i + 1) % WORDS.length), 2400);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    loadCatalog().then((c) => {
      const featured = c.designs.filter((d) => d.featured);
      setDesigns(featured.length >= 4 ? featured : c.designs.slice(0, 6));
      setPalettes(c.palettes);
      setTypes(c.types);
      setStats(c.stats);
    }).catch(() => {});
  }, []);

  useEffect(() => {
    if (designs.length < 2) return;
    const t = setInterval(() => setSpot((s) => (s + 1) % designs.length), 4200);
    return () => clearInterval(t);
  }, [designs]);

  // pointer tilt — the proof sheet follows the inspector's lamp
  const onTilt = (e: React.MouseEvent) => {
    const el = tiltRef.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    el.style.transform = `rotateX(${(-py * 4).toFixed(2)}deg) rotateY(${(px * 5).toFixed(2)}deg)`;
  };
  const onUntilt = () => {
    const el = tiltRef.current;
    if (el) el.style.transform = "";
  };

  const heroDesign = designs[spot];
  const shadow1 = designs[(spot + 1) % Math.max(designs.length, 1)];
  const shadow2 = designs[(spot + 2) % Math.max(designs.length, 1)];
  const heroPalette = palettes.find((p) => p.id === heroDesign?.palettes[0]);
  const heroType = types.find((t) => t.id === heroDesign?.typePair);

  return (
    <section className="relative min-h-[92vh] flex flex-col overflow-hidden">
      {/* inspection-table light */}
      <div className="pointer-events-none absolute inset-0" style={{
        background: "radial-gradient(60% 42% at 62% 30%, rgba(243,239,231,0.045), transparent 65%)",
      }} />

      <div className="relative mx-auto w-full max-w-6xl px-4 flex-1 grid lg:grid-cols-[1.12fr_0.88fr] gap-14 items-center pt-16 pb-12">
        <div>
          <h1 className="font-display font-medium tracking-[-0.02em] leading-[0.95] text-[3rem] sm:text-[4.2rem] md:text-[4.9rem]">
            <span className="line-mask"><span className="line-rise" style={{ animationDelay: "80ms" }}>Steal like</span></span>
            <span className="line-mask"><span className="line-rise" style={{ animationDelay: "200ms" }}>an <em className="italic font-semibold text-proof">artist.</em></span></span>
            <span className="line-mask mt-2 text-paper-dim text-[1.7rem] sm:text-[2.3rem] md:text-[2.6rem] font-medium">
              <span key={wordIdx} className="word-swap block">for {WORDS[wordIdx]}</span>
            </span>
          </h1>

          <p className="blur-in mt-7 max-w-md text-[14px] md:text-[15px] text-paper-dim leading-relaxed" style={{ animationDelay: "420ms" }}>
            Every design here is a <span className="text-paper font-medium">live proof</span> — palette, type, motion
            grammar and layout, rendered in your browser. Never a screenshot. Copy it as a vibe brief, an engineering
            spec, or an AGENTS.md law-file.
          </p>

          <div className="blur-in mt-9 flex flex-wrap items-center gap-5" style={{ animationDelay: "540ms" }}>
            <Link href="/atlas" onClick={() => sfx.enter()}
              className="group relative rounded-full bg-proof text-ink px-7 py-3.5 text-sm font-semibold transition hover:bg-proof-soft shadow-[0_18px_44px_-16px_rgba(255,62,31,0.55)] btn-press">
              <span className="flex items-center gap-2">
                Enter the press room
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" className="transition-transform duration-300 group-hover:translate-x-1"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
              </span>
            </Link>
            <Link href="/atlas" className="text-sm text-paper-dim hover:text-paper transition underline underline-offset-4 decoration-paper-faint/40 hover:decoration-proof">
              or brief the Director first
            </Link>
          </div>

          <p className="blur-in mt-9 text-[10.5px] font-mono uppercase tracking-[0.18em] text-paper-faint" style={{ animationDelay: "660ms" }}>
            {stats ? `${stats.designs} proofs · ${stats.palettes} palettes · ${stats.typeSystems} type systems` : "warming the press…"}
            <span className="mx-2 text-ink-4">|</span>no paywalls · no accounts
          </p>
        </div>

        {/* the proof deck — live-rendered sheets on the inspection table */}
        <div className="relative reveal-soft visible h-[380px] md:h-[460px] tilt-scene" onMouseMove={onTilt} onMouseLeave={onUntilt}>
          {shadow2 && (
            <div className="deck-shadow-2 absolute inset-8 rounded-xl opacity-35 pointer-events-none overflow-hidden border border-hairline">
              <LivePreview design={shadow2} className="w-full h-full" />
            </div>
          )}
          {shadow1 && (
            <div className="deck-shadow-1 absolute inset-4 rounded-xl opacity-60 pointer-events-none overflow-hidden border border-hairline">
              <LivePreview design={shadow1} className="w-full h-full" />
            </div>
          )}
          <div ref={tiltRef} className="tilt floaty relative h-full rounded-xl overflow-hidden border border-hairline shadow-[var(--shadow-sheet)] sheen">
            <span className="absolute top-2.5 left-2.5 z-10 text-paper-faint/80"><RegMark size={11} /></span>
            <span className="absolute top-2.5 right-2.5 z-10 text-paper-faint/80"><RegMark size={11} /></span>
            {heroDesign
              ? <LivePreview key={heroDesign.slug} design={heroDesign} className="absolute inset-0" />
              : <div className="loading-sheet absolute inset-0" />}
            <div className="absolute bottom-0 inset-x-0 px-4 pt-8 pb-3 bg-gradient-to-t from-ink/95 via-ink/60 to-transparent">
              <div className="font-display font-semibold text-[15px] leading-tight">{heroDesign?.name ?? ""}</div>
              <div className="mt-2.5 pt-2 border-t border-paper/10">
                <JobTicket d={heroDesign} palette={heroPalette} type={heroType} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* craft vocabulary, off the roll */}
      <div className="relative hairline-t py-3.5 overflow-hidden marquee-fade">
        <div className="marquee-track gap-10 whitespace-nowrap text-[10px] font-mono uppercase tracking-[0.28em] text-paper-faint">
          {[0, 1].map((k) => (
            <span key={k} className="flex gap-10">
              {MARQUEE.map((m) => <span key={m} className="flex items-center gap-10">{m} <RegMark size={7} className="text-proof/70" /></span>)}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
