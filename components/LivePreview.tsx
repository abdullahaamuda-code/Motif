"use client";

import type { DesignDNA, PaletteDef } from "@/lib/data/types";
import { paletteById } from "@/lib/data/palettes";
import { typeById } from "@/lib/data/typesystems";

// ============================================================================
// LIVE PREVIEW — pure-CSS rendered design identity. No images. Ever pixel-true.
// ============================================================================

export interface PreviewState {
  paletteId?: string;
  typeId?: string;
}

function vars(p: PaletteDef): React.CSSProperties {
  return {
    ["--pv-bg" as string]: p.bg,
    ["--pv-surface" as string]: p.surface,
    ["--pv-text" as string]: p.text,
    ["--pv-muted" as string]: p.muted,
    ["--pv-a1" as string]: p.accent,
    ["--pv-a2" as string]: p.accent2,
  };
}

const has = (d: DesignDNA, ...ids: string[]) => ids.some((i) => d.effects.includes(i));

function fxOverlay(d: DesignDNA): React.ReactNode {
  return (
    <>
      {has(d, "aurora") && (
        <div className="absolute inset-0 pointer-events-none" style={{
          background:
            "radial-gradient(60% 70% at 15% 10%, color-mix(in srgb, var(--pv-a1) 32%, transparent), transparent 60%)," +
            "radial-gradient(50% 60% at 85% 85%, color-mix(in srgb, var(--pv-a2) 28%, transparent), transparent 60%)",
        }} />
      )}
      {has(d, "constellation") && (
        <svg className="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="none" viewBox="0 0 100 60">
          {[[8,12],[22,8],[36,18],[55,6],[70,16],[88,10],[15,34],[30,44],[48,36],[66,44],[82,36],[94,48]].map(([x,y],i)=>(
            <g key={i}>
              <circle cx={x} cy={y} r={i%3===0?1:0.55} fill="var(--pv-a2)" opacity={0.8}/>
              {i%2===0 && <line x1={x} y1={y} x2={x+10} y2={y+4} stroke="var(--pv-a2)" strokeWidth={0.15} opacity={0.35}/>}
            </g>
          ))}
        </svg>
      )}
      {has(d, "darkgrid") && <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: "linear-gradient(color-mix(in srgb, var(--pv-muted) 14%, transparent) 1px, transparent 1px), linear-gradient(90deg, color-mix(in srgb, var(--pv-muted) 14%, transparent) 1px, transparent 1px)", backgroundSize: "14px 14px" }} />}
      {has(d, "scanlines") && <div className="absolute inset-0 pointer-events-none opacity-40" style={{ background: "repeating-linear-gradient(0deg, transparent 0 3px, rgba(0,0,0,.28) 3px 4px)" }} />}
      {has(d, "halftone") && <div className="absolute inset-0 pointer-events-none opacity-25" style={{ backgroundImage: "radial-gradient(var(--pv-a1) 0.9px, transparent 0.9px)", backgroundSize: "7px 7px" }} />}
      {has(d, "pixelgrid") && <div className="absolute inset-0 pointer-events-none opacity-30" style={{ backgroundImage: "radial-gradient(var(--pv-a1) 1px, transparent 1px)", backgroundSize: "9px 9px" }} />}
    </>
  );
}

function Bar({ w, color, h = 3 }: { w: string; color?: string; h?: number }) {
  return <div className="pv-bar" style={{ width: w, height: h, background: color ?? "var(--pv-muted)", opacity: color ? 1 : 0.55 }} />;
}

function Nav({ d }: { d: DesignDNA }) {
  return (
    <div className="flex items-center justify-between px-2.5 pt-2 text-[4.5px] font-semibold" style={{ color: "var(--pv-text)" }}>
      <span className="tracking-tight">◆ {d.name.split(" ")[0]}</span>
      <span className="flex gap-1.5" style={{ color: "var(--pv-muted)" }}>
        {d.layout.flow.slice(0, 3).map((f) => <span key={f}>{f.split("-")[0]}</span>)}
      </span>
      <span className="px-1.5 py-0.5 rounded-full text-[4px]" style={{ background: "var(--pv-a1)", color: d.palettes.map(p=>paletteById(p))[0].dark ? "#000" : "#fff" }}>Get started</span>
    </div>
  );
}

