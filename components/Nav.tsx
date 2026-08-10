"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Director from "./Director";
import { Icon } from "./Icon";
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
    return () => {
      window.removeEventListener("beforeinstallprompt", onPrompt);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  const toggleMute = () => { const m = !isMuted(); setMuted(m); setMute(m); sfx.chip(); };

  return (
    <>
      <header className={`sticky top-0 z-40 transition-all duration-300 ${scrolled ? "border-b border-white/8 bg-[#08080c]/85 backdrop-blur-xl" : "bg-transparent"}`}>
        <div className="mx-auto max-w-6xl px-4 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-display font-bold tracking-tight">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.png" alt="Motif" width={26} height={26} className="rounded-lg shadow-[0_4px_18px_rgba(139,92,246,.4)]" />
            Motif
          </Link>
          <nav className="hidden md:flex items-center gap-6 text-xs text-zinc-400">
            <Link className={`hover:text-white transition ${path.startsWith("/atlas") ? "text-white" : ""}`} href="/atlas">The Room</Link>
            <a className="hover:text-white transition" href="/#craft">Craft</a>
          </nav>
          <div className="flex items-center gap-1.5">
            <button onClick={toggleMute} aria-label="toggle sound" className={`p-2 rounded-lg transition text-zinc-500 hover:text-white ${mute ? "opacity-40" : ""}`}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M11 5 6 9H2v6h4l5 4V5z"/>{mute ? <path d="m22 9-6 6m0-6 6 6" strokeWidth="2"/> : <path d="M15.54 8.46a5 5 0 0 1 0 7.07"/>}</svg>
            </button>
            {installEvt && (
              <button onClick={() => { (installEvt as Event & { prompt: () => void }).prompt(); setInstallEvt(null); }}
                className="hidden sm:flex items-center gap-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 px-3 py-1.5 text-[11px] text-zinc-300 transition">
                <Icon name="download" size={12} /> Install
              </button>
            )}
            <button onClick={() => { sfx.open(); setChatOpen(true); }}
              className="flex items-center gap-1.5 rounded-full bg-white text-zinc-950 hover:bg-violet-200 px-3.5 py-1.5 text-xs font-semibold transition">
              <Icon name="chat" size={13} /> Director
            </button>
          </div>
        </div>
      </header>
      {chatOpen && <Director onClose={() => setChatOpen(false)} />}
    </>
  );
}
