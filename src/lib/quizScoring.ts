import quizMapping from "@/data/quiz_mapping.json";
import { jobs, type Job } from "@/data/jobs";
import { getIndustryConfig, getIndustryQ2TileData } from "@/lib/industryMapping";

export interface UserSkill {
  name: string;
  boosted: boolean;
}

const synonymMap: Record<string, string> = {
  "troubleshooting": "problem solving",
  "de-escalation": "conflict resolution",
  "active listening": "communication",
  "composure under pressure": "active listening",
  "speed under pressure": "time management",
  "accuracy": "attention to detail",
  "accountability": "reliability",
  "personal care assistance": "patient care",
  "upselling": "selling",
  "organisation": "attention to detail",
  "multitasking": "time management",
  "scheduling": "time management",
  "documentation": "reporting",
  "teamwork": "communication",
  "mentoring": "training",
  "adaptability": "problem solving",
  "emotional intelligence": "empathy",
  "clinical empathy": "empathy",
  "outcome focus": "problem solving",
  "creative ownership": "creativity",
  "craft": "attention to detail",
  "initiative": "problem solving",
  "advocacy": "communication",
  "patient advocacy": "communication",
  "self-motivation": "reliability",
  "deadline management": "time management",
  "relationship building": "relationship management",
  "brief interpretation": "communication",
  "goal orientation": "goal setting",
  "crisis intervention": "conflict resolution",
  "process optimisation": "process improvement",
  "resilience under pressure": "resilience",
  "creative instinct": "creativity",
  "clinical assessment": "assessment",
  "multi-disciplinary teamwork": "teamwork",
  "lesson planning": "planning",
  "classroom management": "team leadership",
  "case management": "project management",
  "outcome-focused": "problem solving",
  "kpi tracking": "reporting",
  "memory": "attention to detail",
  "analytical thinking": "critical thinking",
  "collaboration": "teamwork",
  "team coordination": "teamwork",
  "performance management": "team leadership",
  "content creation": "creativity",
  "visual design": "creativity",
  "stakeholder management": "communication",
  "stakeholder communication": "communication",
  "physical fitness": "physical stamina",
  "report writing": "reporting",
  "surveillance": "attention to detail",
  "emergency response": "problem solving",
  "persuasive writing": "communication",
  "editing": "attention to detail",
  "social media": "communication",
  "copywriting": "communication",
  "brand voice": "communication",
  "debugging": "problem solving",
  "testing": "attention to detail",
  "patient comfort": "empathy",
  "food safety": "compliance",
  "cold calling": "communication",
  "sourcing": "relationship building",
  "fast learner": "adaptability",
  "self-starter": "reliability",
  "process mapping": "planning",
  "requirements gathering": "communication",
  "data visualisation": "data analysis",
  "sql": "data analysis",
  "excel": "data analysis",
  "version control": "documentation",
  "code review": "problem solving",
  "content strategy": "planning",
  "brand management": "planning",
  "seo": "analytics",
  "tax compliance": "compliance",
  "bookkeeping": "reporting",
  "financial reporting": "reporting",
  "financial modelling": "data analysis",
  "forecasting": "data analysis",
  "physical stamina": "reliability",
  "safety compliance": "compliance",
  "numerical accuracy": "attention to detail",
  "route planning": "planning",
  "safe driving": "reliability",
};

function normaliseSkill(s: string): string {
  const lower = s.toLowerCase().trim();
  return synonymMap[lower] || lower;
}

