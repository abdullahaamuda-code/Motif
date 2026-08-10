import { ALL } from "../data";
import type { DesignDNA, Rubric } from "../data/types";
import { paletteById } from "../data/palettes";
import { typeById } from "../data/typesystems";
import { effectById } from "../data/craft";

interface IndexEntry {
  slug: string;
  name: string;
  vibe: string;
  rubric: Rubric;
  combined: string; // name+vibe+tags+styles+industries+palette names
  tags: string[];
  styles: string[];
  industries: string[];
}

let cache: IndexEntry[] | null = null;

function buildIndex(): IndexEntry[] {
  if (cache) return cache;
  cache = ALL.map((d: DesignDNA) => ({
    slug: d.slug,
    name: d.name,
    vibe: d.vibe,
    rubric: d.rubric,
    combined: [
      d.name,
      d.vibe,
      ...d.tags,
      ...d.styles,
      ...d.industries,
      ...d.palettes.map((p) => paletteById(p).name),
      typeById(d.typePair).name,
    ]
      .join(" ")
      .toLowerCase(),
    tags: d.tags,
    styles: d.styles,
    industries: d.industries,
  }));
  return cache;
}

const STOP = new Set(["the", "a", "an", "and", "for", "with", "make", "want", "like", "that", "this", "use"]);

function tokenize(q: string): string[] {
  return q
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, " ")
    .split(/\s+/)
    .filter((t) => t.length > 2 && !STOP.has(t));
}

function rerankTerms(query: string): string[] {
  const t = tokenize(query);
  if (t.length) return t;
  // expansion fallback: search by rubric/type hints
  return tokenize(query + " design");
}

export function retrieveCatalogContext(query: string, k = 5): DesignDNA[] {
  const idx = buildIndex();
  const terms = rerankTerms(query);
  const scored = idx
    .map((e) => {
      let score = 0;
      for (const t of terms) {
        if (e.combined.includes(t)) score += t.length; // longer matches weigh more
        if (e.name.toLowerCase().includes(t)) score += 4;
        if (e.vibe.toLowerCase().includes(t)) score += 2;
      }
      return { e, score };
    })
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, k);

  // If no overlap, return a diverse sample by rubric popularity instead
  if (!scored.length) {
    const counts: Record<Rubric, number> = { W: 0, U: 0, G: 0 };
    for (const d of ALL) counts[d.rubric]++;
    const preferred = (Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0]) as Rubric;
    return ALL.filter((d) => d.rubric === preferred).slice(0, k);
  }
  return scored.map((s) => ALL.find((d) => d.slug === s.e.slug)!).filter(Boolean);
}

export function catalogContext(designs: DesignDNA[]): string {
  return designs
    .map((d) => {
      const fx = d.effects
        .slice(0, 5)
        .map((e) => effectById(e)?.name ?? e)
        .join(", ");
      const pals = d.palettes.map((p) => paletteById(p).name).join(" / ");
      const t = typeById(d.typePair);
      return `Design "${d.name}" (${d.rubric} — vibe: ${d.vibe}
  Palette: ${pals} (${d.palettes.map((p) => paletteById(p).bg).join(", ")})
  Type: ${t.display.family} / ${t.body.family}
  Effects: ${fx}
  Flow: ${d.layout.flow.join(", ")}
  Voice: ${d.voice})`;
    })
    .join("\n\n");
}
