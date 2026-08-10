import { NextResponse } from "next/server";
import { ALL, stats, PALETTES, TYPE_SYSTEMS } from "@/lib/data";

// The catalog is "open by design" — previews + DNA tokens ship to the client.
// (The value lives in the AI services + curation; data is freely remixable.)
export const dynamic = "force-static";

export async function GET() {
  const slim = ALL.map((d) => ({
    slug: d.slug, name: d.name, vibe: d.vibe, rubric: d.rubric,
    industries: d.industries, styles: d.styles, palettes: d.palettes,
    typePair: d.typePair, effects: d.effects, layout: d.layout,
    preview: d.preview, voice: d.voice, tags: d.tags,
    featured: !!d.featured, mini: !!d.mini,
  }));
  return NextResponse.json({ designs: slim, stats, palettes: PALETTES, types: TYPE_SYSTEMS });
}