function Spark({ color = "var(--pv-a1)" }: { color?: string }) {
  const pts = [30, 22, 26, 15, 19, 10, 14, 6, 10, 3];
  return (
    <svg viewBox="0 0 40 12" className="w-full h-3" preserveAspectRatio="none">
      <polyline fill="none" stroke={color} strokeWidth="1" points={pts.map((y, i) => `${i * 4.4},${y}`).join(" ")} />
    </svg>
  );
}

function Ring({ pct = 72, color = "var(--pv-a1)" }: { pct?: number; color?: string }) {
  return (
    <div className="rounded-full grid place-items-center" style={{
      width: 22, height: 22,
      background: `conic-gradient(${color} ${pct * 3.6}deg, color-mix(in srgb, var(--pv-muted) 25%, transparent) 0deg)`,
    }}>
      <div className="rounded-full" style={{ width: 14, height: 14, background: "var(--pv-surface)" }} />
    </div>
  );
}

function Card({ children, d, className = "", style = {} }: { children?: React.ReactNode; d: DesignDNA; className?: string; style?: React.CSSProperties }) {
  const glass = has(d, "glass");
  const glow = has(d, "borderglow");
  const brutal = has(d, "brutalshadow");
  return (
    <div className={className} style={{
      background: glass ? "color-mix(in srgb, var(--pv-surface) 55%, transparent)" : "var(--pv-surface)",
      backdropFilter: glass ? "blur(6px)" : undefined,
      border: "1px solid color-mix(in srgb, var(--pv-text) 10%, transparent)",
      boxShadow: glow
        ? "0 0 0 1px color-mix(in srgb, var(--pv-a1) 45%, transparent), 0 0 14px color-mix(in srgb, var(--pv-a1) 20%, transparent)"
        : brutal ? "3px 3px 0 var(--pv-a1)" : undefined,
      borderRadius: brutal ? 2 : 6,
      ...style,
    }}>
      {children}
    </div>
  );
}

// ------------------------------- MOCK KINDS ---------------------------------

function MockStatement({ d, display }: MProps) {
  return (
    <>
      <Nav d={d} />
      <div className="px-3 mt-3">
        <div className="leading-[0.95] font-bold" style={{ fontFamily: display, fontSize: "clamp(11px, 4.6cqmin, 22px)", color: "var(--pv-text)", letterSpacing: "-0.03em" }}>
          {has(d, "stroked") ? <span style={{ WebkitTextStroke: "1px var(--pv-text)", color: "transparent" }}>Design</span> : "Design"}<br />
          that <span style={{ color: "var(--pv-a1)" }}>sells</span> itself.
        </div>
        <div className="mt-1.5 space-y-0.5">
          <Bar w="55%" /> <Bar w="40%" />
        </div>
        <div className="mt-2 flex gap-1">
          <div className="px-2 py-1 rounded-full text-[5px] font-bold" style={{ background: "var(--pv-a1)", color: "#000" }}>Start free</div>
          <div className="px-2 py-1 rounded-full text-[5px]" style={{ border: "1px solid color-mix(in srgb, var(--pv-text) 25%, transparent)", color: "var(--pv-text)" }}>Live demo</div>
        </div>
      </div>
      {has(d, "marquee") && (
        <div className="absolute bottom-1 left-0 right-0 overflow-hidden opacity-70">
          <div className="marquee whitespace-nowrap text-[5px] tracking-widest uppercase" style={{ color: "var(--pv-a2)" }}>
            {Array.from({ length: 2 }).map((_, i) => <span key={i} className="mx-2">{d.effects.join(" ✦ ")} ✦ </span>)}
          </div>
        </div>
      )}
    </>
  );
}

