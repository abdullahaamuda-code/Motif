"use client";

import { useEffect, useState } from "react";
import type { DesignDNA, PaletteDef, TypeSystem } from "@/lib/data/types";
import { compilePromptClient, type PromptMode } from "@/lib/render/client-prompt";
import LivePreview from "./LivePreview";
import { Icon, RegMark } from "./Icon";
import { ShareNudge, shouldNudge } from "./ShareNudge";
import { sfx } from "@/lib/sound";

const MODES: Array<{ id: PromptMode; label: string; desc: string }> = [
  { id: "vibe", label: "Vibe", desc: "Creative brief — paste into any AI chat" },
  { id: "raw", label: "Raw", desc: "Engineering spec — tokens & constraints" },
  { id: "agent", label: "Agent", desc: "AGENTS.md law file for your repo" },
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
      <div className="absolute inset-0 bg-ink/85 backdrop-blur-md backdrop-in" onClick={onClose} />

      <div className="modal-in relative w-full max-w-6xl h-[92vh] md:h-[86vh] sheet-deep md:rounded-2xl overflow-hidden flex flex-col md:grid md:grid-cols-[1.1fr_1fr]">
        {/* LEFT — the proof + markup table */}
        <div className="flex flex-col min-h-0 border-b md:border-b-0 md:border-r border-hairline">
          <div className="relative flex-1 min-h-[200px] crop-corners" style={{ background: p.bg }}>
            <span className="absolute top-2.5 left-2.5 z-10 text-paper-faint/70 mix-blend-difference"><RegMark size={11} /></span>
            <span className="absolute top-2.5 right-2.5 z-10 text-paper-faint/70 mix-blend-difference"><RegMark size={11} /></span>
            <LivePreview design={d} state={{ paletteId: palId, typeId }} className="absolute inset-0" />
          </div>
          <div className="p-4 space-y-4 bg-ink-2/80 hairline-t max-h-[42%] overflow-y-auto slim-scroll">
            <div>
              <div className="ticket mb-2">Palette — {p.name}</div>
              <div className="flex flex-wrap gap-1.5">
                {d.palettes.map((id) => {
                  const pp = palettes.find((x) => x.id === id) ?? palettes[0];
                  return (
                    <button key={id} onClick={() => { setPalId(id); sfx.chip(); }}
                      className={`flex items-center gap-1.5 rounded-full pl-1 pr-2.5 py-1 text-[11px] transition btn-press ${id === palId ? "bg-paper text-ink" : "bg-ink-3 text-paper-dim hover:text-paper hover:bg-ink-4"}`}>
                      <span className="flex -space-x-1">{pp.swatch.map((c) => <span key={c} className="w-3 h-3 rounded-full border border-ink" style={{ background: c }} />)}</span>
                      {pp.name}
                    </button>
                  );
                })}
              </div>
            </div>
            <div>
              <div className="ticket mb-2">Type system — <span className="normal-case text-paper-dim">{typ.display.family}</span></div>
              <div className="flex flex-wrap gap-1.5">
                {types.map((tt) => (
                  <button key={tt.id} onClick={() => { setTypeId(tt.id); sfx.chip(); }}
                    className={`rounded-full px-2.5 py-1 text-[11px] transition btn-press ${tt.id === typeId ? "bg-paper text-ink font-semibold" : "bg-ink-3 text-paper-dim hover:text-paper hover:bg-ink-4"}`}>
                    {tt.name}
                  </button>
                ))}
              </div>
            </div>
            <input
              value={brief}
              onChange={(e) => setBrief(e.target.value)}
              placeholder="Optional — project context, e.g. “retro-futurist SaaS for architects”"
              className="w-full rounded-lg bg-ink-3 border border-hairline px-3 py-2 text-xs text-paper placeholder:text-paper-faint focus:outline-none focus:border-proof/60 transition-colors"
            />
          </div>
        </div>

        {/* RIGHT — job ticket + compiled prompt */}
        <div className="flex flex-col min-h-0">
          <div className="p-4 md:p-5 hairline-b">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2.5">
                  <h3 className="font-display text-2xl md:text-3xl font-medium tracking-tight">{d.name}</h3>
                  {d.featured && (
                    <span className="flex items-center gap-1 text-[8.5px] font-mono uppercase tracking-[0.14em] text-proof border border-proof/30 rounded-full px-2 py-0.5">
                      <RegMark size={7} /> proofed
                    </span>
                  )}
                </div>
                <p className="text-[13px] text-paper-dim mt-1.5 max-w-sm leading-relaxed">{d.vibe}</p>
              </div>
              <button onClick={onClose} className="p-2 rounded-lg hover:bg-ink-3 text-paper-dim transition" aria-label="Close">
                <Icon name="x" size={18} />
              </button>
            </div>

            <div className="mt-5 grid grid-cols-3 gap-1.5">
              {MODES.map((m) => (
                <button key={m.id} onClick={() => { setMode(m.id); sfx.chip(); }}
                  className={`rounded-xl p-2.5 text-left transition btn-press border ${mode === m.id ? "bg-paper text-ink border-transparent" : "bg-ink-2 hover:bg-ink-3 text-paper-dim border-hairline"}`}>
                  <div className="text-xs font-bold">{m.label}</div>
                  <div className={`text-[9px] mt-0.5 leading-snug ${mode === m.id ? "text-ink/60" : "text-paper-faint"}`}>{m.desc}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1 min-h-[160px] overflow-y-auto slim-scroll p-4 md:p-5 bg-ink/40">
            <div className="ticket mb-2 flex items-center gap-2">
              <span className="text-proof">→</span> compiled prompt · {d.slug}
            </div>
            <pre className="whitespace-pre-wrap text-[11px] leading-relaxed font-mono text-paper-dim bg-ink rounded-xl p-4 border border-hairline">
              {prompt}
            </pre>
          </div>

          <div className="p-4 md:p-5 hairline-t flex flex-wrap gap-2 bg-ink-2/60">
            <button onClick={() => void doCopy()}
              className={`flex-1 min-w-[150px] flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-bold transition btn-press ${copied ? "bg-verify text-ink" : "bg-proof text-ink hover:bg-proof-soft"}`}>
              <Icon name={copied ? "check" : "copy"} size={16} />
              {copied ? "On your clipboard" : `Copy ${mode} prompt`}
            </button>
            <button onClick={download} className="flex items-center gap-2 rounded-xl bg-ink-3 hover:bg-ink-4 border border-hairline px-4 py-3 text-xs font-medium text-paper-dim hover:text-paper transition btn-press">
              <Icon name="download" size={14} /> .md
            </button>
            <button onClick={() => { sfx.open(); onChat(d.slug); }} className="flex items-center gap-2 rounded-xl bg-ink-3 hover:bg-ink-4 border border-hairline px-4 py-3 text-xs font-medium text-paper-dim hover:text-paper transition btn-press">
              <Icon name="chat" size={14} /> Ask Director
            </button>
          </div>
        </div>
      </div>

      {nudge && <ShareNudge onClose={() => setNudge(false)} />}
    </div>
  );
}
