import quizMapping from "@/data/quiz_mapping.json";
import { jobs, type Job } from "@/data/jobs";

export interface UserSkill {
  name: string;
  boosted: boolean;
}

export interface ScoredPosting extends Job {
  matchedSkills: string[];
  matchScore: number;
  gapSkills: string[];
}

/**
 * Step A: Build skills from Q1 selections
 */
function getQ1Skills(q1Selections: string[]): UserSkill[] {
  const skillSet = new Set<string>();
  const q1Tiles = quizMapping.question_1.tiles as Record<string, { maps_to_skills: string[] }>;

  for (const tile of q1Selections) {
    const mapping = q1Tiles[tile];
    if (mapping) {
      mapping.maps_to_skills.forEach((s) => skillSet.add(s));
    }
  }

  return Array.from(skillSet).map((name) => ({ name, boosted: false }));
}

/**
 * Step B: Add Q2 skills and check for boost
 */
function addQ2Skills(
  userSkills: UserSkill[],
  q1Selections: string[],
  q2Selection: string
): UserSkill[] {
  const q2Tiles = quizMapping.question_2.tiles as Record<
    string,
    { maps_to_skills: string[]; amplifies_q1_tiles: string[]; suggested_posting_ids: string[] }
  >;
  const q2Data = q2Tiles[q2Selection];
  if (!q2Data) return userSkills;

  const existingNames = new Set(userSkills.map((s) => s.name.toLowerCase()));

  // Add Q2 skills
  for (const skill of q2Data.maps_to_skills) {
    if (!existingNames.has(skill.toLowerCase())) {
      userSkills.push({ name: skill, boosted: false });
      existingNames.add(skill.toLowerCase());
    }
  }

  // Check amplification
  const q1Tiles = quizMapping.question_1.tiles as Record<string, { maps_to_skills: string[] }>;
  const amplifiedQ1Tiles = q2Data.amplifies_q1_tiles.filter((tile) =>
    q1Selections.includes(tile)
  );

  if (amplifiedQ1Tiles.length > 0) {
    const q2SkillsLower = new Set(q2Data.maps_to_skills.map((s) => s.toLowerCase()));

    for (const tile of amplifiedQ1Tiles) {
      const q1Data = q1Tiles[tile];
      if (!q1Data) continue;
      for (const q1Skill of q1Data.maps_to_skills) {
        if (q2SkillsLower.has(q1Skill.toLowerCase())) {
          const found = userSkills.find(
            (s) => s.name.toLowerCase() === q1Skill.toLowerCase()
          );
          if (found) found.boosted = true;
        }
      }
    }
  }

  return userSkills;
}

/**
 * Step C: Add Q3 extracted skills (from keyword extraction)
 */
function addQ3Skills(userSkills: UserSkill[], q3Skills: string[]): UserSkill[] {
  const existingNames = new Set(userSkills.map((s) => s.name.toLowerCase()));
  for (const skill of q3Skills) {
    if (!existingNames.has(skill.toLowerCase())) {
      userSkills.push({ name: skill, boosted: false });
      existingNames.add(skill.toLowerCase());
    }
  }
  return userSkills;
}

/**
 * Extract skills from free text using keyword matching
 * This is a local fallback — can be replaced with an AI call
 */