function MockSplit({ d, display }: MProps) {
  return (
    <>
      <Nav d={d} />
      <div className="px-3 mt-2.5 grid grid-cols-2 gap-2 items-center h-[70%]">
        <div>
          <div className="font-bold leading-tight" style={{ fontFamily: display, fontSize: "11px", color: "var(--pv-text)" }}>
            Work at the <span style={{ color: "var(--pv-a1)" }}>speed</span> of thought.
          </div>
          <div className="mt-1 space-y-0.5"><Bar w="80%" /><Bar w="55%" /></div>
          <div className="mt-1.5 px-2 py-0.5 rounded-full text-[5px] font-bold inline-block" style={{ background: "var(--pv-a1)", color: "#000" }}>Try it</div>
        </div>
        <Card d={d} className="p-1.5 h-full flex flex-col gap-1">
          <div className="flex gap-0.5">{[0,1,2].map(i=><div key={i} className="w-1 h-1 rounded-full" style={{ background: i===0?"var(--pv-a1)":"var(--pv-muted)", opacity: i===0?1:.5 }} />)}</div>
          <Bar w="90%" h={2} /> <Bar w="70%" h={2} color="var(--pv-a2)" /> <Spark />
          <div className="grid grid-cols-3 gap-0.5 mt-auto">{[0,1,2].map(i=><div key={i} className="rounded-sm" style={{ height: 8, background: `color-mix(in srgb, var(--pv-a1) ${70 - i * 20}%, transparent)` }} />)}</div>
        </Card>
      </div>
    </>
  );
}

function MockAsymmetric({ d, display }: MProps) {
  return (
    <>
      <Nav d={d} />
      <div className="relative px-3 mt-2 h-[75%]">
        <div className="absolute left-3 top-0 w-[55%]">
          <div className="font-bold leading-[0.95]" style={{ fontFamily: display, fontSize: "15px", color: "var(--pv-text)" }}>
            Bold<br/>ideas,<br/><span style={{ color: "var(--pv-a1)" }}>sharp</span> edges.
          </div>
        </div>
        <Card d={d} className="absolute right-3 top-4 w-[36%] h-[80%]" style={{ background: `linear-gradient(135deg, color-mix(in srgb, var(--pv-a1) 60%, var(--pv-surface)), var(--pv-surface))` }} />
        <div className="absolute left-3 bottom-1 right-12 space-y-0.5"><Bar w="60%" /><Bar w="45%" /></div>
      </div>
    </>
  );
}

function MockImmersive({ d, display }: MProps) {
  return (
    <>
      <div className="absolute inset-0" style={{ background: `radial-gradient(80% 90% at 50% 110%, color-mix(in srgb, var(--pv-a1) 22%, transparent), transparent 65%)` }} />
      <Nav d={d} />
      <div className="absolute inset-0 grid place-items-center">
        <div className="text-center">
          <div className="mx-auto mb-1.5 rounded-full px-2 py-0.5 text-[4.5px] inline-block" style={{ border: "1px solid color-mix(in srgb, var(--pv-a1) 50%, transparent)", color: "var(--pv-a2)" }}>✦ {d.preview.stat}</div>
          <div className="font-bold leading-[0.95]" style={{ fontFamily: display, fontSize: "17px", color: "var(--pv-text)" }}>
            Beyond the<br /><span style={{ background: `linear-gradient(90deg, var(--pv-a1), var(--pv-a2))`, WebkitBackgroundClip: "text", color: "transparent" }}>ordinary</span>
          </div>
        </div>
      </div>
    </>
  );
}

