"use client";

import { useState } from "react";
import { Icon, RegMark } from "./Icon";

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
    const text = `Found Motif — a free atlas of premium design proofs. Vibe briefs, raw specs & AGENTS.md files, all free:\n${url}`;
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
      <div className="absolute inset-0 bg-ink/85 backdrop-blur-sm backdrop-in" onClick={onClose} />
      <div className="modal-in relative sheet-deep rounded-2xl p-6 max-w-sm w-full text-center border border-proof/25 shadow-[var(--shadow-lift)]">
        <div className="mx-auto mb-3 w-11 h-11 rounded-full grid place-items-center bg-proof/15 text-proof">
          <Icon name="spark" size={18} />
        </div>
        <h4 className="font-display font-semibold text-xl">{copied ? "Link copied" : "Prompt copied"}</h4>
        <p className="mt-2 text-[13px] text-paper-dim leading-relaxed">
          Motif stays free because people share it. Send this along once and you're part of it.
        </p>
        <div className="mt-5 flex gap-2 justify-center">
          <button onClick={() => void share()} className="rounded-xl bg-proof text-ink px-5 py-2 text-sm font-bold hover:bg-proof-soft transition btn-press">
            {copied ? "Done" : "Share Motif"}
          </button>
          <button onClick={onClose} className="rounded-xl bg-ink-3 hover:bg-ink-4 px-4 py-2 text-sm text-paper-dim transition btn-press">Later</button>
        </div>
        <div className="mt-4 flex items-center justify-center gap-1.5 ticket">
          <RegMark size={8} className="text-proof/70" /> proofed free, forever
        </div>
      </div>
    </div>
  );
}
