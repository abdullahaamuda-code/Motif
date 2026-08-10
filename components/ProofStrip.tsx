import Reveal from "./Reveal";

const PROOF = [
  { h: "01", t: "Pick a spine", d: "Every entry carries a full DNA capsule — hero pattern, section flow, motion grammar." },
  { h: "02", t: "Remix the DNA", d: "Swap palettes and type systems live; the prompt updates with your exact choices." },
  { h: "03", t: "Ship anywhere", d: "Vibe brief, raw spec, or AGENTS.md — paste into Cursor, v0, Claude, or your own agent." },
];

export default function ProofStrip() {
  return (
    <section className="border-y border-white/5 bg-black/30">
      <div className="mx-auto max-w-6xl px-4 py-14 grid md:grid-cols-3 gap-8">
        {PROOF.map((p, i) => (
          <Reveal key={p.h} delay={i * 90}>
            <div className="flex gap-4 items-start">
              <span className="font-display text-3xl font-bold bg-gradient-to-b from-violet-400 to-transparent bg-clip-text text-transparent">{p.h}</span>
              <div>
                <div className="font-display font-bold text-sm">{p.t}</div>
                <p className="mt-1 text-xs text-zinc-400 leading-relaxed">{p.d}</p>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
