import Anthropic from "@anthropic-ai/sdk";

export const config = {
  runtime: "edge",
};

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// UK-SSC 13 Core Skills plus common workplace skill labels used throughout the app.
// Claude must map free text to these canonical terms so they match the synonym map
// in quizScoring.ts and score correctly against job postings.
const SKILL_TAXONOMY = `
UK-SSC 13 Core Skills (canonical terms):
- Communication
- Application of Number
- Information Technology
- Problem Solving
- Working with Others
- Improving Own Learning
- Health and Safety
- Customer Care
- Task Management
- Leadership
- Business Awareness
- Teamwork
- Self-Management

Additional workplace skill labels accepted by the matching system:
- Conflict Resolution
- Team Leadership
- Customer Service
- Time Management
- Data Analysis
- Planning
- Training
- Reliability
- Empathy
- Creativity
- Reporting
- Compliance
- Relationship Management
- Project Management
- Process Improvement
- Negotiation
- Critical Thinking
- Resilience
- Assessment
- Documentation
`.trim();

export default async function handler(req: Request): Promise<Response> {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  let text: string;
  let industry: string | null;

  try {
    const body = await req.json();
    text = body.text ?? "";
    industry = body.industry ?? null;
  } catch {
    return new Response(JSON.stringify({ skills: [] }), {
      headers: { "Content-Type": "application/json" },
    });
  }

  if (!text || text.trim().length < 15) {
    return new Response(JSON.stringify({ skills: [] }), {
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const response = await client.messages.create({
      model: "claude-opus-4-6",
      max_tokens: 256,
      messages: [
        {
          role: "user",
          content: `Extract transferable skills from this work story. Use ONLY labels from the taxonomy below — do not invent new skill names.

${SKILL_TAXONOMY}

Industry context: ${industry ?? "General"}

Story: "${text}"

Return a JSON array of 2–6 skill strings. Nothing else — no explanation, no markdown.
Example: ["Communication", "Problem Solving", "Team Leadership"]`,
        },
      ],
    });

    const block = response.content[0];
    if (block.type !== "text") {
      return jsonResponse({ skills: [] });
    }

    const match = block.text.match(/\[[\s\S]*?\]/);
    if (!match) return jsonResponse({ skills: [] });

    const parsed = JSON.parse(match[0]);
    if (!Array.isArray(parsed)) return jsonResponse({ skills: [] });

    const skills = parsed.filter((s): s is string => typeof s === "string");
    return jsonResponse({ skills });
  } catch (err) {
    console.error("[extract-skills] Claude API error:", err);
    // Return empty so the frontend falls back to keyword matching
    return jsonResponse({ skills: [] });
  }
}

function jsonResponse(body: unknown): Response {
  return new Response(JSON.stringify(body), {
    headers: { "Content-Type": "application/json" },
  });
}
