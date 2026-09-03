"use client";

import { useEffect, useState } from "react";
import type { DesignDNA } from "@/lib/data/types";
import LivePreview from "./LivePreview";
import Reveal from "./Reveal";
import Link from "next/link";
import { loadCatalog } from "@/lib/client-data";
import { Icon } from "./Icon";

function ProofCard({ d, tall = false }: { d: DesignDNA; tall?: boolean }) {
  return (
    <Link
      href={`/atlas?open=${d.slug}`}
      className={`card-lift group relative flex flex-col rounded-xl overflow-hidden border border-hairline ${tall ? "h-[340px] md:h-[400px]" : "h-[190px]"}`}
    >
      <div className="relative flex-1 min-h-0">
        <LivePreview design={d} className="absolute inset-0" />
        <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-ink/70 to-transparent" />
      </div>
      <div className="shrink-0 bg-ink-2 hairline-t px-4 py-2.5 flex items-center justify-between gap-4">
        <div className="min-w-0">
          <div className="font-display font-semibold text-[15px] md:text-base truncate">{d.name}</div>
          <div className="text-[11px] text-paper-dim mt-0.5 line-clamp-1">{d.vibe}</div>
        </div>
        <span className="shrink-0 flex items-center gap-1 text-[10px] font-mono uppercase tracking-widest text-paper-faint group-hover:text-proof transition-colors">
          open <Icon name="arrow" size={11} className="transition-transform duration-300 group-hover:translate-x-0.5" />
        </span>
      </div>
    </Link>
  );
}

export default function CraftSection() {
  const [featured, setFeatured] = useState<DesignDNA[]>([]);
  useEffect(() => {
    loadCatalog().then((c) => setFeatured(c.designs.filter((d) => d.featured).slice(0, 5)));
  }, []);

  const [lead, ...rest] = featured;
  const band = [lead, ...rest].filter(Boolean).slice(0, 5);
  if (band.length < 5) {
    return (
      <section id="craft" className="mx-auto max-w-6xl px-4 py-24">
        <div className="loading-sheet rounded-xl h-64" />
      </section>
    );
  }

  return (
    <section id="craft" className="mx-auto max-w-6xl px-4 py-20 md:py-28">
      <Reveal>
        <div className="max-w-2xl">
          <h2 className="font-display font-medium tracking-[-0.02em] leading-[1.02] text-4xl md:text-6xl">
            The proofs people<br />
            keep <em className="italic font-semibold text-proof">stealing.</em>
          </h2>
        </div>
      </Reveal>

      <Reveal delay={140}>
        <div className="mt-12 grid md:grid-cols-2 gap-4">
          <ProofCard d={band[0]} tall />
          <div className="grid gap-4">
            <ProofCard d={band[1]} />
            <ProofCard d={band[2]} />
          </div>
        </div>
      </Reveal>

      <Reveal delay={200}>
        <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-4">
          <ProofCard d={band[3]} />
          <ProofCard d={band[4]} />
          <Link href="/atlas" className="card-lift sheet rounded-xl h-[190px] grid place-items-center group">
            <div className="text-center px-6">
              <div className="font-display font-semibold text-[15px] group-hover:text-proof transition-colors">Pull the full atlas</div>
              <div className="text-[11px] text-paper-faint mt-1">web, apps & games — all live</div>
            </div>
          </Link>
        </div>
      </Reveal>
    </section>
  );
}
