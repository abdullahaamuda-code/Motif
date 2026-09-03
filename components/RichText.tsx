"use client";

import { useState } from "react";
import { sfx } from "@/lib/sound";

function CopyBtn({ text }: { text: string }) {
  const [ok, setOk] = useState(false);
  return (
    <button onClick={async () => { await navigator.clipboard.writeText(text); sfx.copy(); setOk(true); setTimeout(() => setOk(false), 1400); }}
      className="absolute top-2 right-2 flex items-center gap-1 rounded bg-ink-4 hover:bg-ink-3 text-paper-dim px-2 py-0.5 text-[9px] font-medium transition">
      {ok ? "✓ copied" : "copy"}
    </button>
  );
}

// Tiny markdown-ish renderer for chat (headers, bold, code blocks, lists).
export default function RichText({ text }: { text: string }) {
  const blocks = text.split(/```/);
  return (
    <div className="space-y-2">
      {blocks.map((block, i) => {
        if (i % 2 === 1) {
          // code block
          const lines = block.split("\n");
          const lang = lines[0].trim();
          const code = lines.slice(1).join("\n");
          return (
            <div key={i} className="relative">
              <pre className="rounded-lg bg-ink border border-hairline px-3 py-2 text-[11px] leading-relaxed overflow-x-auto slim-scroll font-mono text-paper">
                {lang && <div className="text-[9px] uppercase tracking-widest text-paper-faint mb-1">{lang}</div>}
                {code}
              </pre>
              <CopyBtn text={code} />
            </div>
          );
        }
        return (
          <div key={i} className="space-y-1.5">
            {block.split("\n").map((line, j) => {
              if (!line.trim()) return <div key={j} className="h-1" />;
              let cls = "text-[13px] leading-relaxed";
              if (line.startsWith("## ")) { line = line.slice(3); cls = "font-display font-bold text-[15px] text-paper"; }
              else if (line.startsWith("# ")) { line = line.slice(2); cls = "font-display font-bold text-[16px] text-paper"; }
              else if (/^[-•] /.test(line)) { line = "• " + line.slice(2); cls += " pl-1"; }
              const parts = line.split(/(\*\*[^*]+\*\*)/g).map((p, k) =>
                p.startsWith("**") && p.endsWith("**")
                  ? <strong key={k} className="text-paper font-semibold">{p.slice(2, -2)}</strong>
                  : p
              );
              return <div key={j} className={cls}>{parts}</div>;
            })}
          </div>
        );
      })}
    </div>
  );
}
