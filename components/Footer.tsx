import Link from "next/link";
import { RegMark } from "./Icon";

export default function Footer() {
  return (
    <footer className="hairline-t mt-16">
      <div className="mx-auto max-w-6xl px-4 py-10 md:py-14">
        {/* compact mobile */}
        <div className="md:hidden">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 font-display font-semibold text-sm">
              <span className="text-proof"><RegMark size={12} /></span>
              Motif
            </div>
            <div className="flex gap-4 text-[11px] text-paper-dim">
              <Link href="/atlas" className="hover:text-paper transition">The Room</Link>
              <Link href="/#process" className="hover:text-paper transition">Process</Link>
            </div>
          </div>
          <p className="mt-4 text-[11px] text-paper-faint leading-relaxed">
            Free forever. Live-rendered DNA, remixed in your browser, shipped as prompts.
          </p>
        </div>

        {/* desktop colophon */}
        <div className="hidden md:grid gap-10 md:grid-cols-[1.5fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-2 font-display font-semibold text-lg">
              <span className="text-proof"><RegMark size={13} /></span>
              Motif
            </div>
            <p className="mt-3 text-[13px] text-paper-dim max-w-sm leading-relaxed">
              An open atlas of premium design DNA — proofed live in your browser,
              compiled into prompts your tools already understand.
            </p>
            <p className="mt-5 ticket">Set in Bodoni Moda · Archivo · Fragment Mono</p>
          </div>
          <div>
            <div className="ticket mb-3">The Room</div>
            <ul className="space-y-2 text-[13px] text-paper-dim">
              <li><Link className="hover:text-paper transition" href="/atlas">All proofs</Link></li>
              <li><Link className="hover:text-paper transition" href="/atlas">Web & landing</Link></li>
              <li><Link className="hover:text-paper transition" href="/atlas">Apps & UI</Link></li>
              <li><Link className="hover:text-paper transition" href="/atlas">Games & interactive</Link></li>
            </ul>
          </div>
          <div>
            <div className="ticket mb-3">Press notes</div>
            <ul className="space-y-2 text-[13px] text-paper-dim">
              <li>Live-rendered DNA — no screenshots</li>
              <li>Vibe · Raw · Agent copy modes</li>
              <li>The Director, on call</li>
              <li>Installable, works offline</li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-5 hairline-t flex items-center justify-between">
          <p className="text-[10px] font-mono uppercase tracking-[0.16em] text-paper-faint">Motif — free forever · MIT</p>
          <p className="text-[10px] font-mono uppercase tracking-[0.16em] text-paper-faint hidden sm:block">proofed live, never screenshotted</p>
        </div>
      </div>
    </footer>
  );
}
