import industryData from "@/data/industry_q2_q3_mapping.json";

interface IndustryQ2Tile {
  maps_to_skills: string[];
  personality_signal: string;
  amplifies_q1_tiles: string[];
  suggested_titles: string[];
  boost_posting_categories: string[];
}

interface IndustryQ4 {
  heading: string;
  subtitle: string;
  placeholder: string;
  ai_context: string;
  story_patterns: { pattern: string; extracts: string[] }[];
}

interface IndustryQ2 {
  heading: string;
  subtitle: string;
  tiles: Record<string, IndustryQ2Tile>;
}

export interface IndustryConfig {
  job_titles: string[];
  posting_categories: string[];
  seniority_filter: string[];
  q2: IndustryQ2;
  q4: IndustryQ4;
}

const industries = (industryData as any).industries as Record<string, IndustryConfig>;

export function getIndustryConfig(industry: string | null): IndustryConfig | null {
  if (!industry) return null;
  return industries[industry] ?? null;
}

export function getIndustryQ2Tiles(industry: string | null): string[] {
  const config = getIndustryConfig(industry);
  if (!config) return [];
  return Object.keys(config.q2.tiles);
}

export function getIndustryQ2TileData(industry: string, tile: string): IndustryQ2Tile | null {
  const config = getIndustryConfig(industry);
  if (!config) return null;
  return config.q2.tiles[tile] ?? null;
}
