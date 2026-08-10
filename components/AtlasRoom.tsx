"use client";

import { useMemo, useState } from "react";
import type { DesignDNA, PaletteDef, TypeSystem, Rubric } from "@/lib/data/types";
import LivePreview from "./LivePreview";
import DesignModal from "./DesignModal";
import Director from "./Director";
import { sfx } from "@/lib/sound";
import { Icon } from "./Icon";

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

  return (
    <div>
      {/* sticky filter bar */}
      <div className="sticky top-14 z-30 -mx-4 px-4 py-3 bg-[#08080c]/85 backdrop-blur-2xl border-b border-white/5">
        <div className="flex flex-col md:flex-row gap-2 md:items-center">
          <div className="flex gap-1 rounded-full bg-white/5 p-1">
            {TABS.map((t) => (
              <button
                key={t.id}
                onClick={() => { setRubric(t.id); sfx.chip(); }}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition ${rubric === t.id ? "bg-white text-zinc-950" : "text-zinc-400 hover:text-white"}`}
              >
                {t.label}
              </button>
            ))}
          </div>
          <div className="relative flex-1">
            <Icon name="search" size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search by vibe, style, industry…"
              className="w-full rounded-full bg-white/5 border border-white/10 pl-9 pr-4 py-2 text-xs placeholder:text-zinc-500 focus:outline-none focus:ring-1 focus:ring-violet-400/60"
            />
          </div>
          <div className="flex gap-2">
            <select value={style} onChange={(e) => setStyle(e.target.value)}
              className="rounded-full bg-white/5 border border-white/10 px-3 py-2 text-xs text-zinc-300 focus:outline-none [&>option]:bg-zinc-900">
              <option value="">Style: all</option>
              {styles.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
            <select value={mood} onChange={(e) => setMood(e.target.value)}
              className="rounded-full bg-white/5 border border-white/10 px-3 py-2 text-xs text-zinc-300 focus:outline-none [&>option]:bg-zinc-900">
              {moods.map((m) => <option key={m} value={m}>{m === "all" ? "Mood: all" : m}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* grid */}
      <div className="pt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {ordered.slice(0, visible).map((d, i) => (
          <article
            key={d.slug}
            className="reveal card-glow glass rounded-2xl overflow-hidden cursor-pointer group"
            style={{ animationDelay: `${(i % 6) * 70}ms` }}
            onClick={() => { sfx.open(); setSelected(d); }}
          >
            <div className="relative overflow-hidden">
              <div style={{ aspectRatio: "16/10" }} className="relative">
                <LivePreview design={d} className="absolute inset-0" />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition" />
              {d.featured && (
                <span className="absolute top-2 left-2 rounded-full bg-white text-zinc-950 text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 shadow-lg">Featured</span>
              )}
            </div>
            <div className="p-4">
              <div className="flex items-center justify-between gap-2">
                <h3 className="font-display font-bold text-sm">{d.name}</h3>
                <span className="text-[9px] uppercase tracking-widest text-zinc-500">{d.rubric}</span>
              </div>
              <p className="mt-1 text-[11px] text-zinc-400 line-clamp-2">{d.vibe}</p>
              <div className="mt-3 flex gap-1.5 flex-wrap">
                {d.styles.slice(0, 2).map((s) => (
                  <span key={s} className="text-[9px] uppercase tracking-wide px-1.5 py-0.5 rounded-full bg-white/5 text-zinc-400">{s}</span>
                ))}
                <span className="text-[9px] uppercase tracking-wide px-1.5 py-0.5 rounded-full bg-white/5 text-zinc-400">{d.layout.density}</span>
              </div>
            </div>
          </article>
        ))}
      </div>

      {visible < ordered.length && (
        <div className="mt-10 text-center">
          <button onClick={() => setVisible((v) => v + 30)}
            className="rounded-full bg-white text-zinc-950 px-8 py-3 text-sm font-semibold transition hover:scale-105">
            Load more
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
