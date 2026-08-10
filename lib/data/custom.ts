import type { DesignDNA } from "./types";

// ============================================================================
// ✏️  ADD YOUR OWN DESIGNS HERE — just append one object per design.
//    Schema quick-reference:
//
//    slug:      unique id (kebab-case)           rubric:   "W"=web "U"=app "G"=game
//    name:      display name                     industries: ids from craft.ts INDUSTRIES
//    vibe:      one-liner                        styles:     e.g. ["minimal","dark","neon"]
//    palettes:  1–3 palette ids from palettes.ts typePair:   id from typesystems.ts
//    effects:   ids from craft.ts EFFECTS        layout:     { hero, flow[], shell, density }
//    preview:   { mock: "statement"|"split"|"asymmetric"|"immersive"|"editorial"|"dashboard"
//                        |"console"|"chatui"|"canvas"|"bento"|"poster"|"hud"|"cardgame",
//                 stat: "one-line metric shown in preview" }
//    voice:     copy tone                        tags:       extra search words
//    featured:  true = bubbles to the top        hero (W): "statement"|"split"|"asymmetric"|
//                              "editorial"|"immersive"|"product"|"bento"|"typographic"
//                              "media"|"monumental"|"scrollstory"|"popstage"|"brutalframe"
//                              "arena"|"poster";   shell: "sidebar"|"commandbar"|"topnav"|
//                              "console"|"canvasdock";   density: "airy"|"balanced"|"dense"
// ============================================================================

export const CUSTOM: DesignDNA[] = [
  // Example:
  // {
  //   slug: "midnight-atelier",
  //   name: "Midnight Atelier",
  //   vibe: "Cinematic portfolio with spotlight cursor and pearlescent accents.",
  //   rubric: "W",
  //   industries: ["portfolio", "photography"],
  //   styles: ["dark", "luxury"],
  //   palettes: ["void-pearl"],
  //   typePair: "fashion",
  //   effects: ["spotlight", "textreveal", "grain", "parallax"],
  //   layout: {
  //     hero: "immersive",
  //     flow: ["gallery", "case-teaser", "awards", "cta-banner"],
  //     shell: "topnav",
  //     density: "airy",
  //   },
  //   preview: { mock: "poster", stat: "Spotlight hero" },
  //   voice: "Gallery-hushed, assured.",
  //   tags: ["spotlight", "cinematic"],
  //   featured: false,
  // },
];
