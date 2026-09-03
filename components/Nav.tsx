"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Director from "./Director";
import { Icon, MotifMark } from "./Icon";
import { sfx, setMuted, isMuted } from "@/lib/sound";

export default function Nav() {
  const [chatOpen, setChatOpen] = useState(false);
  const [installEvt, setInstallEvt] = useState<Event | null>(null);
  const [mute, setMute] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const path = usePathname();

  useEffect(() => {
    const onPrompt = (e: Event) => { e.preventDefault(); setInstallEvt(e); };
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("beforeinstallprompt", onPrompt);
    window.addEventListener("scroll", onScroll, { passive: true });
    setMute(isMuted());
    return () => {
      window.removeEventListener("beforeinstallprompt", onPrompt);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  const toggleMute = () => { const m = !isMuted(); setMuted(m); setMute(m); sfx.chip(); };

  return (
    <>
      <header className={`sticky top-0 z-40 transition-all duration-500 ${scrolled ? "hairline-b bg-ink/90 backdrop-blur-xl" : "border-b border-transparent"}`}>
        <div className="mx-auto max-w-6xl px-4 h-14 flex items-center justify-between">
          <Link href="/" className="group flex items-center gap-2.5 font-display font-semibold tracking-tight text-[15px]">
            <MotifMark size={26} className="shadow-[0_2px_12px_rgba(0,0,0,0.5)] transition-transform duration-500 group-hover:rotate-90" />
            Motif
          </Link>
          <nav className="hidden md:flex items-center gap-7 text-xs text-paper-dim">
            <Link className={`transition hover:text-paper ${path.startsWith("/atlas") ? "text-paper" : ""}`} href="/atlas">The Room</Link>
            <a className="transition hover:text-paper" href="/#craft">Proof Wall</a>
            <a className="transition hover:text-paper" href="/#process">Process</a>
          </nav>
          <div className="flex items-center gap-1.5">
            <button onClick={toggleMute} aria-label="toggle sound" className={`p-2 rounded-lg transition text-paper-faint hover:text-paper ${mute ? "opacity-50" : ""}`}>
              <Icon name={mute ? "mute" : "volume"} size={15} />
            </button>
            {installEvt && (
              <button onClick={() => { (installEvt as Event & { prompt: () => void }).prompt(); setInstallEvt(null); }}
                className="hidden sm:flex items-center gap-1.5 rounded-full border border-hairline px-3 py-1.5 text-[11px] text-paper-dim hover:text-paper hover:border-paper-dim transition btn-press">
                <Icon name="download" size={12} /> Install
              </button>
            )}
            <button onClick={() => { sfx.open(); setChatOpen(true); }}
              className="flex items-center gap-1.5 rounded-full bg-proof text-ink px-3.5 py-1.5 text-xs font-semibold transition hover:bg-proof-soft btn-press">
              <Icon name="chat" size={13} /> Director
            </button>
          </div>
        </div>
      </header>
      {chatOpen && <Director onClose={() => setChatOpen(false)} />}
    </>
  );
}
