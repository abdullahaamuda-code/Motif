"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Icon, MotifMark } from "./Icon";
import RichText from "./RichText";
import { readSSE } from "@/lib/sse";
import { sfx } from "@/lib/sound";
import {
  loadThreads, newThread, saveThread, deleteThread, titleFrom,
  type Thread,
} from "@/lib/director-memory";

interface Msg { role: "user" | "assistant"; content: string }

const OPENERS = [
  { icon: "monitor", chip: "Dark luxury fintech", ask: "I'm building a fintech dashboard — something dark, luxurious, Linear-grade calm. Recommend DNA and write the full prompt." },
  { icon: "layers", chip: "Claude × Linear hybrid", ask: "Land on something that mixes Claude's warmth with Linear's precision. Find the closest DNA and adapt it into a full prompt." },
  { icon: "grid", chip: "Arcade game HUD", ask: "Game UI with neon arcade HUD — HP bars, score counters, pixel accents. Which DNA fits? Write the prompt." },
  { icon: "image", chip: "Award-tier portfolio", ask: "Portfolio that feels Awwwards-tier — editorial serif, heroic type, scroll reveals. Give me the complete spec prompt." },
];

function getClientId(): string {
  let id = localStorage.getItem("motif_cid");
  if (!id) { id = crypto.randomUUID(); localStorage.setItem("motif_cid", id); }
  return id;
}

// Parse QUESTIONS: from director output
function parseQuestions(content: string): Array<{ q: string; options: string[] }> {
  const marker = content.match(/QUESTIONS?:?\s*\n([\s\S]*?)(?=\n\n|\n?$|$)/i);
  if (!marker) return [];
  return marker[1]
    .split("\n")
    .map((l) => l.replace(/^\d+\.\s*/, "").trim())
    .filter(Boolean)
    .slice(0, 2)
    .map((line) => {
      const m = line.match(/^(.*?)\s*\(([^)]+)\)\s*$/);
      if (!m) return { q: line, options: [] };
      return { q: m[1].trim(), options: m[2].split("|").map((o) => o.trim()).filter(Boolean).slice(0, 4) };
    });
}

function stripQuestions(content: string): string {
  return content.replace(/\n*\s*QUESTIONS?:?\s*\n[\s\S]*$/i, "").trim();
}

// ---- wizard handled registry: remember which replies we already surfaced ----
// (survives thread switches + full closes so a question NEVER pops twice)
const HANDLED_KEY = "motif_wizard_handled_v1";
const hkey = (s: string) => `${s.length}:${s.slice(0, 32)}`;
function wizardHandled(key: string): boolean {
  try { return new Set(JSON.parse(localStorage.getItem(HANDLED_KEY) ?? "[]")).has(key); } catch { return false; }
}
function markWizardHandled(key: string) {
  try {
    const set = new Set<string>(JSON.parse(localStorage.getItem(HANDLED_KEY) ?? "[]"));
    set.add(key);
    localStorage.setItem(HANDLED_KEY, JSON.stringify(Array.from(set).slice(-100)));
  } catch { /* ignore */ }
}

