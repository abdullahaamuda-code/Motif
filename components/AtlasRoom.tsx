"use client";

import { useEffect, useMemo, useState } from "react";
import type { DesignDNA, PaletteDef, TypeSystem, Rubric } from "@/lib/data/types";
import LivePreview from "./LivePreview";
import DesignModal from "./DesignModal";
import Director from "./Director";
import { sfx } from "@/lib/sound";
import { Icon, RegMark } from "./Icon";
import { paletteById } from "@/lib/data/palettes";

const TABS: Array<{ id: Rubric | ""; label: string }> = [
  { id: "", label: "All" },
  { id: "W", label: "Web & Landing" },
  { id: "U", label: "Apps & UI" },
  { id: "G", label: "Games" },
];

export default function AtlasRoom({
  designs,
  palettes,
  types,
}: {
  designs: DesignDNA[];
  palettes: PaletteDef[];
  types: TypeSystem[];
}) {
  const [q, setQ] = useState("");
  const [rubric, setRubric] = useState<Rubric | "">("");
  const [style, setStyle] = useState("");
  const [mood, setMood] = useState("");
  const [selected, setSelected] = useState<DesignDNA | null>(null);
  const [chatSlug, setChatSlug] = useState<string | null>(null);
  const [visible, setVisible] = useState(30);

  const styles = useMemo(() => Array.from(new Set(designs.flatMap((d) => d.styles))).sort(), [designs]);
  const moods = useMemo(() => ["all", "dark", "light", "bold", "quiet", "neon", "warm", "cool"], []);

  const filtered = useMemo(() => {
    let out = designs;
    if (rubric) out = out.filter((d) => d.rubric === rubric);
    if (style) out = out.filter((d) => d.styles.includes(style));
    if (q) {
      const query = q.toLowerCase();
      out = out.filter((d) =>
        [d.name, d.vibe, d.voice, ...d.tags, ...d.styles, ...d.industries, ...d.palettes]
          .join(" ")
          .toLowerCase()
          .includes(query)
      );
    }
    if (mood && mood !== "all") {
      out = out.filter((d) => {
        const pal = palettes.find((p) => p.id === d.palettes[0]);
        if (!pal) return true;
        if (mood === "dark") return pal.dark;
        if (mood === "light") return !pal.dark;
        if (mood === "neon") return d.effects.some((e) => ["neonsign", "scanlines", "aurora"].includes(e));
        if (mood === "bold") return d.layout.density === "dense" || d.typePair === "brutal" || d.typePair === "gothic";
        if (mood === "quiet") return d.layout.density === "airy" || d.styles.includes("minimal") || d.styles.includes("luxury");
        if (mood === "warm") return ["cream-espresso", "dune-terracotta", "forest-brass", "bone-petrol", "graphite-amber", "ember-night"].some((p) => d.palettes.includes(p));
        if (mood === "cool") return ["midnight-cyan", "frost-blue", "slate-mint", "abyss-coral", "deep-uv"].some((p) => d.palettes.includes(p));
        return true;
      });
    }
    return out;
  }, [designs, q, rubric, style, mood, palettes]);

  // ALWAYS feature the best first — never shuffled
  const ordered = useMemo(() => [...filtered].sort((a, b) => Number(b.featured ?? false) - Number(a.featured ?? false)), [filtered]);

  // deep link: /atlas?open=slug opens that proof directly
  useEffect(() => {
    const slug = new URLSearchParams(window.location.search).get("open");
    if (slug) {
      const d = designs.find((x) => x.slug === slug);
      if (d) setSelected(d);
    }
  }, [designs]);

  return (
    <div>
      {/* sticky job-ticket bar */}
      <div className="sticky top-14 z-30 -mx-4 px-4 py-3 bg-ink/90 backdrop-blur-2xl hairline-b">
        <div className="flex flex-col md:flex-row gap-2 md:items-center">
          <div className="flex gap-1 rounded-full border border-hairline bg-ink-2 p-1">
            {TABS.map((t) => (
              <button
                key={t.id}
                onClick={() => { setRubric(t.id); sfx.chip(); }}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition btn-press ${rubric === t.id ? "bg-paper text-ink" : "text-paper-dim hover:text-paper"}`}
              >
                {t.label}
              </button>
            ))}
          </div>
          <div className="relative flex-1">
            <Icon name="search" size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-paper-faint" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search by vibe, style, industry…"
              className="w-full rounded-full bg-ink-2 border border-hairline pl-9 pr-4 py-2 text-xs text-paper placeholder:text-paper-faint focus:outline-none focus:border-proof/60 transition-colors"
            />
          </div>
          <div className="flex gap-2">
            <select value={style} onChange={(e) => setStyle(e.target.value)}
              className="rounded-full bg-ink-2 border border-hairline px-3 py-2 text-xs text-paper-dim focus:outline-none focus:border-proof/60 transition-colors [&>option]:bg-ink-3">
              <option value="">Style: all</option>
              {styles.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
            <select value={mood} onChange={(e) => setMood(e.target.value)}
              className="rounded-full bg-ink-2 border border-hairline px-3 py-2 text-xs text-paper-dim focus:outline-none focus:border-proof/60 transition-colors [&>option]:bg-ink-3">
              {moods.map((m) => <option key={m} value={m}>{m === "all" ? "Mood: all" : m}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* the proof wall */}
      <div className="pt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {ordered.slice(0, visible).map((d, i) => {
          const pal = paletteById(d.palettes[0]);
          return (
            <div key={d.slug} className="blur-in h-full" style={{ animationDelay: `${(i % 9) * 55}ms` }}>
            <article
              className="card-lift sheet rounded-xl overflow-hidden cursor-pointer group crop-corners h-full"
              onClick={() => { sfx.open(); setSelected(d); }}
              onKeyDown={(e) => { if (e.key === "Enter") { sfx.open(); setSelected(d); } }}
              tabIndex={0}
              role="button"
              aria-label={`Open proof: ${d.name}`}
            >
              <div className="relative overflow-hidden">
                <div style={{ aspectRatio: "16/10" }} className="relative">
                  <LivePreview design={d} className="absolute inset-0" />
                </div>
                {d.featured && (
                  <span className="absolute top-2.5 left-2.5 z-10 flex items-center gap-1 rounded-full bg-ink/80 backdrop-blur px-2 py-0.5 text-[8.5px] font-mono uppercase tracking-[0.14em] text-proof border border-proof/30">
                    <RegMark size={7} /> proofed
                  </span>
                )}
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="font-display font-semibold text-[15px]">{d.name}</h3>
                  <span className="flex -space-x-1" title={pal.name}>
                    {pal.swatch.map((c) => <span key={c} className="w-2.5 h-2.5 rounded-full border border-ink-3" style={{ background: c }} />)}
                  </span>
                </div>
                <p className="mt-1 text-[12px] text-paper-dim line-clamp-2">{d.vibe}</p>
                <div className="mt-3 flex items-center gap-1.5 flex-wrap">
                  {d.styles.slice(0, 2).map((s) => (
                    <span key={s} className="text-[9px] font-mono uppercase tracking-wide px-1.5 py-0.5 rounded-full bg-ink-3 text-paper-faint">{s}</span>
                  ))}
                  <span className="text-[9px] font-mono uppercase tracking-wide px-1.5 py-0.5 rounded-full bg-ink-3 text-paper-faint">{d.layout.density}</span>
                  <span className="ml-auto text-[9px] font-mono uppercase tracking-[0.14em] text-paper-faint group-hover:text-proof transition-colors">{d.rubric === "W" ? "web" : d.rubric === "U" ? "app" : "game"}</span>
                </div>
              </div>
            </article>
            </div>
          );
        })}
      </div>

      {ordered.length === 0 && (
        <div className="py-24 text-center">
          <div className="mx-auto text-paper-faint"><RegMark size={22} /></div>
          <p className="mt-4 font-display text-xl">Nothing on the table for that search.</p>
          <p className="mt-1 text-[13px] text-paper-dim">Try a broader vibe — or ask the Director to pull something custom.</p>
        </div>
      )}

      {visible < ordered.length && (
        <div className="mt-12 text-center">
          <button onClick={() => { setVisible((v) => v + 30); sfx.chip(); }}
            className="rounded-full border border-hairline bg-ink-2 px-8 py-3 text-sm font-semibold text-paper hover:border-proof/60 hover:text-proof transition btn-press">
            Pull {Math.min(30, ordered.length - visible)} more proofs
          </button>
        </div>
      )}

      {selected && (
        <DesignModal
          design={selected}
          palettes={palettes}
          types={types}
          onClose={() => setSelected(null)}
          onChat={(slug) => { setSelected(null); setChatSlug(slug); }}
        />
      )}
      {chatSlug && <Director pinnedSlug={chatSlug} onClose={() => setChatSlug(null)} />}
    </div>
  );
}
