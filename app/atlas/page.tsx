import { ALL, PALETTES, TYPE_SYSTEMS } from "@/lib/data";
import Link from "next/link";
import Nav from "@/components/Nav";
import AtlasRoom from "@/components/AtlasRoom";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Motif — The Design Room",
  description: "Browse the full atlas of premium design DNAs.",
};

export default function AtlasPage() {
  return (
    <>
      <Nav />
      <div className="mx-auto max-w-6xl px-4 pt-6">
        <Link href="/" className="inline-flex items-center gap-1.5 text-[11px] text-zinc-500 hover:text-white transition group">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="group-hover:-translate-x-0.5 transition"><path d="M19 12H5" /><path d="m12 19-7-7 7-7" /></svg>
          Back home
        </Link>
      </div>
      <div className="mx-auto max-w-6xl px-4 py-10">
        <RevealHeader />
        <AtlasRoom designs={ALL} palettes={PALETTES} types={TYPE_SYSTEMS} />
      </div>
      <Footer />
    </>
  );
}

function RevealHeader() {
  return (
    <div className="text-center max-w-lg mx-auto mb-8 reveal">
      <p className="text-[11px] uppercase tracking-[0.3em] text-cyan-300">The Room</p>
      <h1 className="font-display mt-3 text-4xl md:text-5xl font-bold tracking-tight">Every design. Live.<br/><span className="text-zinc-500">No screenshots.</span></h1>
      <p className="mt-3 text-sm text-zinc-400">Tap any card to remix palette, type, and voice — then copy the exact prompt your tool needs.</p>
    </div>
  );
}
