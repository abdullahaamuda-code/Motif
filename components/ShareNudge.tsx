"use client";

import { useState } from "react";
import { Icon } from "./Icon";

const SHARED_KEY = "motif_shared_at";
const NUDGE_COOLDOWN = 3 * 24 * 60 * 60 * 1000; // don't re-ask for 3 days after sharing

export function shouldNudge(): boolean {
  if (typeof window === "undefined") return false;
  const shared = Number(localStorage.getItem(SHARED_KEY) ?? 0);
  return !shared || Date.now() - shared > NUDGE_COOLDOWN;
}

export function ShareNudge({ onClose }: { onClose: () => void }) {
  const [copied, setCopied] = useState(false);
  const url = typeof window !== "undefined" ? window.location.origin : "";

  const share = async () => {
    const text = `Found Motif — a free atlas of premium design prompts. Vibe briefs, raw specs & AGENT.md files, all free:\n${url}`;
    if (navigator.share) {
      try { await navigator.share({ title: "Motif", text, url }); localStorage.setItem(SHARED_KEY, String(Date.now())); } catch { /* dismissed */ }
    } else {
      await navigator.clipboard.writeText(text);
      localStorage.setItem(SHARED_KEY, String(Date.now()));
      setCopied(true);
    }
    setTimeout(onClose, 1200);
  };

  return (
    <div className="fixed inset-0 z-[80] grid place-items-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm backdrop-in" onClick={onClose} />
      <div className="modal-in relative glass-deep rounded-2xl p-6 max-w-sm w-full text-center border border-violet-400/25 shadow-[0_30px_100px_-20px_rgba(139,92,246,.5)]">
        <div className="mx-auto mb-3 w-11 h-11 rounded-full grid place-items-center bg-violet-500/15 text-violet-300">
          <Icon name="spark" size={18} />
        </div>
        <h4 className="font-display font-bold text-lg">{copied ? "Link copied ✓" : "Prompt copied 🎉"}</h4>
        <p className="mt-2 text-[13px] text-zinc-400 leading-relaxed">
          Motif stays free because people share it. Send this along once and you're part of it.
        </p>
        <div className="mt-4 flex gap-2 justify-center">
          <button onClick={() => void share()} className="rounded-xl bg-white text-zinc-950 px-5 py-2 text-sm font-bold hover:bg-violet-200 transition">
            {copied ? "Done" : "Share Motif"}
          </button>
          <button onClick={onClose} className="rounded-xl bg-white/6 hover:bg-white/10 px-4 py-2 text-sm text-zinc-400 transition">Later</button>
        </div>
      </div>
    </div>
  );
}