export default function Director({ pinnedSlug, onClose }: { pinnedSlug?: string | null; onClose: () => void }) {
  const [threads, setThreads] = useState<Thread[]>([]);
  const [active, setActive] = useState<Thread | null>(null);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [thinking, setThinking] = useState(false);
  const [maximized, setMaximized] = useState(false);
  const [showThreads, setShowThreads] = useState(false);
  const [remaining, setRemaining] = useState<number | null>(null);
  const [wizard, setWizard] = useState<{ key: string; qs: Array<{ q: string; options: string[] }>; idx: number; answers: string[]; text: string } | null>(null);
  const wizardKey = useRef(""); // remembers which reply we built the wizard for — never re-opens on old content
  const tokenRef = useRef<string | null>(null);
  const boxRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    fetch(`/api/token?c=${getClientId()}`)
      .then((r) => r.json()).then((j) => { tokenRef.current = j.token; setRemaining(j.limit); })
      .catch(() => {});
    const { threads: ts, activeId } = loadThreads();
    setThreads(ts);
    if (pinnedSlug) {
      const t = newThread(pinnedSlug);
      setThreads((prev) => [t, ...prev.filter((x) => x.id !== t.id)].slice(0, 20));
      setActive(t);
      setInput(`I want to adapt the design "${pinnedSlug}" to my project.`);
    } else if (activeId) {
      setActive(ts.find((t) => t.id === activeId) ?? ts[0]);
    }
    return () => abortRef.current?.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    boxRef.current?.scrollTo({ top: boxRef.current.scrollHeight, behavior: "smooth" });
  }, [active?.messages, thinking, streaming, wizard]);

  const pick = (id: string) => {
    const t = threads.find((x) => x.id === id);
    if (t) { setActive(t); setShowThreads(false); }
  };

  const freshThread = () => {
    const t = newThread(pinnedSlug ?? undefined);
    setThreads((prev) => [t, ...prev].slice(0, 20));
    setActive(t);
    setShowThreads(false);
    sfx.chip();
  };

  const clearThread = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    deleteThread(id);
    setThreads((prev) => prev.filter((x) => x.id !== id));
    if (active?.id === id) setActive(null);
  };

  const condenseAnswers = (qList: Array<{ q: string; options: string[] }>, answers: string[]): string => {
    if (qList.length === 1 && answers.length === 1) return answers[0];
    return qList.map((q, i) => `${q.q.replace(/[?？]$/, "")}: ${answers[i] ?? "-"}`).join(" · ");
  };

  const answerCurrent = (value: string) => {
    if (!wizard || !value.trim()) return;
    const answers = [...wizard.answers, value.trim()];
    sfx.chip();
    if (wizard.idx + 1 < wizard.qs.length) {
      setWizard({ ...wizard, idx: wizard.idx + 1, answers, text: "" });
    } else {
      const composed = condenseAnswers(wizard.qs, answers);
      setWizard(null);
      void send(composed);
    }
  };

  const dismissWizard = () => { setWizard(null); sfx.chip(); };
  const stopStreaming = () => { abortRef.current?.abort(); };

  const send = useCallback(async (textOverride?: string) => {
    const text = (textOverride ?? input).trim();
    if (!text || streaming || thinking) return;
    let activeThread = active;
    if (!activeThread) {
      activeThread = newThread(pinnedSlug ?? undefined);
      setThreads((prev) => [activeThread!, ...prev].slice(0, 20));
      setActive(activeThread);
    }

    sfx.send();

    const nextMessages: Msg[] = [...activeThread.messages, { role: "user", content: text }, { role: "assistant", content: "" }];
    const thread: Thread = {
      ...activeThread,
      title: activeThread.messages.length === 0 ? titleFrom(nextMessages) : activeThread.title,
      messages: nextMessages,
    };

    setThreads((prev) => prev.map((x) => (x.id === thread.id ? thread : x)));
    setActive(thread);
    saveThread(thread);
    setInput("");
    setThinking(true);

    abortRef.current = new AbortController();
    const assistantIdx = nextMessages.length - 1;

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-motif-client": tokenRef.current ?? "" },
        body: JSON.stringify({ messages: nextMessages.slice(0, -1), source: thread.pinnedSlug ?? undefined }),
        signal: abortRef.current.signal,
      });
      const rem = res.headers.get("x-remaining");
      if (rem) setRemaining(Number(rem));
      if (!res.ok || !res.body) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j.error === "QUOTA" ? "Daily free quota is done — come back tomorrow." : j.message ?? "The Director stepped away for a moment. Try again.");
      }
      setThinking(false); setStreaming(true);

      await readSSE(res, (delta) => {
        setThreads((prev) => {
          const nextT = prev.map((x) => {
            if (x.id !== thread.id) return x;
            const msgs = [...x.messages];
            msgs[assistantIdx] = { role: "assistant", content: (msgs[assistantIdx]?.content ?? "") + delta };
            return { ...x, messages: msgs };
          });
          // Sync active in the same mutation — prevents stale render
          const updated = nextT.find((x) => x.id === thread.id);
          if (updated) setActive(updated);
          return nextT;
        });
      });

      sfx.receive();
      // persist final snapshot of this thread (with all streamed text)
      setThreads((prev) => {
        const final = prev.find((x) => x.id === thread.id);
        if (final) saveThread(final);
        return prev;
      });
    } catch (e) {
      if ((e as Error).name === "AbortError") {
        setThinking(false); setStreaming(false);
        return;
      }
      const updated: Thread = {
        ...thread,
        messages: thread.messages.map((m, i) =>
          i === assistantIdx ? { role: "assistant" as const, content: `The line dropped: ${(e as Error).message}` } : m
        ),
      };
      setThreads((prev) => prev.map((x) => (x.id === thread.id ? updated : x)));
      setActive(updated);
      saveThread(updated);
    } finally {
      setThinking(false); setStreaming(false);
    }
  }, [input, streaming, thinking, active, pinnedSlug]);

  const last = active?.messages[active.messages.length - 1];
  useEffect(() => {
    // Only arm the wizard for a FRESHLY finished reply, and only once ever.
    if (!last || last.role !== "assistant" || !last.content) return;
    if (streaming || thinking) return;
    const key = hkey(last.content);
    if (wizardHandled(key)) return; // seen, answered, or dismissed before
    const qs = parseQuestions(last.content);
    if (qs.length === 0) return;
    markWizardHandled(key);
    if (!wizard) setWizard({ key, qs, idx: 0, answers: [], text: "" });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [last?.content, streaming, thinking]);

  // wizard resets when switching threads
  useEffect(() => { setWizard(null); }, [active?.id]);

  const widthCls = maximized
    ? "sm:inset-0 sm:w-full sm:h-full sm:max-w-none sm:rounded-none sm:m-0"
    : "sm:w-[520px] sm:mr-6 sm:h-[86vh] sm:rounded-2xl";

  return (
    <div className="fixed inset-0 z-50 flex items-stretch justify-end sm:items-center">
      <div className="absolute inset-0 bg-ink/80 backdrop-blur-sm backdrop-in" onClick={onClose} />

      <div className={`drawer-in relative w-full ${widthCls} sheet-deep border border-hairline flex flex-col shadow-[var(--shadow-sheet)] self-start sm:self-auto h-[100dvh] sm:h-auto max-h-[100dvh]`}>

        {/* head */}
        <div className="flex items-center gap-2.5 px-4 py-3 hairline-b shrink-0">
          <MotifMark size={36} className="rounded-xl shrink-0 shadow-[var(--shadow-sheet)]" />
          <div className="flex-1 min-w-0">
            <div className="font-display font-semibold text-sm leading-tight">The Director</div>
            <div className="text-[10px] font-mono uppercase tracking-[0.12em] text-paper-faint truncate">
              {thinking ? "crafting your direction" : streaming ? "writing" : active?.messages.length ? `${active.messages.length} messages` : remaining !== null ? `${remaining} briefs left today` : "ready"}
            </div>
          </div>
          <div className="flex items-center gap-0.5">
            <button onClick={() => setShowThreads((s) => !s)} title="Sessions" className={`p-2 rounded-lg transition ${showThreads ? "bg-ink-4 text-paper" : "hover:bg-ink-3 text-paper-dim"}`}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M4 6h16M4 12h10M4 18h16"/></svg>
            </button>
            <button onClick={() => setMaximized((m) => !m)} title={maximized ? "Restore" : "Maximize"} className="hidden sm:block p-2 rounded-lg hover:bg-ink-3 text-paper-dim transition">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">{maximized ? <path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3"/> : <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/>}</svg>
            </button>
            <button onClick={onClose} title="Close" className="p-2 rounded-lg hover:bg-ink-3 text-paper-dim transition"><Icon name="x" size={16} /></button>
          </div>
        </div>

        <div className="flex-1 flex min-h-0">
          {/* threads sidebar */}
          {showThreads && (
            <div className="w-[190px] shrink-0 hairline-r flex flex-col bg-ink/50">
              <div className="p-2">
                <button onClick={freshThread}
                  className="w-full flex items-center gap-2 rounded-lg bg-proof text-ink px-3 py-2 text-xs font-bold hover:bg-proof-soft transition btn-press">
                  <Icon name="plus" size={13} /> New chat
                </button>
              </div>
              <div className="flex-1 overflow-y-auto slim-scroll space-y-0.5 px-2 pb-2">
                {threads.map((t) => (
                  <div key={t.id}
                    className={`w-full group flex items-center justify-between gap-1 rounded-lg pl-2.5 pr-1 py-1 text-left text-[11px] transition cursor-pointer ${t.id === active?.id ? "bg-ink-4 text-paper" : "text-paper-dim hover:bg-ink-3 hover:text-paper"}`}
                    onClick={() => pick(t.id)}>
                    <span className="truncate flex-1">{t.title}</span>
                    <button onClick={(e) => clearThread(t.id, e)}
                      className="p-1.5 rounded-md text-paper-faint hover:text-proof hover:bg-ink-4 transition shrink-0" title="Delete chat">
                      <Icon name="x" size={11} />
                    </button>
                  </div>
                ))}
                {threads.length === 0 && <div className="text-center text-[10px] text-paper-faint py-6">No past sessions</div>}
              </div>
            </div>
          )}

          {/* message column */}
          <div className="flex-1 flex flex-col min-w-0 min-h-0">
            <div ref={boxRef} className="flex-1 overflow-y-auto slim-scroll p-4 space-y-4">
              {(!active || active.messages.length === 0) && (
                <div className="h-full flex flex-col justify-center text-center px-3">
                  <div className="font-display text-2xl font-medium text-paper">Hey. Director here.</div>
                  <p className="mt-2 text-[13px] text-paper-dim leading-relaxed max-w-xs mx-auto">
                    Tell me what you're building. I'll pull matching proofs from the room and write the prompt.
                  </p>
                  <div className="mt-6 grid gap-2 text-left max-w-xs mx-auto">
                    {OPENERS.map((o) => (
                      <button key={o.chip} onClick={() => void send(o.ask)}
                        className="group flex items-center gap-2.5 rounded-xl bg-ink-2 hover:bg-ink-3 border border-hairline hover:border-paper-dim/40 px-3.5 py-2.5 text-xs text-paper-dim hover:text-paper transition text-left btn-press">
                        <Icon name={o.icon} size={14} className="text-paper-faint group-hover:text-proof transition-colors shrink-0" />
                        {o.chip}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {active?.messages.map((m, i) => (
                <div key={i} className={`msg-in ${m.role === "user" ? "ml-auto max-w-[88%]" : "max-w-full"}`}>
                  <div className={`rounded-2xl px-4 py-3 text-[13px] leading-relaxed ${
                    m.role === "user"
                      ? "bg-paper text-ink rounded-br-md font-medium whitespace-pre-wrap"
                      : "text-paper-dim"
                  }`}>
                    {m.content
                      ? m.role === "assistant"
                        ? <RichText text={streaming && i === active.messages.length - 1 ? m.content : stripQuestions(m.content)} />
                        : m.content
                      : thinking && i === active.messages.length - 1 ? <ThinkingDots /> : <span className="caret-css" />}
                  </div>
                </div>
              ))}

              {/* question wizard bar */}
              {wizard && !streaming && !thinking && (
                <div className="msg-in rounded-xl border border-proof/30 bg-proof/5 p-3.5">
                  <div className="flex items-center justify-between mb-2">
                    <div className="ticket text-proof/90">
                      Question {wizard.idx + 1} of {wizard.qs.length}
                    </div>
                    {wizard.answers.length > 0 && (
                      <div className="flex gap-1">
                        {wizard.answers.map((_, i) => <span key={i} className="w-1.5 h-1.5 rounded-full bg-proof" />)}
                        <span className="w-1.5 h-1.5 rounded-full bg-proof/40" />
                      </div>
                    )}
                  </div>
                  <div className="flex items-start justify-between gap-2 mb-2.5">
                    <div className="text-sm font-semibold text-paper">{wizard.qs[wizard.idx].q}</div>
                    <button onClick={dismissWizard} title="Just keep chatting" className="p-1 rounded-md text-paper-faint hover:text-paper hover:bg-ink-3 transition shrink-0">
                      <Icon name="x" size={13} />
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-1.5 mb-2.5">
                    {wizard.qs[wizard.idx].options.map((opt) => (
                      <button key={opt} onClick={() => answerCurrent(opt)}
                        className="rounded-full bg-ink-3 hover:bg-proof/20 border border-hairline hover:border-proof/50 px-3 py-1.5 text-[11px] font-medium text-paper-dim hover:text-paper transition btn-press">
                        {opt}
                      </button>
                    ))}
                  </div>
                  <div className="flex gap-1.5">
                    <input
                      value={wizard.text}
                      onChange={(e) => setWizard({ ...wizard, text: e.target.value })}
                      onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); answerCurrent(wizard.text); } }}
                      placeholder="or type your own…"
                      className="flex-1 rounded-lg bg-ink-3 border border-hairline px-3 py-1.5 text-[11px] text-paper placeholder:text-paper-faint focus:outline-none focus:border-proof/50 transition-colors"
                    />
                    <button onClick={() => answerCurrent(wizard.text)} disabled={!wizard.text.trim()}
                      className="rounded-lg bg-paper text-ink px-3 text-[11px] font-bold hover:bg-paper-dim disabled:opacity-30 transition btn-press">
                      {wizard.idx + 1 < wizard.qs.length ? "Next →" : "Answer"}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* input */}
            <div className="p-3 hairline-t shrink-0">
              <div className="flex items-end gap-2 rounded-2xl bg-ink-2 border border-hairline px-3 py-2 focus-within:border-proof/50 transition-colors">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); void send(); } }}
                  placeholder={active?.messages.length ? "Keep riffing…" : "Describe what you're building…"}
                  rows={2}
                  className="flex-1 resize-none bg-transparent text-sm text-paper placeholder:text-paper-faint focus:outline-none"
                />
                {streaming
                  ? <button onClick={stopStreaming}
                      className="p-2.5 rounded-xl bg-proof hover:bg-proof-soft text-ink transition shrink-0" aria-label="Stop generating" title="Stop">
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="6" width="12" height="12" rx="2"/></svg>
                    </button>
                  : <button onClick={() => void send()} disabled={streaming || thinking || !input.trim()}
                      className="p-2.5 rounded-xl bg-paper text-ink hover:bg-paper-dim disabled:opacity-25 disabled:cursor-not-allowed transition shrink-0" aria-label="Send">
                      <Icon name="send" size={15} />
                    </button>}
              </div>
              {active && (
                <div className="mt-1.5 flex items-center justify-between">
                  <button onClick={() => { const cleared = { ...active, messages: [], title: "New session" }; saveThread(cleared); setActive(cleared); setWizard(null); }}
                    className="ticket hover:!text-proof transition-colors px-1">clear thread</button>
                  <span className="text-[9px] font-mono uppercase tracking-[0.12em] text-paper-faint">memory lives in your browser</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ThinkingDots() {
  return (
    <span className="think-dots inline-flex gap-1 items-center text-paper-faint text-[13px]">
      crafting <span>.</span><span>.</span><span>.</span>
    </span>
  );
}