function MockEditorial({ d, display, serif }: MProps) {
  return (
    <>
      <Nav d={d} />
      <div className="px-3 mt-2 grid grid-cols-[1.3fr_1fr] gap-2">
        <div>
          <div className="italic leading-[1.05]" style={{ fontFamily: serif ?? display, fontSize: "12px", color: "var(--pv-text)" }}>
            The art of deliberate design
          </div>
          <div className="mt-1.5 space-y-0.5">
            <Bar w="95%" h={2} /><Bar w="88%" h={2} /><Bar w="60%" h={2} />
          </div>
          <div className="mt-1 text-[4.5px] underline underline-offset-2" style={{ color: "var(--pv-a1)" }}>Continue reading →</div>
        </div>
        <div className="space-y-1">
          <div className="aspect-[3/4] rounded-sm" style={{ background: `linear-gradient(160deg, color-mix(in srgb, var(--pv-a1) 75%, var(--pv-surface)), var(--pv-surface))` }} />
          <Bar w="80%" h={2} />
        </div>
      </div>
      <div className="absolute bottom-1 left-3 right-3 flex justify-between text-[4px] uppercase tracking-widest" style={{ color: "var(--pv-muted)", borderTop: "1px solid color-mix(in srgb, var(--pv-text) 12%, transparent)", paddingTop: 2 }}>
        <span>{d.industries[0]}</span><span>Est. 2025</span><span>{d.preview.stat}</span>
      </div>
    </>
  );
}

function MockDashboard({ d, display }: MProps) {
  return (
    <div className="flex h-full">
      <div className="w-[22%] border-r px-1.5 py-2 space-y-1.5" style={{ borderColor: "color-mix(in srgb, var(--pv-text) 10%, transparent)" }}>
        <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-sm" style={{ background: "var(--pv-a1)" }} /><Bar w="55%" h={3} /></div>
        {["dash", "analytics", "usage", "team", "settings"].map((s, i) => (
          <div key={s} className="text-[4px] px-1 py-0.5 rounded-sm" style={i === 1 ? { background: "color-mix(in srgb, var(--pv-a1) 20%, transparent)", color: "var(--pv-a1)" } : { color: "var(--pv-muted)" }}>{s}</div>
        ))}
      </div>
      <div className="flex-1 p-2 grid grid-cols-3 gap-1 content-start">
        {["Revenue", "Active", "Churn"].map((k, i) => (
          <Card key={k} d={d} className="p-1 col-span-1">
            <div className="text-[3.6px]" style={{ color: "var(--pv-muted)" }}>{k}</div>
            <div className="text-[7px] font-bold" style={{ fontFamily: display, color: i === 2 ? "var(--pv-a2)" : "var(--pv-text)" }}>{["$48.2k", "9,214", "0.8%"][i]}</div>
          </Card>
        ))}
        <Card d={d} className="p-1 col-span-2 h-11">
          <div className="text-[3.6px] mb-0.5" style={{ color: "var(--pv-muted)" }}>Traffic</div>
          <div className="flex items-end gap-[2px] h-6">{[40, 65, 45, 80, 55, 90, 70, 100, 62, 86].map((h, i) => <div key={i} className="flex-1 rounded-t-[1px]" style={{ height: `${h}%`, background: i === 7 ? "var(--pv-a1)" : "color-mix(in srgb, var(--pv-a1) 30%, transparent)" }} />)}</div>
        </Card>
        <Card d={d} className="p-1 h-11 grid place-items-center"><Ring pct={72} /></Card>
      </div>
    </div>
  );
}

function MockConsole({ d }: MProps) {
  const lines = [
    ["$", "motif init --dna " + d.slug],
    ["→", "resolving design tokens…"],
    ["✓", `palette: ${paletteById(d.palettes[0]).name.toLowerCase()}`],
    ["✓", `type: ${typeById(d.typePair).display.family.toLowerCase()}`],
    ["✓", `${d.effects.length} effects wired`],
    ["$", "ship it ▍"],
  ];
  return (
    <div className="p-2 h-full font-mono" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
      <div className="flex gap-0.5 mb-1.5">{["#ff5f57","#febc2e","#28c840"].map(c=><div key={c} className="w-1.5 h-1.5 rounded-full" style={{ background: c }} />)}</div>
      <div className="space-y-[2px] text-[4.6px] leading-relaxed">
        {lines.map(([p, t], i) => (
          <div key={i} style={{ color: p === "✓" ? "var(--pv-a1)" : p === "→" ? "var(--pv-muted)" : "var(--pv-text)" }}>
            <span style={{ color: "var(--pv-a2)" }}>{p}</span> {t}
          </div>
        ))}
      </div>
    </div>
  );
}

