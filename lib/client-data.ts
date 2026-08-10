import type { DesignDNA, PaletteDef, TypeSystem } from "@/lib/data/types";

export interface CatalogStats { designs: number; palettes: number; typeSystems: number; effects: number; flows: number; industries: number }

export interface CatalogPayload {
  designs: DesignDNA[];
  stats: CatalogStats;
  palettes: PaletteDef[];
  types: TypeSystem[];
}

let cache: CatalogPayload | null = null;

export async function loadCatalog(): Promise<CatalogPayload> {
  if (cache) return cache;
  const res = await fetch("/api/data", { cache: "force-cache" });
  const json = await res.json();
  cache = json;
  return json;
}
