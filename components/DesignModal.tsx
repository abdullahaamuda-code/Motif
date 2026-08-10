"use client";

import { useEffect, useState } from "react";
import type { DesignDNA, PaletteDef, TypeSystem } from "@/lib/data/types";
import { compilePromptClient, type PromptMode } from "@/lib/render/client-prompt";
import LivePreview from "./LivePreview";
import { Icon } from "./Icon";
import { ShareNudge, shouldNudge } from "./ShareNudge";
import { sfx } from "@/lib/sound";

const MODES: Array<{ id: PromptMode; label: string; desc: string }> = [
  { id: "vibe", label: "Vibe", desc: "Paste into any AI chat — creative brief, ready to riff" },
  { id: "raw", label: "Raw", desc: "Engineering spec — tokens, constraints, structure" },
  { id: "agent", label: "Agent", desc: "AGENTS.md law file — supreme design authority for repos" },
];

export default function DesignModal({
  design: d,
  palettes,
  types,
  onClose,
  onChat,
}: {
  design: DesignDNA;
  palettes: PaletteDef[];
  types: TypeSystem[];
  onClose: () => void;
  onChat: (slug: string) => void;
}) {
  const [mode, setMode] = useState<PromptMode>("vibe");
  const [palId, setPalId] = useState(d.palettes[0]);
  const [typeId, setTypeId] = useState(d.typePair);
  const [brief, setBrief] = useState("");
  const [copied, setCopied] = useState(false);
  const [nudge, setNudge] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const prompt = compilePromptClient(
    { ...d, palettes: [palId, ...d.palettes.filter((p) => p !== palId)], typePair: typeId },
    mode, palettes, types, brief || undefined
  );

  const doCopy = async () => {
    await navigator.clipboard.writeText(prompt);
    sfx.copy();
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
    if (shouldNudge()) setTimeout(() => setNudge(true), 500);
  };

  const download = () => {
    const blob = new Blob([prompt], { type: "text/markdown" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `${d.slug}-${mode}.md`;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  const p = palettes.find((x) => x.id === palId) ?? palettes[0];
  const typ = types.find((x) => x.id === typeId) ?? types[0];

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-black/75 backdrop-blur-md backdrop-in" onClick={onClose} />

      <div className="modal-in relative w-full max-w-6xl h-[92vh] md:h-[86vh] glass-deep md:rounded-2xl overflow-hidden flex flex-col md:grid md:grid-cols-[1.1fr_1fr]">
        {/* LEFT — preview + remix */}
        <div className="flex flex-col min-h-0 border-b md:border-b-0 md:border-r border-white/8">
          <div className="relative flex-1 min-h-[200px]" style={{ background: p.bg }}>
            <LivePreview design={d} state={{ paletteId: palId, typeId }} className="absolute inset-0" />
          </div>
          <div className="p-3.5 space-y-3 bg-black/30 border-t border-white/8 max-h-[40%] overflow-y-auto slim-scroll">
            <div>
              <div className="text-[10px] uppercase tracking-widest text-zinc-500 mb-1.5">Palette</div>
              <div className="flex flex-wrap gap-1.5">
                {d.palettes.map((id) => {
                  const pp = palettes.find((x) => x.id === id) ?? palettes[0];
                  return (
                    <button key={id} onClick={() => setPalId(id)}
                      className={`flex items-center gap-1.5 rounded-full pl-1 pr-2 py-1 text-[11px] transition ${id === palId ? "bg-white/20 ring-1 ring-violet-400" : "bg-white/5 hover:bg-white/10"}`}>
                      <span className="flex -space-x-1">{pp.swatch.map((c) => <span key={c} className="w-3 h-3 rounded-full border border-black/50" style={{ background: c }} />)}</span>
                      {pp.name}
                    </button>
                  );
                })}
              </div>
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-widest text-zinc-500 mb-1.5">Type system</div>
              <div className="flex flex-wrap gap-1.5">
                {types.map((tt) => (
                  <button key={tt.id} onClick={() => setTypeId(tt.id)}
                    className={`rounded-full px-2.5 py-1 text-[11px] transition ${tt.id === typeId ? "bg-white/20 ring-1 ring-violet-400" : "bg-white/5 hover:bg-white/10"}`}>
                    {tt.name}
                  </button>
                ))}
              </div>
            </div>
            <input
              value={brief}
              onChange={(e) => setBrief(e.target.value)}
              placeholder="Optional — paste your project context (e.g. “retro-futurist SaaS for architects”)"
              className="w-full rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-xs placeholder:text-zinc-500 focus:outline-none focus:ring-1 focus:ring-violet-400/60"
            />
          </div>
        </div>

        {/* RIGHT — actions + prompt */}
        <div className="flex flex-col min-h-0">
          <div className="p-4 border-b border-white/8">
            <div className="flex items-start justify-between gap-2">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-display text-2xl font-bold">{d.name}</h3>
                  {d.featured && <span className="text-[9px] font-bold uppercase tracking-wider rounded-full bg-white text-zinc-950 px-2 py-0.5">Featured</span>}
                </div>
                <p className="text-xs text-zinc-400 mt-1 max-w-sm">{d.vibe}</p>
              </div>
              <button onClick={onClose} className="p-2 rounded-lg hover:bg-white/10 text-zinc-400 transition" aria-label="Close">
                <Icon name="x" size={18} />
              </button>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-1.5">
              {MODES.map((m) => (
                <button key={m.id} onClick={() => { setMode(m.id); sfx.chip(); }}
                  className={`rounded-xl p-2.5 text-left transition ${mode === m.id ? "bg-white text-zinc-950" : "bg-white/5 hover:bg-white/10 text-zinc-300"}`}>
                  <div className="text-xs font-bold">{m.label}</div>
                  <div className={`text-[9px] mt-0.5 leading-snug ${mode === m.id ? "text-zinc-600" : "text-zinc-500"}`}>{m.desc}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1 min-h-[160px] overflow-y-auto slim-scroll p-4">
            <pre className="whitespace-pre-wrap text-[11px] leading-relaxed font-mono text-zinc-300 bg-black/50 rounded-xl p-3.5 border border-white/8">
              {prompt}
            </pre>
          </div>

          <div className="p-4 border-t border-white/8 flex flex-wrap gap-2 bg-black/20">
            <button onClick={() => void doCopy()}
              className="flex-1 min-w-[140px] flex items-center justify-center gap-2 rounded-xl bg-white text-zinc-950 hover:bg-violet-200 transition px-4 py-3 text-sm font-bold">
              <Icon name={copied ? "check" : "copy"} size={16} />
              {copied ? "Copied!" : `Copy ${mode} prompt`}
            </button>
            <button onClick={download} className="flex items-center gap-2 rounded-xl bg-white/8 hover:bg-white/12 border border-white/10 px-4 py-3 text-xs font-medium transition">
              <Icon name="download" size={14} /> .md
            </button>
            <button onClick={() => { sfx.open(); onChat(d.slug); }} className="flex items-center gap-2 rounded-xl bg-white/8 hover:bg-white/12 border border-white/10 px-4 py-3 text-xs font-medium transition">
              <Icon name="chat" size={14} /> Ask Director
            </button>
          </div>
        </div>
      </div>

      {nudge && <ShareNudge onClose={() => setNudge(false)} />}
    </div>
  );
}