function MockChat({ d, display }: MProps) {
  return (
    <div className="p-2 h-full flex flex-col gap-1">
      <div className="flex items-center gap-1 pb-1" style={{ borderBottom: "1px solid color-mix(in srgb, var(--pv-text) 10%, transparent)" }}>
        <div className="w-2.5 h-2.5 rounded-full" style={{ background: `linear-gradient(135deg, var(--pv-a1), var(--pv-a2))` }} />
        <div className="text-[5px] font-bold" style={{ fontFamily: display, color: "var(--pv-text)" }}>{d.name}</div>
        <div className="ml-auto text-[3.8px]" style={{ color: "var(--pv-a1)" }}>● online</div>
      </div>
      <div className="self-end max-w-[70%] rounded-lg rounded-br-sm px-1.5 py-1 text-[4.4px]" style={{ background: "var(--pv-a1)", color: "#000" }}>Make it feel alive ✨</div>
      <Card d={d} className="self-start max-w-[75%] rounded-lg rounded-bl-sm px-1.5 py-1 text-[4.4px]" style={{ color: "var(--pv-text)" }}>
        Crafting motion system… <span style={{ color: "var(--pv-a1)" }}>▍</span>
      </Card>
      <div className="mt-auto rounded-full px-2 py-1 flex items-center justify-between" style={{ border: "1px solid color-mix(in srgb, var(--pv-text) 15%, transparent)" }}>
        <span className="text-[4px]" style={{ color: "var(--pv-muted)" }}>Message…</span>
        <span className="text-[5px]" style={{ color: "var(--pv-a1)" }}>➤</span>
      </div>
    </div>
  );
}

function MockCanvas({ d }: MProps) {
  return (
    <div className="h-full relative" style={{ backgroundImage: "radial-gradient(color-mix(in srgb, var(--pv-muted) 35%, transparent) 0.7px, transparent 0.7px)", backgroundSize: "10px 10px" }}>
      <Card d={d} className="absolute left-[12%] top-[15%] w-[38%] p-1.5">
        <div className="flex gap-0.5 mb-1"><div className="w-1 h-1 rounded-full" style={{ background: "var(--pv-a1)" }} /><div className="w-1 h-1 rounded-full" style={{ background: "var(--pv-a2)" }} /></div>
        <Bar w="80%" h={2} /><div className="mt-0.5"><Bar w="55%" h={2} /></div>
      </Card>
      <Card d={d} className="absolute right-[10%] bottom-[18%] w-[42%] p-1.5">
        <div className="grid grid-cols-2 gap-0.5">{[80, 50, 65, 40].map((o, i) => <div key={i} className="rounded-sm" style={{ height: 7, background: `color-mix(in srgb, ${i % 2 ? "var(--pv-a2)" : "var(--pv-a1)"} ${o}%, transparent)` }} />)}</div>
      </Card>
      <svg className="absolute inset-0 w-full h-full pointer-events-none"><line x1="30%" y1="32%" x2="68%" y2="55%" stroke="var(--pv-a1)" strokeWidth="0.5" strokeDasharray="2 2" /></svg>
    </div>
  );
}

