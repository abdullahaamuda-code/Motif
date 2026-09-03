"use client";

import { useState, type ReactNode } from "react";
import { sfx } from "@/lib/sound";
import { Icon } from "./Icon";

function CopyBtn({ text }: { text: string }) {
  const [ok, setOk] = useState(false);
  return (
    <button
      onClick={async () => { await navigator.clipboard.writeText(text); sfx.copy(); setOk(true); setTimeout(() => setOk(false), 1400); }}
      className="absolute top-2 right-2 flex items-center gap-1 rounded-md bg-ink-4/90 hover:bg-ink-3 border border-hairline text-paper-dim hover:text-paper px-2 py-1 text-[9px] font-mono uppercase tracking-[0.1em] transition btn-press"
    >
      <Icon name={ok ? "check" : "copy"} size={10} />
      {ok ? "copied" : "copy"}
    </button>
  );
}

// inline: **bold**, `code`
function inline(text: string): ReactNode[] {
  return text.split(/(\*\*[^*]+\*\*|`[^`]+`)/g).filter(Boolean).map((p, k) => {
    if (p.startsWith("**") && p.endsWith("**")) return <strong key={k} className="text-paper font-semibold">{p.slice(2, -2)}</strong>;
    if (p.startsWith("`") && p.endsWith("`") && p.length > 2) {
      return <code key={k} className="rounded bg-ink-3 border border-hairline px-1 py-0.5 font-mono text-[11.5px] text-paper">{p.slice(1, -1)}</code>;
    }
    return <span key={k}>{p}</span>;
  });
}

type Block =
  | { kind: "code"; lang: string; lines: string[] }
  | { kind: "table"; rows: string[][] }
  | { kind: "prose"; lines: string[] };

const isTableRow = (l: string) => /^\s*\|.*\|\s*$/.test(l);
const isDivider = (l: string) => /^\s*\|[\s:|-]+\|\s*$/.test(l);
const cells = (l: string) => l.trim().replace(/^\||\|$/g, "").split("|").map((c) => c.trim());

// Line-based parser: a fence toggles code mode. A model that nests backticks
// inside its prompt block leaves one fence unmatched, which would swallow every
// following section as code — so once the stream is finished, an unmatched
// trailing fence is demoted to prose instead of eating the rest of the reply.
function parse(text: string, streaming: boolean): Block[] {
  const fenceCount = (text.match(/^\s*```/gm) ?? []).length;
  const recoverTail = !streaming && fenceCount % 2 === 1;
  let seenFences = 0;

  const out: Block[] = [];
  let code: { lang: string; lines: string[] } | null = null;
  let depth = 0;
  let prose: string[] = [];
  let table: string[][] | null = null;

  const flushProse = () => { if (prose.length) { out.push({ kind: "prose", lines: prose }); prose = []; } };
  const flushTable = () => { if (table?.length) { out.push({ kind: "table", rows: table }); } table = null; };

  for (const line of text.split("\n")) {
    const fence = line.match(/^\s*```(.*)$/);
    if (fence) {
      seenFences++;
      const lang = fence[1].trim();
      if (code) {
        // The Director wraps its master prompt in ```markdown and nests ```json
        // inside it. A tagged fence opens a nested block; only a bare fence at
        // depth 1 ends the outer one, so the whole prompt stays one copyable block.
        if (lang) { depth++; code.lines.push(line); continue; }
        if (depth > 1) { depth--; code.lines.push(line); continue; }
        out.push({ kind: "code", ...code });
        code = null;
        depth = 0;
        continue;
      }
      if (recoverTail && seenFences === fenceCount) continue; // stray closer, not an opener
      flushProse(); flushTable();
      code = { lang, lines: [] };
      depth = 1;
      continue;
    }
    if (code) { code.lines.push(line); continue; }

    if (isTableRow(line)) {
      if (isDivider(line)) continue;
      flushProse();
      (table ??= []).push(cells(line));
      continue;
    }
    flushTable();
    prose.push(line);
  }
  if (code) out.push({ kind: "code", ...code });
  flushTable();
  flushProse();
  return out;
}

export default function RichText({ text, streaming = false }: { text: string; streaming?: boolean }) {
  const blocks = parse(text, streaming);
  return (
    <div className="space-y-3 min-w-0">
      {blocks.map((b, i) => {
        if (b.kind === "code") {
          const code = b.lines.join("\n").replace(/\s+$/, "");
          if (!code.trim()) return null;
          return (
            <div key={i} className="relative min-w-0">
              {b.lang && <div className="ticket mb-1">{b.lang}</div>}
              <pre className="rounded-lg bg-ink border border-hairline px-3 py-2.5 text-[11px] leading-relaxed overflow-x-auto slim-scroll font-mono text-paper max-w-full">
                {code}
              </pre>
              <CopyBtn text={code} />
            </div>
          );
        }

        if (b.kind === "table") {
          const [head, ...body] = b.rows;
          return (
            <div key={i} className="overflow-x-auto slim-scroll max-w-full">
              <table className="w-full text-[12px] border-collapse">
                <thead>
                  <tr>{head.map((h, k) => <th key={k} className="text-left font-mono uppercase tracking-[0.1em] text-[9.5px] text-paper-faint pb-1.5 pr-4 border-b border-hairline whitespace-nowrap">{h}</th>)}</tr>
                </thead>
                <tbody>
                  {body.map((row, r) => (
                    <tr key={r} className="border-b border-hairline/60 last:border-0">
                      {row.map((c, k) => <td key={k} className="py-1.5 pr-4 align-top text-paper-dim">{inline(c)}</td>)}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        }

        return (
          <div key={i} className="space-y-1.5 min-w-0 break-words">
            {b.lines.map((raw, j) => {
              const line = raw.trimEnd();
              if (!line.trim()) return <div key={j} className="h-1.5" />;
              if (/^\s*([-*_])\1{2,}\s*$/.test(line)) return <hr key={j} className="border-0 border-t border-hairline my-2" />;
              if (line.startsWith("### ")) return <div key={j} className="font-display font-semibold text-[14px] text-paper pt-1">{inline(line.slice(4))}</div>;
              if (line.startsWith("## ")) return <div key={j} className="font-display font-semibold text-[16px] text-paper pt-1">{inline(line.slice(3))}</div>;
              if (line.startsWith("# ")) return <div key={j} className="font-display font-semibold text-[18px] text-paper pt-1">{inline(line.slice(2))}</div>;
              const num = line.match(/^\s*(\d+)\.\s+(.*)$/);
              if (num) {
                return (
                  <div key={j} className="flex gap-2 text-[13px] leading-relaxed">
                    <span className="font-mono text-paper-faint shrink-0">{num[1]}.</span>
                    <span>{inline(num[2])}</span>
                  </div>
                );
              }
              const bullet = line.match(/^\s*[-*•]\s+(.*)$/);
              if (bullet) {
                return (
                  <div key={j} className="flex gap-2 text-[13px] leading-relaxed">
                    <span className="text-proof shrink-0 select-none">—</span>
                    <span>{inline(bullet[1])}</span>
                  </div>
                );
              }
              if (line.startsWith("> ")) {
                return <div key={j} className="pl-3 border-l border-proof/50 text-[13px] italic text-paper-dim">{inline(line.slice(2))}</div>;
              }
              return <div key={j} className="text-[13px] leading-relaxed">{inline(line)}</div>;
            })}
          </div>
        );
      })}
    </div>
  );
}
