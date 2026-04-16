import { extractSkillsFromText } from "./quizScoring";

/**
 * Extract skills from a proud-moment story using the Claude API.
 * Falls back to local keyword matching if the API is unavailable or times out.
 *
 * The caller (SkillQuiz) passes the result into runQuizScoring as
 * preExtractedQ3Skills so the local extractSkillsFromText is skipped.
 */
export async function extractSkillsWithFallback(
  text: string,
  industry: string | null
): Promise<string[]> {
  if (!text || text.trim().length < 15) return [];

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);

    const response = await fetch("/api/extract-skills", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text, industry }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const data = await response.json();
    if (Array.isArray(data.skills) && data.skills.length > 0) {
      return data.skills as string[];
    }
  } catch (err) {
    // API unavailable, timed out, or returned empty — fall through to keyword matching
    console.warn("[extractSkillsApi] Falling back to keyword matching:", err);
  }

  return extractSkillsFromText(text, industry);
}