function MockBento({ d, display }: MProps) {
  return (
    <>
      <Nav d={d} />
      <div className="p-2 grid grid-cols-3 grid-rows-2 gap-1 h-[80%]">
        <Card d={d} className="col-span-2 row-span-1 p-1.5 flex flex-col justify-between">
          <div className="text-[7px] font-bold" style={{ fontFamily: display, color: "var(--pv-text)" }}>Everything in one place</div>
          <Spark />
        </Card>
        <Card d={d} className="p-1.5 grid place-items-center" style={{ background: "color-mix(in srgb, var(--pv-a1) 85%, transparent)" }}>
          <span className="text-[9px] font-black" style={{ color: "#000" }}>99%</span>
        </Card>
        <Card d={d} className="p-1 grid place-items-center"><Ring pct={55} color="var(--pv-a2)" /></Card>
        <Card d={d} className="col-span-2 p-1 flex items-end gap-[2px]">{[30, 55, 40, 70, 85, 60, 95].map((h, i) => <div key={i} className="flex-1 rounded-t-[1px]" style={{ height: `${h}%`, background: "color-mix(in srgb, var(--pv-a2) 55%, transparent)" }} />)}</Card>
      </div>
    </>
  );
}

function MockPoster({ d, display }: MProps) {
  const neon = has(d, "neonsign");
  return (
    <div className="h-full grid place-items-center relative">
      <div className="text-center px-3">
        <div className="text-[4px] tracking-[0.3em] uppercase mb-1" style={{ color: "var(--pv-a2)" }}>{d.industries[0]} · {d.preview.stat}</div>
        <div className="font-black leading-[0.9] uppercase" style={{
          fontFamily: display, fontSize: "20px",
          color: neon ? "var(--pv-a1)" : has(d, "stroked") ? "transparent" : "var(--pv-text)",
          WebkitTextStroke: has(d, "stroked") ? "1px var(--pv-a1)" : undefined,
          textShadow: neon ? "0 0 8px var(--pv-a1), 0 0 20px color-mix(in srgb, var(--pv-a1) 60%, transparent)" : undefined,
        }}>
          {d.name}
        </div>
        <div className="mx-auto mt-1.5 h-[2px] w-8" style={{ background: `linear-gradient(90deg, var(--pv-a1), var(--pv-a2))` }} />
      </div>
      <div className="absolute bottom-1 left-0 right-0 text-center text-[4px] uppercase tracking-widest" style={{ color: "var(--pv-muted)" }}>{d.vibe.slice(0, 42)}</div>
    </div>
  );
}

function MockHud({ d, display }: MProps) {
  return (
    <div className="h-full p-2 grid grid-cols-[1fr_auto] gap-1.5">
      <div className="space-y-1">
        <div className="text-[4px] uppercase tracking-widest" style={{ color: "var(--pv-muted)" }}>{d.name}</div>
        <div className="text-[11px] font-black uppercase" style={{ fontFamily: display, color: "var(--pv-text)", textShadow: has(d, "neonsign") ? "0 0 10px var(--pv-a1)" : undefined }}>
          LVL <span style={{ color: "var(--pv-a1)" }}>27</span>
        </div>
        {(["HP 82%", "XP 64%", "STA 91%"] as const).map((k, i) => (
          <div key={k}>
            <div className="text-[3.6px] mb-[1px]" style={{ color: "var(--pv-muted)" }}>{k}</div>
            <div className="h-1 rounded-full overflow-hidden" style={{ background: "color-mix(in srgb, var(--pv-muted) 25%, transparent)" }}>
              <div className="h-full rounded-full" style={{ width: [82, 64, 91][i] + "%", background: i === 0 ? "var(--pv-a1)" : i === 1 ? "var(--pv-a2)" : "var(--pv-muted)" }} />
            </div>
          </div>
        ))}
      </div>
      <Card d={d} className="w-12 p-1 flex flex-col justify-between">
        <div className="text-[3.4px] text-center" style={{ color: "var(--pv-muted)" }}>SCORE</div>
        <div className="text-[10px] font-black text-center" style={{ color: "var(--pv-a1)", fontFamily: display }}>24.9K</div>
        <div className="grid grid-cols-3 gap-[2px]">{[1,2,3,4,5,6].map(i=><div key={i} className="aspect-square rounded-[1px]" style={{ background: i<=4?"color-mix(in srgb, var(--pv-a2) 60%, transparent)":"color-mix(in srgb, var(--pv-muted) 30%, transparent)" }} />)}</div>
      </Card>
    </div>
  );
}

