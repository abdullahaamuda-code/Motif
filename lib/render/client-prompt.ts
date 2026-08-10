// Client-side mirror of the prompt compiler (catalog payloads ship slim).
import type { DesignDNA, PaletteDef, TypeSystem } from "@/lib/data/types";

export type PromptMode = "vibe" | "raw" | "agent";

const RUBRIC: Record<string, string> = {
  W: "Web / landing experience",
  U: "Application interface",
  G: "Game / interactive experience",
};

const HERO_LABEL: Record<string, string> = {
  statement: "single typographic statement hero", split: "50/50 split hero", asymmetric: "asymmetric split hero",
  editorial: "editorial / magazine hero", immersive: "immersive full-bleed hero", product: "product-first hero",
  bento: "bento hero", typographic: "pure typographic hero", media: "full-media hero", monumental: "monumental hero",
  scrollstory: "scroll-story hero", popstage: "pop-stage hero", brutalframe: "brutal framed hero", arena: "game-arena hero", poster: "centered poster hero",
};

export function compilePromptClient(
  d: DesignDNA,
  mode: PromptMode,
  palettes: PaletteDef[],
  types: TypeSystem[],
  customBrief?: string
): string {
  const pal = (id: string) => palettes.find((p) => p.id === id) ?? palettes[0];
  const typ = (id: string) => types.find((t) => t.id === id) ?? types[0];
  const t = typ(d.typePair);
  const primary = pal(d.palettes[0]);

  const paletteTxt = d.palettes
    .map((id) => {
      const p = pal(id);
      return `- ${p.name}: bg ${p.bg} · surface ${p.surface} · text ${p.text} · muted ${p.muted} · accent ${p.accent} + ${p.accent2} (${p.dark ? "dark" : "light"}-first)`;
    })
    .join("\n");

  const shared = [
    `DESIGN IDENTITY — "${d.name}"`,
    `Vibe: ${d.vibe}`,
    `Rubric: ${RUBRIC[d.rubric]}`,
    `Voice: ${d.voice}`,
    ``,
    `COLOR (60/30/10 weighting, WCAG AA minimum):`,
    paletteTxt,
    ``,
    `TYPE — ${t.name}: display ${t.display.family} (${t.display.weight}, ${t.display.tracking}) · body ${t.body.family} (${t.body.weight}, lh ${t.body.lineHeight}) · scale ${t.scale}`,
    ``,
    `LAYOUT: ${HERO_LABEL[d.layout.hero] ?? d.layout.hero} · shell "${d.layout.shell}" · ${d.layout.density} density`,
    `Sections (in order): ${d.layout.flow.join(" → ")}`,
    ``,
    `CRAFT: ${d.effects.join(", ")} — physics easing (200–500ms), respect prefers-reduced-motion`,
  ].join("\n");

  const brief = customBrief ? `\nPROJECT CONTEXT: ${customBrief}` : "";

  if (mode === "vibe") {
    return `You are a senior product designer + creative developer duo.${brief}
Build a production-quality ${RUBRIC[d.rubric].toLowerCase()} following this design identity EXACTLY.

${shared}

EXECUTION
- Modern React/Next.js + Tailwind (or single-file HTML if simple).
- It must look unmistakably premium — bookmark-worthy.
- NO generic AI gradient-garbage; real copy only (no lorem ipsum).
- Responsive + accessible + fast; when ambiguous, obey the identity above.
Deliver complete, working code. Be opinionated.`;
  }
  if (mode === "raw") {
    return `# DESIGN SPEC — ${d.name}${brief}
${shared}

## ENGINEERING
- CSS custom-property tokens first, utilities after; atomic card components.
- Landmarks, focus rings, reduced-motion fallbacks; LCP < 2s, CLS < 0.1.
- Loading, empty, AND error states for every dynamic surface.
- Deliver full file tree + complete source. No TODOs, no placeholders.`;
  }
  return `# AGENTS.md — Design System "${d.name}"${brief}
> Every agent in this repo MUST treat this file as supreme law for UI.
${shared}

## DO
- Follow palette/type/layout tokens for ALL new UI; match the voice for copy.

## DO NOT
- New colors/fonts/patterns without updating this file; generic gradients; stock lorem; broken responsive states.

## VERIFY before commit
- Hex tokens respected · contrast ≥ AA · keyboard navigable · copy voice: "${d.voice}"`;
}
