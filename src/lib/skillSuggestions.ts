import { jobs } from "@/data/jobs";

let cached: string[] | null = null;

/**
 * Returns a sorted, de-duplicated list of every skill that appears
 * in any job posting (required + nice-to-have). Used to power autocomplete.
 */
export function getAllSkills(): string[] {
  if (cached) return cached;
  const set = new Set<string>();
  for (const j of jobs) {
    j.skills.forEach((s) => set.add(s));
    j.niceToHaveSkills.forEach((s) => set.add(s));
  }
  cached = Array.from(set).sort((a, b) => a.localeCompare(b));
  return cached;
}

export function suggestSkills(query: string, exclude: string[], limit = 8): string[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const excludeSet = new Set(exclude.map((s) => s.toLowerCase()));
  const all = getAllSkills();
  const starts: string[] = [];
  const contains: string[] = [];
  for (const s of all) {
    if (excludeSet.has(s.toLowerCase())) continue;
    const lower = s.toLowerCase();
    if (lower.startsWith(q)) starts.push(s);
    else if (lower.includes(q)) contains.push(s);
    if (starts.length + contains.length >= limit * 2) break;
  }
  return [...starts, ...contains].slice(0, limit);
}
