// ---------- Design DNA schema (the heart of Motif) ----------

export type Rubric = "W" | "U" | "G"; // Web, App UI, Game

export interface DesignDNA {
  slug: string;
  name: string;
  vibe: string;          // one-liner identity
  rubric: Rubric;
  industries: string[];
  styles: string[];
  palettes: string[];    // palette ids
  typePair: string;      // type-system id
  effects: string[];     // craft/effect ids
  layout: LayoutDNA;
  preview: PreviewDNA;
  voice: string;         // copy tone
  featured?: boolean;
  isPremium?: boolean;
  tags: string[];        // extra search terms
  mini?: boolean;        // skeleton entry (expandable by AI)
  brief?: string;        // AI-expanded concept brief (cached once generated)
}

export interface LayoutDNA {
  hero: HeroKind;
  flow: string[];        // feature-flow section ids
  shell: ShellKind;      // U rubric app shell
  density: "airy" | "balanced" | "dense";
}

export type HeroKind =
  | "statement" | "split" | "asymmetric" | "editorial" | "immersive"
  | "product" | "bento" | "typographic" | "media" | "monumental"
  | "scrollstory" | "popstage" | "brutalframe" | "arena" | "poster";

export type ShellKind =
  | "sidebar" | "commandbar" | "topnav" | "console" | "canvasdock";

export interface PreviewDNA {
  mock: MockKind;
  stat: string;
}

export type MockKind =
  | "statement" | "split" | "asymmetric" | "immersive" | "editorial"
  | "dashboard" | "console" | "chatui" | "canvas" | "bento"
  | "poster" | "hud" | "cardgame" | "shop";

export interface PaletteDef {
  id: string;
  name: string;
  bg: string;
  surface: string;
  text: string;
  muted: string;
  accent: string;
  accent2: string;
  dark: boolean;
  swatch: string[]; // for UI chips
}

export interface TypeSystem {
  id: string;
  name: string;
  display: { family: string; weight: number; tracking: string; css: string };
  body: { family: string; weight: number; lineHeight: string; css: string };
  scale: string;
  glyph: string;
}

export interface EffectDef {
  id: string;
  name: string;
  tag: string; // craft group
  css: string; // one-line css signature for preview
}

export interface FlowDef {
  id: string;
  name: string;
}

export interface IndustryDef {
  id: string;
  name: string;
}

export const RUBRIC_LABEL: Record<Rubric, string> = {
  W: "Web & Landing",
  U: "Apps & UI",
  G: "Games & Interactive",
};
