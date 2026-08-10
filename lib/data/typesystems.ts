import type { TypeSystem } from "./types";

export const TYPE_SYSTEMS: TypeSystem[] = [
  { id: "grotesk", name: "Neo Grotesk", display: { family: "Space Grotesk", weight: 700, tracking: "-0.03em", css: "'Space Grotesk',sans-serif" }, body: { family: "Inter", weight: 400, lineHeight: "1.6", css: "'Inter',sans-serif" }, scale: "1.333 Perfect Fourth", glyph: "Ag" },
  { id: "swiss", name: "Swiss International", display: { family: "Inter Tight", weight: 650, tracking: "-0.02em", css: "'Inter Tight',sans-serif" }, body: { family: "Inter", weight: 400, lineHeight: "1.6", css: "'Inter',sans-serif" }, scale: "1.25 Major Third", glyph: "Aa" },
  { id: "editorial", name: "Editorial Contrast", display: { family: "Playfair Display", weight: 700, tracking: "-0.01em", css: "'Playfair Display',serif" }, body: { family: "Source Serif 4", weight: 400, lineHeight: "1.7", css: "'Source Serif 4',serif" }, scale: "1.414 Augmented Fourth", glyph: "Éa" },
  { id: "brutal", name: "Brutalist Block", display: { family: "Archivo Black", weight: 900, tracking: "0", css: "'Archivo Black',sans-serif" }, body: { family: "Space Grotesk", weight: 500, lineHeight: "1.55", css: "'Space Grotesk',sans-serif" }, scale: "1.5 Perfect Fifth", glyph: "Ag" },
  { id: "terminal", name: "Terminal Mono", display: { family: "JetBrains Mono", weight: 700, tracking: "-0.02em", css: "'JetBrains Mono',monospace" }, body: { family: "JetBrains Mono", weight: 400, lineHeight: "1.65", css: "'JetBrains Mono',monospace" }, scale: "1.2 Minor Third", glyph: ">_" },
  { id: "fashion", name: "Fashion Modern", display: { family: "Italiana", weight: 400, tracking: "0.01em", css: "'Italiana',serif" }, body: { family: "Manrope", weight: 400, lineHeight: "1.65", css: "'Manrope',sans-serif" }, scale: "1.414 Augmented Fourth", glyph: "Aa" },
  { id: "rounded", name: "Rounded Humanist", display: { family: "Sora", weight: 700, tracking: "-0.02em", css: "'Sora',sans-serif" }, body: { family: "Inter", weight: 400, lineHeight: "1.65", css: "'Inter',sans-serif" }, scale: "1.25 Major Third", glyph: "Ag" },
  { id: "techwide", name: "Tech Wide", display: { family: "Chakra Petch", weight: 700, tracking: "0.02em", css: "'Chakra Petch',sans-serif" }, body: { family: "Inter", weight: 400, lineHeight: "1.6", css: "'Inter',sans-serif" }, scale: "1.333 Perfect Fourth", glyph: "Ag" },
  { id: "gothic", name: "Dark Gothic", display: { family: "Unbounded", weight: 800, tracking: "0.01em", css: "'Unbounded',sans-serif" }, body: { family: "Space Grotesk", weight: 400, lineHeight: "1.65", css: "'Space Grotesk',sans-serif" }, scale: "1.414 Augmented Fourth", glyph: "Øa" },
  { id: "hud", name: "HUD Numeric", display: { family: "Orbitron", weight: 800, tracking: "0.08em", css: "'Orbitron',sans-serif" }, body: { family: "Rajdhani", weight: 500, lineHeight: "1.5", css: "'Rajdhani',sans-serif" }, scale: "1.333 Perfect Fourth", glyph: "09" },
  { id: "retro", name: "Retro Display", display: { family: "Righteous", weight: 400, tracking: "0", css: "'Righteous',cursive" }, body: { family: "Nunito", weight: 500, lineHeight: "1.6", css: "'Nunito',sans-serif" }, scale: "1.333 Perfect Fourth", glyph: "Aa" },
  { id: "lux", name: "Quiet Luxury", display: { family: "Marcellus", weight: 400, tracking: "0.04em", css: "'Marcellus',serif" }, body: { family: "Jost", weight: 400, lineHeight: "1.7", css: "'Jost',sans-serif" }, scale: "1.333 Perfect Fourth", glyph: "Aa" },
];

export const typeById = (id: string): TypeSystem =>
  TYPE_SYSTEMS.find((t) => t.id === id) ?? TYPE_SYSTEMS[0];
