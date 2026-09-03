// tiny inline-icon set (stroke, currentColor) — drawn, one consistent weight
export function Icon({ name, size = 18, className = "" }: { name: string; size?: number; className?: string }) {
  const p = { width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round" as const, strokeLinejoin: "round" as const, className };
  switch (name) {
    case "copy": return <svg {...p}><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>;
    case "check": return <svg {...p}><path d="M20 6 9 17l-5-5"/></svg>;
    case "download": return <svg {...p}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="m7 10 5 5 5-5"/><path d="M12 15V3"/></svg>;
    case "chat": return <svg {...p}><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>;
    case "image": return <svg {...p}><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.1-3.1a2 2 0 0 0-2.8 0L6 21"/></svg>;
    case "search": return <svg {...p}><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>;
    case "x": return <svg {...p}><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>;
    case "plus": return <svg {...p}><path d="M12 5v14"/><path d="M5 12h14"/></svg>;
    case "arrow": return <svg {...p}><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>;
    case "send": return <svg {...p}><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>;
    case "spark": return <svg {...p}><path d="M12 3v3m0 12v3M3 12h3m12 0h3M5.6 5.6l2.2 2.2m8.4 8.4 2.2 2.2m0-12.8-2.2 2.2M7.8 16.2l-2.2 2.2"/></svg>;
    case "grid": return <svg {...p}><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>;
    case "layers": return <svg {...p}><path d="m12 2 10 6-10 6L2 8Z"/><path d="m2 14 10 6 10-6"/></svg>;
    case "wand": return <svg {...p}><path d="m15 4 5 5L8 21l-5-5Z"/><path d="m14 7 3 3"/></svg>;
    case "swatch": return <svg {...p}><path d="M11 3 4.6 9.4a2 2 0 0 0 0 2.8l7.2 7.2a2 2 0 0 0 2.8 0L21 13V3z"/><circle cx="16" cy="8" r="1.4"/></svg>;
    case "monitor": return <svg {...p}><rect x="2" y="4" width="20" height="13" rx="2"/><path d="M8 21h8m-4-4v4"/></svg>;
    case "volume": return <svg {...p}><path d="M11 5 6 9H2v6h4l5 4V5z"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>;
    case "mute": return <svg {...p}><path d="M11 5 6 9H2v6h4l5 4V5z"/><path d="m22 9-6 6m0-6 6 6"/></svg>;
    default: return <svg {...p}><circle cx="12" cy="12" r="9"/></svg>;
  }
}

// registration mark — the press-proof icon language of the atlas
export function RegMark({ size = 12, className = "" }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={className} aria-hidden="true">
      <circle cx="12" cy="12" r="8" />
      <path d="M12 1v22M1 12h22" />
    </svg>
  );
}

// the Motif mark — proof-red registration mark on the ink tile (matches /icon.svg)
export function MotifMark({ size = 26, className = "" }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 128 128" className={className} aria-hidden="true">
      <rect width="128" height="128" rx="28" fill="#0e0d0b" />
      <rect width="128" height="128" rx="28" fill="none" stroke="rgba(243,239,231,0.14)" strokeWidth="2" />
      <g stroke="#ff3e1f" strokeWidth="9" strokeLinecap="round" fill="none">
        <circle cx="64" cy="64" r="28" />
        <path d="M64 24v80M24 64h80" />
      </g>
      <circle cx="64" cy="64" r="8" fill="#f3efe7" />
    </svg>
  );
}
