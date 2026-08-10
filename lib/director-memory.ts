// Director persistence — multiple threads, localStorage, 14-day TTL.
const KEY = "motif_director_threads_v2";
const TTL = 14 * 24 * 60 * 60 * 1000;

export interface Thread {
  id: string;
  title: string;
  createdAt: number;
  updatedAt: number;
  pinnedSlug?: string;
  messages: Array<{ role: "user" | "assistant"; content: string }>;
}

interface Store { activeId: string; threads: Thread[] }

function read(): Store | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const s = JSON.parse(raw) as Store;
    if (!Array.isArray(s.threads)) return null;
    s.threads = s.threads.filter((t) => Date.now() - t.updatedAt < TTL);
    return s;
  } catch { return null; }
}

function write(s: Store) {
  if (typeof window === "undefined") return;
  try { localStorage.setItem(KEY, JSON.stringify({ activeId: s.activeId, threads: s.threads.slice(0, 20) })); } catch { /* quota */ }
}

export function loadThreads(): { threads: Thread[]; activeId: string | null } {
  const s = read();
  if (!s || !s.threads.length) return { threads: [], activeId: null };
  return { threads: s.threads, activeId: s.activeId };
}

export function newThread(pinnedSlug?: string): Thread {
  const s = read() ?? { activeId: "", threads: [] };
  const t: Thread = {
    id: crypto.randomUUID(),
    title: "New session",
    createdAt: Date.now(),
    updatedAt: Date.now(),
    pinnedSlug,
    messages: [],
  };
  s.threads.unshift(t);
  s.activeId = t.id;
  write(s);
  return t;
}

export function saveThread(t: Thread) {
  const s = read() ?? { activeId: t.id, threads: [] };
  const i = s.threads.findIndex((x) => x.id === t.id);
  t.updatedAt = Date.now();
  if (i >= 0) s.threads[i] = t; else s.threads.unshift(t);
  s.activeId = t.id;
  write(s);
}

export function deleteThread(id: string) {
  const s = read();
  if (!s) return;
  s.threads = s.threads.filter((t) => t.id !== id);
  write(s);
}

export function titleFrom(messages: Array<{ role: string; content: string }>): string {
  const first = messages.find((m) => m.role === "user");
  if (!first) return "New session";
  const t = first.content.replace(/\s+/g, " ").slice(0, 40);
  return t.length < first.content.length ? t + "…" : t;
}