function MockCardGame({ d, display }: MProps) {
  return (
    <div className="h-full grid place-items-center relative">
      <div className="relative w-28 h-16">
        {[0, 1, 2].map((i) => (
          <Card key={i} d={d} className="absolute inset-x-6 inset-y-0 origin-bottom" style={{
            transform: `rotate(${(i - 1) * 14}deg) translateY(${Math.abs(i - 1) * 1}px)`,
            background: `linear-gradient(160deg, color-mix(in srgb, var(--pv-a${i % 2 ? 2 : 1}) ${25 + i * 12}%, var(--pv-surface)), var(--pv-surface) 70%)`,
          }}>
            <div className="p-1">
              <div className="w-2 h-2 rounded-sm" style={{ background: i === 1 ? "var(--pv-a1)" : "var(--pv-a2)" }} />
              <div className="mt-4 text-[4px] font-bold" style={{ fontFamily: display, color: "var(--pv-text)" }}>{["GRYPHON", "NYX", "AETHER"][i]}</div>
              <div className="text-[3.2px]" style={{ color: "var(--pv-muted)" }}>mana {3 + i * 2}</div>
            </div>
          </Card>
        ))}
      </div>
      <div className="absolute bottom-1 text-[4px] tracking-widest uppercase" style={{ color: "var(--pv-a2)" }}>hand · 3 drawn</div>
    </div>
  );
}

interface MProps { d: DesignDNA; display: string; serif?: string }

// ------------------------------ MAIN EXPORT ---------------------------------

export default function LivePreview({ design: d, state = {}, className = "" }: { design: DesignDNA; state?: PreviewState; className?: string }) {
  const palette = paletteById(state.paletteId ?? d.palettes[0]);
  const type = typeById(state.typeId ?? d.typePair);
  const display = type.display.css;
  const serif = type.display.family.includes("Playfair") || type.display.family.includes("Source") || type.display.family.includes("Marcellus") || type.display.family.includes("Italiana") ? display : undefined;

  const mock = d.preview.mock;
  return (
    <div
      className={`relative overflow-hidden w-full h-full ${className}`}
      style={{ ...vars(palette), background: "var(--pv-bg)", containerType: "size" } as React.CSSProperties}
    >
      {fxOverlay(d)}
      {mock === "statement" && <MockStatement d={d} display={display} />}
      {mock === "split" && <MockSplit d={d} display={display} />}
      {mock === "asymmetric" && <MockAsymmetric d={d} display={display} />}
      {mock === "immersive" && <MockImmersive d={d} display={display} />}
      {mock === "editorial" && <MockEditorial d={d} display={display} serif={serif} />}
      {mock === "dashboard" && <MockDashboard d={d} display={display} />}
      {mock === "console" && <MockConsole d={d} display={display} />}
      {mock === "chatui" && <MockChat d={d} display={display} />}
      {mock === "canvas" && <MockCanvas d={d} display={display} />}
      {mock === "bento" && <MockBento d={d} display={display} />}
      {mock === "poster" && <MockPoster d={d} display={display} />}
      {mock === "hud" && <MockHud d={d} display={display} />}
      {mock === "cardgame" && <MockCardGame d={d} display={display} />}
      {has(d, "grain") && <div className="absolute inset-0 pointer-events-none opacity-[0.07]" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60'%3E%3Cfilter id='n'%3E%3CfeTurbulence baseFrequency='0.9'/%3E%3C/filter%3E%3Crect width='60' height='60' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E\")" }} />}
      <div className="absolute inset-0 pointer-events-none" style={{ boxShadow: "inset 0 0 0 1px color-mix(in srgb, var(--pv-text) 8%, transparent)" }} />
    </div>
  );
}