export function extractSkillsFromText(text: string): string[] {
  const lower = text.toLowerCase();
  const skillKeywords: Record<string, string[]> = {
    Leadership: ["led", "lead", "managed", "team", "supervised", "mentored"],
    "Problem solving": ["solved", "fixed", "resolved", "figured out", "troubleshoot"],
    Communication: ["explained", "communicated", "presented", "spoke", "wrote"],
    "Customer service": ["customer", "client", "helped", "served", "support"],
    "Team leadership": ["team", "led", "managed", "coached", "trained"],
    Organisation: ["organised", "organized", "streamlined", "coordinated", "planned"],
    Creativity: ["created", "designed", "built", "invented", "developed"],
    "Time management": ["deadline", "on time", "schedule", "prioriti"],
    Negotiation: ["negotiated", "deal", "convinced", "persuaded"],
    Research: ["researched", "analysed", "analyzed", "investigated", "studied"],
    Empathy: ["cared", "supported", "listened", "understood", "compassion"],
    Sales: ["sold", "revenue", "target", "quota", "closed"],
    Teaching: ["taught", "trained", "mentored", "explained", "educated"],
    Adaptability: ["adapted", "flexible", "changed", "pivot", "new approach"],
    "Critical thinking": ["analyzed", "evaluated", "assessed", "strategy"],
    Documentation: ["documented", "recorded", "reported", "wrote report"],
  };

  const matched: string[] = [];
  for (const [skill, keywords] of Object.entries(skillKeywords)) {
    if (keywords.some((kw) => lower.includes(kw))) {
      matched.push(skill);
    }
  }

  return matched.slice(0, 6);
}

/**
 * Step D: Score all 50 job postings
 */
function scorePostings(
  userSkills: UserSkill[],
  q1Selections: string[],
  q2Selection: string
): ScoredPosting[] {
  const q2Tiles = quizMapping.question_2.tiles as Record<
    string,
    { maps_to_skills: string[]; amplifies_q1_tiles: string[]; suggested_posting_ids: string[] }
  >;
  const q2Data = q2Tiles[q2Selection];
  const userSkillNames = userSkills.map((s) => s.name.toLowerCase());

  return jobs
    .map((posting) => {
      const matchedSkills = posting.skills.filter((skill) =>
        userSkillNames.includes(skill.toLowerCase())
      );

      let matchScore = posting.skills.length > 0
        ? matchedSkills.length / posting.skills.length
        : 0;

      // Q2 boost
      if (q2Data) {
        const q2PostingIds = q2Data.suggested_posting_ids;
        const q2AmplifiesQ1 = q2Data.amplifies_q1_tiles.some((tile) =>
          q1Selections.includes(tile)
        );

        if (q2PostingIds.includes(posting.id) && q2AmplifiesQ1) {
          matchScore = Math.min(matchScore + 0.1, 1.0);
        }
      }

      // Also check nice_to_have for bonus matches
      const niceMatches = posting.niceToHaveSkills.filter((skill) =>
        userSkillNames.includes(skill.toLowerCase())
      );
      if (niceMatches.length > 0) {
        matchScore = Math.min(matchScore + niceMatches.length * 0.05, 1.0);
      }

      const gapSkills = posting.skills.filter(
        (skill) => !userSkillNames.includes(skill.toLowerCase())
      );

      return {
        ...posting,
        matchedSkills,
        matchScore: Math.round(matchScore * 100),
        gapSkills,
      };
    })
    .sort((a, b) => b.matchScore - a.matchScore);
}

/**
 * Main scoring function — runs the full pipeline
 */
export function runQuizScoring(
  q1Selections: string[],
  q2Selection: string,
  q3Answer: string,
  isStudent: boolean = false
): { userSkills: UserSkill[]; topMatches: ScoredPosting[] } {
  // Step A
  let userSkills = getQ1Skills(q1Selections);

  // Step B
  userSkills = addQ2Skills(userSkills, q1Selections, q2Selection);

  // Step C
  const q3Skills = extractSkillsFromText(q3Answer);
  userSkills = addQ3Skills(userSkills, q3Skills);

  // Step D
  let scored = scorePostings(userSkills, q1Selections, q2Selection);

  // Filter out Senior roles for student path
  if (isStudent) {
    scored = scored.filter((p) => p.seniority !== "Senior");
  }

  const topMatches = scored.slice(0, 5);

  // Limit skills display to 8
  const displaySkills = userSkills.slice(0, 8);

  return { userSkills: displaySkills, topMatches };
}
