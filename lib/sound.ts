// Micro sound design — tiny WebAudio blips. Zero assets, all synthesized.
let ctx: AudioContext | null = null;
let muted = false;

export function setMuted(m: boolean) { muted = m; }
export function isMuted() { return muted; }

function ac(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    try { ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)(); }
    catch { return null; }
  }
  if (ctx.state === "suspended") void ctx.resume();
  return ctx;
}

function blip(freq: number, dur: number, vol = 0.08, type: OscillatorType = "sine", when = 0) {
  if (muted) return;
  const c = ac();
  if (!c) return;
  const t = c.currentTime + when;
  const o = c.createOscillator();
  const g = c.createGain();
  o.type = type;
  o.frequency.setValueAtTime(freq, t);
  g.gain.setValueAtTime(0, t);
  g.gain.linearRampToValueAtTime(vol, t + 0.012);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  o.connect(g).connect(c.destination);
  o.start(t);
  o.stop(t + dur + 0.05);
}

export const sfx = {
  open: () => { blip(523.25, 0.14, 0.06); blip(783.99, 0.18, 0.05, "sine", 0.05); },
  send: () => { blip(660, 0.09, 0.05); },
  receive: () => { blip(880, 0.08, 0.04); blip(1174.66, 0.12, 0.035, "sine", 0.05); },
  copy: () => { blip(987.77, 0.07, 0.06, "triangle"); },
  enter: () => { blip(392, 0.25, 0.06); blip(587.33, 0.3, 0.055, "sine", 0.08); blip(880, 0.4, 0.045, "sine", 0.16); },
  chip: () => { blip(740, 0.06, 0.04, "triangle"); },
};
