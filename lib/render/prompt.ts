// ============================================================================
// PROMPT COMPILER — turns Design DNA into production prompts.
// Modes: vibe (chat-ready brief), raw (engineering spec), agent (AGENTS.md),
// apply (adapt to existing codebase), remix (variant generator).
// ============================================================================

import type { DesignDNA, Rubric } from "../data/types";
import { paletteById } from "../data/palettes";
import { typeById } from "../data/typesystems";
import { effectById, flowById, industryById } from "../data/craft";

export type PromptMode = "vibe" | "raw" | "agent";

const RUBRIC_NAME: Record<Rubric, string> = {
  W: "Web / landing experience",
  U: "Application interface",
  G: "Game / interactive experience",
};

function paletteBlock(d: DesignDNA): string[] {
  return d.palettes.map((pid) => {
    const p = paletteById(pid);
    return [
      `- ${p.name} (${p.dark ? "dark-first" : "light-first"})`,
      `  bg: ${p.bg} · surface: ${p.surface} · text: ${p.text}`,
      `  muted: ${p.muted} · accent: ${p.accent} · accent-2: ${p.accent2}`,
    ].join("\n");
  });
}

function capsule(d: DesignDNA): string {
  const primaryPalette = paletteById(d.palettes[0]);
  const t = typeById(d.typePair);
  return [
    `Design capsule ${d.slug} — "${d.name}"`,
    `- Rubric: ${RUBRIC_NAME[d.rubric]}`,
    `- Palette: ${d.palettes.map((p) => paletteById(p).name).join(" / ")} (${primaryPalette.dark ? "dark" : "light"}-first)`,
    `- Type: ${t.name} (${t.display.family} + ${t.body.family})`,
    `- Layout: ${d.layout.hero} hero · ${d.layout.shell} shell · ${d.layout.density} density`,
    `- Craft: ${d.effects.map((e) => effectById(e)?.name ?? e).join(", ")}`,
    `- Sections: ${d.layout.flow.map((f) => flowById(f)?.name ?? f).join(", ")}`,
    `- Industries: ${d.industries.map((i) => industryById(i)?.name ?? i).join(", ")}`,
  ].join("\n");
}

export function designCapsule(d: DesignDNA): string {
  return capsule(d);
}

