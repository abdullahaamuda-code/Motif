import { ALL, PALETTES, TYPE_SYSTEMS } from "@/lib/data";
import Link from "next/link";
import Nav from "@/components/Nav";
import AtlasRoom from "@/components/AtlasRoom";
import Footer from "@/components/Footer";
import { RegMark } from "@/components/Icon";

export const metadata = {
  title: "Motif — The Press Room",
  description: "Browse the full atlas of premium design proofs. Remix live, copy the prompt.",
};

export default function AtlasPage() {
  return (
    <>
      <Nav />
      <div className="mx-auto max-w-6xl px-4 pt-6">
        <Link href="/" className="inline-flex items-center gap-1.5 text-[11px] font-mono uppercase tracking-[0.14em] text-paper-faint hover:text-paper transition group">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="group-hover:-translate-x-0.5 transition"><path d="M19 12H5" /><path d="m12 19-7-7 7-7" /></svg>
          Back to the desk
        </Link>
      </div>
      <div className="mx-auto max-w-6xl px-4 py-10 md:py-14">
        <div className="max-w-2xl">
          <h1 className="font-display font-medium tracking-[-0.02em] leading-[1.0] text-4xl md:text-6xl">
            <span className="line-mask"><span className="line-rise" style={{ animationDelay: "60ms" }}>Every proof. <em className="italic font-semibold text-proof">Live.</em></span></span>
          </h1>
          <p className="line-mask text-paper-dim mt-3 text-base md:text-lg">
            <span className="line-rise block" style={{ animationDelay: "220ms" }}>
              {ALL.length} designs, rendered from DNA — no screenshots. Tap one to remix palette, type, and voice, then copy the exact prompt your tool needs.
            </span>
          </p>
          <div className="line-rise flex items-center gap-2 ticket mt-4" style={{ animationDelay: "360ms" }}>
            <RegMark size={9} className="text-proof/80" />
            {PALETTES.length} palettes · {TYPE_SYSTEMS.length} type systems
          </div>
        </div>
        <div className="mt-10">
          <AtlasRoom designs={ALL} palettes={PALETTES} types={TYPE_SYSTEMS} />
        </div>
      </div>
      <Footer />
    </>
  );
}
