import type { DesignDNA, Rubric } from "./types";
import { DESIGNS } from "./designs";
import { DESIGNS2 } from "./designs2";
import { DESIGNS3 } from "./designs3";
import { MINIS } from "./mini";
import { CUSTOM } from "./custom";
import { PALETTES, paletteById } from "./palettes";
import { TYPE_SYSTEMS, typeById } from "./typesystems";
import { EFFECTS, FLOWS, INDUSTRIES, effectById, flowById, industryById } from "./craft";

export const ALL: DesignDNA[] = [...DESIGNS, ...DESIGNS2, ...DESIGNS3, ...MINIS, ...CUSTOM];

export const bySlug = new Map(ALL.map((d) => [d.slug, d]));

export const stats = {
  designs: ALL.length,
  palettes: PALETTES.length,
  typeSystems: TYPE_SYSTEMS.length,
  effects: EFFECTS.length,
  flows: FLOWS.length,
  industries: INDUSTRIES.length,
};

export function searchCatalog(opts: {
  q?: string;
  rubric?: Rubric | "";
  industry?: string;
  style?: string;
  limit?: number;
}): DesignDNA[] {
  let out = ALL;
  if (opts.rubric) out = out.filter((d) => d.rubric === opts.rubric);
  if (opts.industry) out = out.filter((d) => d.industries.includes(opts.industry!));
  if (opts.style) out = out.filter((d) => d.styles.includes(opts.style!));
  if (opts.q) {
    const q = opts.q.toLowerCase();
    out = out.filter((d) =>
      [d.name, d.vibe, d.voice, ...d.tags, ...d.styles, ...d.industries, ...d.palettes]
        .join(" ")
        .toLowerCase()
        .includes(q)
    );
  }
  return out.slice(0, opts.limit ?? 60);
}

export const STYLES = [
  "minimal", "swiss", "editorial", "brutalist", "dark", "luxury", "technical",
  "cyberpunk", "neon", "retro", "playful", "y2k", "nature", "futuristic",
  "artistic", "gothic",
] as const;

export { PALETTES, TYPE_SYSTEMS, EFFECTS, FLOWS, INDUSTRIES, paletteById, typeById, effectById, flowById, industryById };
