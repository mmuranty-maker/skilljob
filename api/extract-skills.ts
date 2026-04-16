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

// Translation guide: common job listing jargon → canonical label.
// When you encounter any of these in free text, map to the canonical term on the right.
const JARGON_TRANSLATIONS = `
Roadmapping → Planning
Product roadmap → Planning
Sprint planning → Task Management
Backlog management → Task Management
Agile / Scrum / Kanban → Task Management
OKRs → Leadership
Stakeholder management → Working with Others
Cross-functional collaboration → Working with Others
User research → Assessment
A/B testing → Data Analysis
KPI tracking → Reporting
Market research → Business Awareness
Competitive analysis → Business Awareness
Code review / Debugging → Problem Solving
System design / Software architecture → Planning
Version control / Git → Documentation
CI/CD / DevOps → Problem Solving
Machine learning / SQL / Excel → Data Analysis
AWS / Azure / Cloud infrastructure → Information Technology
Docker / Kubernetes / Linux → Information Technology
Cold calling / Cold outreach / Prospecting → Customer Care
Revenue targets / Quota / Pipeline management → Business Awareness
CRM → Relationship Management
Closing / Objection handling → Negotiation
Account management / Client relations → Relationship Management
Upselling / Cross-selling → Customer Care
Business development → Business Awareness
SEO / SEM / Google Analytics / Analytics → Data Analysis
Content strategy / Brand strategy / Campaign management → Planning
Social media / Copywriting / Brand voice → Communication
Content creation / Visual design / Motion graphics → Creativity
Financial modelling / Forecasting / Valuation → Data Analysis
Bookkeeping / Financial reporting → Reporting
Tax compliance / GDPR / Regulatory compliance → Compliance
Auditing / Due diligence → Assessment
People management / Performance management → Leadership
Team management → Team Leadership
Self-starter / Proactive / Initiative → Self-Management
Process optimization / Continuous improvement / Lean → Process Improvement
Vendor management / Supplier management → Relationship Management
Budget management / P&L → Business Awareness
Supply chain / Procurement / Logistics → Planning
Recruitment / Talent acquisition → Relationship Management
Learning and development / L&D / Coaching → Training
Employee relations / DEI → Working with Others
Graphic design / UI design / UX design / Illustration / Animation → Creativity
Wireframing / Storyboarding → Planning
Adobe Suite / Figma → Information Technology
Art direction / Creative direction / Directing → Leadership
Film production / Event management → Project Management
Video editing / Photography / Sound design / Colour grading → Creativity
Script writing / Screenwriting / Copywriting → Communication
Safeguarding / Health and safety → Health and Safety
Confidentiality / Data protection → Compliance
Presentation skills / Influencing / Persuasion → Communication
Relationship building / Networking → Relationship Management
Fast learner / Continuous learning → Improving Own Learning
Resilience / Stress management → Resilience
Decision making → Problem Solving
Numeracy / Financial literacy → Application of Number
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

When you encounter jargon from job listings or CVs, translate it to the canonical label using this guide:
${JARGON_TRANSLATIONS}

Industry context: ${industry ?? "General"}

Story: "${text}"

Return a JSON array of 2–6 skill strings using only canonical labels. Nothing else — no explanation, no markdown.
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