function skillsMatch(a: string, b: string): boolean {
  return normaliseSkill(a) === normaliseSkill(b);
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
 * Step B: Add Q2 skills and check for boost — industry-aware
 */
function addQ2Skills(
  userSkills: UserSkill[],
  q1Selections: string[],
  q2Selection: string,
  industry: string | null
): UserSkill[] {
  const existingNames = new Set(userSkills.map((s) => s.name.toLowerCase()));

  // Try industry-specific Q2 tile first
  if (industry) {
    const tileData = getIndustryQ2TileData(industry, q2Selection);
    if (tileData) {
      // Add skills from industry Q2
      for (const skill of tileData.maps_to_skills) {
        if (!existingNames.has(skill.toLowerCase())) {
          userSkills.push({ name: skill, boosted: false });
          existingNames.add(skill.toLowerCase());
        }
      }

      // Check amplification against Q1 selections
      const q1Tiles = quizMapping.question_1.tiles as Record<string, { maps_to_skills: string[] }>;
      const amplifiedQ1Tiles = tileData.amplifies_q1_tiles.filter((tile) =>
        q1Selections.includes(tile)
      );

      if (amplifiedQ1Tiles.length > 0) {
        const q2SkillsLower = new Set(tileData.maps_to_skills.map((s) => s.toLowerCase()));
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
  }

  // Fallback to generic Q2 mapping
  const q2Tiles = quizMapping.question_2.tiles as Record<
    string,
    { maps_to_skills: string[]; amplifies_q1_tiles: string[]; suggested_posting_ids: string[] }
  >;
  const q2Data = q2Tiles[q2Selection];
  if (!q2Data) return userSkills;

  for (const skill of q2Data.maps_to_skills) {
    if (!existingNames.has(skill.toLowerCase())) {
      userSkills.push({ name: skill, boosted: false });
      existingNames.add(skill.toLowerCase());
    }
  }

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
 * Extract skills from free text using keyword matching + industry story patterns
 */
export function extractSkillsFromText(text: string, industry: string | null = null): string[] {
  const lower = text.toLowerCase();

  // Try industry-specific story patterns first
  if (industry) {
    const config = getIndustryConfig(industry);
    if (config) {
      const matched: string[] = [];
      for (const sp of config.q3.story_patterns) {
        const patternWords = sp.pattern.toLowerCase().split(/\s+/);
        // Check if at least 2 words from the pattern appear in the text
        const hits = patternWords.filter((w) => w.length > 3 && lower.includes(w));
        if (hits.length >= 2) {
          matched.push(...sp.extracts);
        }
      }
      if (matched.length > 0) {
        return [...new Set(matched)].slice(0, 6);
      }
    }
  }

  // Generic fallback
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
 * Step D: Score all job postings — industry-aware
 */
function scorePostings(
  userSkills: UserSkill[],
  q1Selections: string[],
  q2Selection: string,
  industry: string | null
): ScoredPosting[] {
  const userSkillNormalised = userSkills.map((s) => normaliseSkill(s.name));
  const industryConfig = industry ? getIndustryConfig(industry) : null;

  // Get industry Q2 tile data for boost
  const industryQ2Tile = industry ? getIndustryQ2TileData(industry, q2Selection) : null;

  // Pre-filter by industry categories if available
  let filteredJobs = jobs;
  if (industryConfig) {
    const categories = industryConfig.posting_categories.map((c) => c.toLowerCase());
    // Include jobs from industry categories but also keep any high-matching ones
    filteredJobs = jobs.filter(
      (j) => categories.includes(j.category.toLowerCase())
    );
    // If too few results, fall back to all jobs
    if (filteredJobs.length < 10) {
      filteredJobs = jobs;
    }
  }

  return filteredJobs
    .map((posting) => {
      const matchedSkills = posting.skills.filter((skill) =>
        userSkillNormalised.includes(normaliseSkill(skill))
      );

      let matchScore = posting.skills.length > 0
        ? matchedSkills.length / posting.skills.length
        : 0;

      // Industry Q2 boost: if posting's category matches boost_posting_categories
      if (industryQ2Tile) {
        const boostCats = industryQ2Tile.boost_posting_categories.map((c) => c.toLowerCase());
        if (boostCats.includes(posting.category.toLowerCase())) {
          matchScore = Math.min(matchScore + 0.1, 1.0);
        }
      } else {
        // Generic Q2 boost fallback
        const q2Tiles = quizMapping.question_2.tiles as Record<
          string,
          { maps_to_skills: string[]; amplifies_q1_tiles: string[]; suggested_posting_ids: string[] }
        >;
        const q2Data = q2Tiles[q2Selection];
        if (q2Data) {
          const q2AmplifiesQ1 = q2Data.amplifies_q1_tiles.some((tile) =>
            q1Selections.includes(tile)
          );
          if (q2Data.suggested_posting_ids.includes(posting.id) && q2AmplifiesQ1) {
            matchScore = Math.min(matchScore + 0.1, 1.0);
          }
        }
      }

      // Nice-to-have bonus
      const niceMatches = posting.niceToHaveSkills.filter((skill) =>
        userSkillNormalised.includes(normaliseSkill(skill))
      );
      if (niceMatches.length > 0) {
        matchScore = Math.min(matchScore + niceMatches.length * 0.05, 1.0);
      }

      const gapSkills = posting.skills.filter(
        (skill) => !userSkillNormalised.includes(normaliseSkill(skill))
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
  isStudent: boolean = false,
  industry: string | null = null,
  preExtractedQ3Skills?: string[]
): { userSkills: UserSkill[]; topMatches: ScoredPosting[] } {
  // Step A
  let userSkills = getQ1Skills(q1Selections);

  // Step B — industry-aware
  userSkills = addQ2Skills(userSkills, q1Selections, q2Selection, industry);

  // Step C — use Claude-extracted skills when available, otherwise keyword matching
  const q3Skills = preExtractedQ3Skills ?? extractSkillsFromText(q3Answer, industry);
  userSkills = addQ3Skills(userSkills, q3Skills);

  // Step D — industry-aware scoring
  let scored = scorePostings(userSkills, q1Selections, q2Selection, industry);

  // Filter by seniority for students
  if (isStudent) {
    const industryConfig = industry ? getIndustryConfig(industry) : null;
    if (industryConfig) {
      const allowedSeniority = industryConfig.seniority_filter.map((s) => s.toLowerCase());
      scored = scored.filter((p) => allowedSeniority.includes(p.seniority.toLowerCase()));
    } else {
      scored = scored.filter((p) => p.seniority !== "Senior");
    }
  }

  const topMatches = scored.slice(0, 5);
  const displaySkills = userSkills.slice(0, 8);

  return { userSkills: displaySkills, topMatches };
}
