import type { DesignDNA, HeroKind, ShellKind, MockKind } from "./types";
import { PALETTES } from "./palettes";
import { TYPE_SYSTEMS } from "./typesystems";
import { EFFECTS, FLOWS, INDUSTRIES } from "./craft";

// ============================================================================
// CATALOG SCALE-OUT — programmatic variants. Each base recipe × palette axis
// produces a deterministic, unique design identity. These are "mini" entries:
// they render + copy immediately, and can be AI-expanded on demand.
// ============================================================================

interface Recipe {
  key: string;
  name: string;
  rubric: "W" | "U" | "G";
  industries: string[];
  styles: string[];
  typePair: string;
  hero: HeroKind;
  shell: ShellKind;
  mock: MockKind;
  density: "airy" | "balanced" | "dense";
  effects: string[];
  flow: string[];
  stat: string;
  voice: string;
  tags: string[];
  base?: string[]; // palette ids that define the theme's native mood
}

const RECIPES: Recipe[] = [
  { key: "magistral", name: "Magistral", rubric: "W", industries: ["saas", "ai-startup"], styles: ["minimal", "futuristic"], typePair: "swiss", hero: "statement", shell: "topnav", mock: "statement", density: "airy", effects: ["aurora", "textreveal", "microint"], flow: ["logo-wall", "bento-grid", "stats", "pricing", "faq"], stat: "Quiet power", voice: "Still, supreme.", tags: ["minimal"] },
  { key: "ironworks", name: "Ironworks", rubric: "W", industries: ["dev-tools", "analytics"], styles: ["technical", "swiss"], typePair: "swiss", hero: "statement", shell: "topnav", mock: "dashboard", density: "dense", effects: ["darkgrid", "linechart", "countup"], flow: ["metrics", "integrations", "changelog"], stat: "Spec-first", voice: "Engineering memo.", tags: ["grid"] },
  { key: "veranda", name: "Veranda", rubric: "W", industries: ["travel", "real-estate"], styles: ["editorial", "nature"], typePair: "lux", hero: "media", shell: "topnav", mock: "editorial", density: "airy", effects: ["parallax", "textreveal", "grain"], flow: ["rooms", "gallery", "testimonial"], stat: "Verandah light", voice: "Host calm.", tags: ["stay"] },
  { key: "kiln", name: "Kiln", rubric: "W", industries: ["ecommerce", "restaurant"], styles: ["nature", "minimal"], typePair: "editorial", hero: "editorial", shell: "topnav", mock: "editorial", density: "balanced", effects: ["grain", "paperfold", "scrolldriven"], flow: ["products", "menu-preview", "gallery"], stat: "Hand-thrown", voice: "Maker honest.", tags: ["shop"] },
  { key: "signal-grade", name: "Signal Grade", rubric: "W", industries: ["fintech", "legal"], styles: ["swiss", "minimal"], typePair: "swiss", hero: "split", shell: "topnav", mock: "split", density: "balanced", effects: ["countup", "linechart", "microint"], flow: ["steps", "comparison", "social-proof", "faq"], stat: "Bulletproof", voice: "Audited calm.", tags: ["trust"] },
  { key: "overclock", name: "Overclock", rubric: "G", industries: ["gaming", "esports"], styles: ["cyberpunk", "technical"], typePair: "hud", hero: "arena", shell: "console", mock: "hud", density: "dense", effects: ["scanlines", "countup", "progressbar", "borderglow"], flow: ["leaderboard", "metrics", "drop-countdown"], stat: "FPS: uncapped", voice: "Comms terse.", tags: ["hud"] },
  { key: "daybook", name: "Daybook", rubric: "W", industries: ["blog", "news", "portfolio"], styles: ["editorial", "minimal"], typePair: "editorial", hero: "editorial", shell: "topnav", mock: "editorial", density: "airy", effects: ["grain", "textreveal"], flow: ["manifesto", "newsletter"], stat: "65ch measure", voice: "Op-ed level.", tags: ["writing"] },
  { key: "pavilion", name: "Pavilion", rubric: "W", industries: ["event", "agency", "three-d"], styles: ["futuristic", "artistic"], typePair: "grotesk", hero: "immersive", shell: "topnav", mock: "immersive", density: "airy", effects: ["constellation", "floaty3d", "spotlight"], flow: ["event-schedule", "team", "cta-banner"], stat: "Dome hero", voice: "Opening night.", tags: ["immersive"] },
  { key: "bunker", name: "Bunker", rubric: "U", industries: ["dev-tools", "analytics"], styles: ["cyberpunk", "technical"], typePair: "terminal", hero: "bento", shell: "console", mock: "console", density: "dense", effects: ["terminalboot", "scanlines", "borderglow"], flow: ["playground", "changelog"], stat: "uptime 99.99", voice: "On-call dry.", tags: ["ops"] },
  { key: "atelier", name: "Atelier", rubric: "U", industries: ["design-tool", "productivity"], styles: ["minimal", "artistic"], typePair: "swiss", hero: "bento", shell: "canvasdock", mock: "canvas", density: "balanced", effects: ["microint", "tilt", "darkgrid"], flow: ["app-preview", "integrations"], stat: "Infinite board", voice: "Studio quiet.", tags: ["canvas"] },
  { key: "parlor", name: "Parlor", rubric: "U", industries: ["social", "ai-startup"], styles: ["playful", "minimal"], typePair: "rounded", hero: "bento", shell: "sidebar", mock: "chatui", density: "balanced", effects: ["glass", "microint", "aurora"], flow: ["app-preview", "steps"], stat: "Chat calm", voice: "Parlor polite.", tags: ["chat"] },
  { key: "quarry", name: "Quarry", rubric: "W", industries: ["architecture", "agency"], styles: ["brutalist", "minimal"], typePair: "brutal", hero: "monumental", shell: "topnav", mock: "statement", density: "airy", effects: ["stroked", "grain", "scrolldriven"], flow: ["manifesto", "case-teaser", "awards"], stat: "Concrete type", voice: "Monolithic.", tags: ["brutal"] },
  { key: "salon", name: "Salon", rubric: "W", industries: ["fashion", "portfolio", "photography"], styles: ["luxury", "editorial"], typePair: "fashion", hero: "media", shell: "topnav", mock: "poster", density: "airy", effects: ["spotlight", "parallax", "duotone"], flow: ["gallery", "case-teaser", "awards"], stat: "Front row", voice: "Whispered vogue.", tags: ["couture"] },
];

