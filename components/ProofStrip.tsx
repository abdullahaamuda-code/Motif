import Reveal from "./Reveal";
import { RegMark } from "./Icon";

const STEPS = [
  { n: "STEP 1", t: "Pull a proof", d: "Every entry carries a full DNA capsule — hero pattern, section flow, motion grammar — rendered live on the table." },
  { n: "STEP 2", t: "Mark it up", d: "Swap palettes and type systems in real time; the proof re-renders and the prompt rewrites itself with your choices." },
  { n: "STEP 3", t: "Send it to press", d: "Vibe brief, raw spec, or AGENTS.md — paste into Cursor, v0, Claude, or your own agent. Ship the thing." },
];

export default function ProofStrip() {
  return (
    <section id="process" className="hairline-t hairline-b bg-ink-2/60">
      <div className="mx-auto max-w-6xl px-4 grid md:grid-cols-3 md:divide-x md:divide-[rgba(243,239,231,0.1)]">
        {STEPS.map((p, i) => (
          <Reveal key={p.n} delay={i * 110}>
            <div className="flex gap-4 items-start py-8 md:px-7 first:md:pl-0 last:md:pr-0">
              <span className="mt-0.5 text-proof/80"><RegMark size={13} /></span>
              <div>
                <div className="ticket">{p.n}</div>
                <div className="font-display font-semibold text-lg mt-1.5">{p.t}</div>
                <p className="mt-1.5 text-[13px] text-paper-dim leading-relaxed">{p.d}</p>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