export function compilePrompt(d: DesignDNA, mode: PromptMode, customBrief?: string): string {
  const t = typeById(d.typePair);
  const flowLines = d.layout.flow
    .map((f, i) => `${i + 1}. ${flowById(f)?.name ?? f}`)
    .join("\n");
  const effectLines = d.effects
    .map((e) => `- ${effectById(e)?.name ?? e}${effectById(e)?.tag ? ` (${effectById(e)!.tag})` : ""}`)
    .join("\n");

  const shared = `
DESIGN IDENTITY — "${d.name}"
Vibe: ${d.vibe}
Rubric: ${RUBRIC_NAME[d.rubric]}
Target: ${d.industries.map((i) => industryById(i)?.name ?? i).join(" / ")}
Voice: ${d.voice}

COLOR SYSTEM
${paletteBlock(d).join("\n")}
Rules: 60/30/10 weighting (background/surface/accent). Never pure #000/#fff.
Contrast minimum WCAG AA. Accent used for <10% of pixels.

TYPOGRAPHY — ${t.name}
Display: ${t.display.family} ${t.display.weight}, tracking ${t.display.tracking}
Body: ${t.body.family} ${t.body.weight}, line-height ${t.body.lineHeight}
Scale: ${t.scale}. Display sizes must feel oversized and confident.

LAYOUT
Hero pattern: ${d.layout.hero}
App shell: ${d.layout.shell}
Density: ${d.layout.density.toUpperCase()} (${d.layout.density === "airy" ? "≥72px section padding, generous whitespace" : d.layout.density === "dense" ? "≤32px padding, info-rich but scanned fast" : "48-56px padding"})
Section flow:
${flowLines}

CRAFT / EFFECTS
${effectLines}
Motion discipline: physics-based easing, 200-500ms, respect prefers-reduced-motion.

CONTENT & VOICE
${d.voice} Write real copy — no lorem ipsum, no stock clichés. Concrete numbers, believable testimonials.
`.trim();

  const briefLine = customBrief ? `\nCONTEXT (my project): ${customBrief}\n` : "";

  if (mode === "vibe") {
    return `You are a senior product designer + creative developer duo. ${briefLine}
Build a production-quality ${RUBRIC_NAME[d.rubric].toLowerCase()} that follows this design identity EXACTLY.

${shared}

EXECUTION
- Tech: modern Next.js/React + Tailwind (or single-file HTML if simple).
- Must look unmistakably premium — the kind of page that gets bookmarked as a reference.
- NO generic AI/gradient-garbage patterns. If something looks "AI-generated", redo it.
- Real content only: write copy in the stated voice.
- Responsive, accessible (keyboard nav, focus states, aria), fast (no layout shift).
- When ambiguous: bias toward the design identity above, not toward generic defaults.
Deliver complete, working code. Be opinionated.`.trim();
  }

  if (mode === "raw") {
    return `# DESIGN SPEC — ${d.name} (v${d.slug})
${briefLine}
${shared}

## ENGINEERING REQUIREMENTS
- Component architecture: atomic cards first, composition above.
- State: derive from props; no unnecessary client components.
- Accessibility: landmarks, focus rings (visible), reduced-motion fallbacks.
- Performance: LCP < 2s, CLS < 0.1, code-split heavy effects, server-render where possible.
- CSS tokens first (CSS custom properties), utilities second. No inline styles beyond dynamic values.
- Deliberate details: number formatting, loading skeletons, empty states, error states.
- Deliver: full file tree + complete source; no placeholders, no TODOs.`.trim();
  }

  // agent mode
  return `# AGENTS.md — Design System "${d.name}"
${briefLine}
> Every AI agent working in this repo MUST treat this file as the supreme law for UI decisions.
${shared}

## DO
- Follow the palette/type/layout tokens above for ALL new UI.
- Keep motion within the stated discipline.
- Match the voice for any user-facing copy.

## DO NOT
- Do not introduce new colors/fonts/layout patterns without updating this file.
- Do not use generic gradients, purple blobs, or default component-library styling.
- Do not ship lorem ipsum or broken responsive states.

## VERIFICATION (run before every commit)
- UI matches palette tokens (grep hex codes).
- Contrast ≥ AA; keyboard-navigable; reduced-motion respected.
- Copy follows voice: "${d.voice}"`.trim();
}

// ---------------------------- remix & apply ---------------------------------

export function compileRemix(source: DesignDNA, twist: string, newName?: string): string {
  const t = typeById(source.typePair);
  return `You are a creative director generating a SPIN-OFF design identity — a genuine variant, not a rename.

SOURCE — "${source.name}"
${capsule(source)}

TWIST: ${twist}

Rules:
- Keep ${source.name}'s core DNA (rubric + industry + spirit), but change at least 3 of: palette, type pairing, motion discipline, content voice.
- New identity must stay coherent, production-ready, and PREMIUM.
- Give the spin-off its own evocative name${newName ? ` (must be related to: "${newName}")` : ""} and one-line vibe.
Output in the exact Design DNA capsule format used above.`.trim();
}

export function compileApply(source: DesignDNA, targets: DesignDNA[], userGoal: string): string {
  const targetCaps = targets.map((t) => "---\n" + capsule(t)).join("\n");
  return `You are a world-class design systems engineer.

MY SOURCE DESIGN
${capsule(source)}

TARGET DNA TO ABSORB
${targetCaps}

MY GOAL
"${userGoal}"

TASK
Craft ONE master prompt (to paste into a coding AI) that produces a design:
- Rooted in "${source.name}"'s proven structure (keep what works),
- remixing the specified TARGET DNA where my goal demands (palette, type, effects, layout, voice),
- resulting in something neither source nor any single target — a NEW, coherent, premium identity.

Constraints: honor both DNA palettes' mood, resolve conflicts in favor of coherence, state exactly which tokens survive + which transform, and end with the complete master prompt block (markdown), ready to copy. Output the reasoning briefly (≤8 lines), then the master prompt.`.trim();
}