void EFFECTS; void FLOWS; // reserved for richer axes

// rotational axes
const ROMANS = ["I","II","III","IV","V","VI","VII","VIII","IX","X","XI","XII","XIII","XIV","XV","XVI","XVII"];
const DENSITY: Array<"airy" | "balanced" | "dense"> = ["airy", "balanced", "dense"];
const EXTRA_FX = ["microint", "scrolldriven", "marquee", "spotlight", "countup", "tilt", "borderglow", "grain", "glass", "textreveal", "parallax", "darkgrid"];
const EXTRA_FLOW = ["social-proof", "logo-wall", "bento-grid", "stats", "testimonial", "pricing", "faq", "cta-banner", "playground", "gallery", "metrics", "leaderboard", "newsletter", "steps", "comparison"];

const uniq = <T,>(arr: T[]) => Array.from(new Set(arr));

function buildMini(recipe: Recipe, i: number): DesignDNA {
  const palMain = PALETTES[i % PALETTES.length].id;
  const palAlt = PALETTES[(i * 7 + 11) % PALETTES.length].id;
  const fx = uniq([...recipe.effects, EXTRA_FX[i % EXTRA_FX.length], EXTRA_FX[(i * 13 + 5) % EXTRA_FX.length]]).slice(0, 6);
  const flow = uniq([...recipe.flow, EXTRA_FLOW[i % EXTRA_FLOW.length], EXTRA_FLOW[(i * 17 + 3) % EXTRA_FLOW.length]]).slice(0, 8);
  const density = DENSITY[i % 3];
  const industry = INDUSTRIES[(i * 5 + 3) % INDUSTRIES.length].id;
  return {
    slug: `${recipe.key}-${palMain.split("-")[0]}-${(i + 1).toString(36)}`,
    name: `${recipe.name} ${ROMANS[i % 17]}`,
    vibe: `${recipe.name} family in ${palMain.replace(/-/g, " ")} — ${fx.length} effects, ${flow.length} sections.`,
    rubric: recipe.rubric,
    industries: uniq([...recipe.industries, ...(i % 3 === 0 ? [industry] : [])]),
    styles: uniq(recipe.styles),
    palettes: uniq([palMain, ...(i % 4 === 0 ? [palAlt] : [])]),
    typePair: recipe.typePair,
    effects: fx,
    layout: { hero: recipe.hero, flow, shell: recipe.shell, density },
    preview: { mock: recipe.mock, stat: recipe.stat },
    voice: recipe.voice,
    tags: uniq([...recipe.tags, palMain.split("-")[1] ?? "", "mini"]),
    mini: true,
  };
}

// generating the minis — deterministic count = RECIPES × 17 axis steps
export const MINIS: DesignDNA[] = RECIPES.flatMap((r, rIdx) =>
  Array.from({ length: 17 }, (_, i) => buildMini(r, rIdx * 17 + i))
);
