"use client";

import { useEffect, useState } from "react";
import type { DesignDNA } from "@/lib/data/types";
import LivePreview from "./LivePreview";
import Reveal from "./Reveal";
import Link from "next/link";
import { loadCatalog } from "@/lib/client-data";

export default function CraftSection() {
  const [featured, setFeatured] = useState<DesignDNA[]>([]);
  useEffect(() => {
    loadCatalog().then((c) => setFeatured(c.designs.filter((d) => d.featured).slice(0, 5)));
  }, []);

  const [lead, ...rest] = featured;
  const band = [lead, ...rest].slice(0, 5);
  if (band.length < 5) return <div className="py-20 text-center text-zinc-600 text-xs">loading featured…</div>;

  return (
    <section id="craft" className="mx-auto max-w-6xl px-4 py-20 md:py-28">
      <Reveal>
        <div className="text-center max-w-xl mx-auto">
          <p className="text-[11px] uppercase tracking-[0.3em] text-violet-400">Featured</p>
          <h2 className="font-display mt-3 text-3xl md:text-5xl font-bold tracking-tight leading-[1.03]">
            The ones people<br />keep <span className="gradient-text italic">stealing.</span>
          </h2>
        </div>
      </Reveal>

      <Reveal delay={150}>
        <div className="mt-12 grid md:grid-cols-2 gap-4">
          <div className="relative rounded-2xl overflow-hidden border border-white/10 min-h-[300px] group">
            <LivePreview design={band[0]} className="absolute inset-0" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
            <div className="absolute bottom-0 p-5">
              <div className="font-display font-bold text-xl">{band[0].name}</div>
              <div className="text-[11px] text-zinc-300 mt-1">{band[0].vibe}</div>
            </div>
          </div>
          <div className="grid gap-4">
            {[band[1], band[2]].filter(Boolean).map((d) => d && (
              <div key={d.slug} className="relative rounded-2xl overflow-hidden border border-white/10 min-h-[142px]">
                <LivePreview design={d} className="absolute inset-0" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
                <div className="absolute bottom-0 p-3">
                  <div className="font-display font-bold text-sm">{d.name}</div>
                  <div className="text-[10px] text-zinc-300">{d.vibe}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Reveal>

      <Reveal delay={200}>
        <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-4">
          {[band[3], band[4]].filter(Boolean).map((d) => d && (
            <div key={d.slug} className="relative rounded-2xl overflow-hidden border border-white/10 min-h-[150px]">
              <LivePreview design={d} className="absolute inset-0" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
              <div className="absolute bottom-0 p-3">
                <div className="font-display font-bold text-sm">{d.name}</div>
              </div>
            </div>
          ))}
          <Link href="/atlas" className="glass rounded-2xl min-h-[150px] grid place-items-center group">
            <div className="text-center">
              <div className="text-2xl mb-1">→</div>
              <div className="font-display font-bold text-sm group-hover:text-violet-300 transition">Browse the rest</div>
              <div className="text-[10px] text-zinc-500 mt-1">premium catalog, apps & games</div>
            </div>
          </Link>
        </div>
      </Reveal>
    </section>
  );
}
