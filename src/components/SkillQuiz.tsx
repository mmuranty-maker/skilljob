import { useState } from "react";
import { X, Loader2, Briefcase, GraduationCap, UtensilsCrossed, ShoppingBag, Heart, Cpu, Building2, Megaphone, Palette, Landmark, BookOpen, Wrench } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { QuizResults } from "./QuizResults";
import { runQuizScoring, type UserSkill, type ScoredPosting } from "@/lib/quizScoring";
import { getIndustryConfig, getIndustryQ2Tiles } from "@/lib/industryMapping";

const INDUSTRIES = [
  { title: "Hospitality & Food Service", subtitle: "Hotels, restaurants, events", icon: UtensilsCrossed },
  { title: "Retail & Customer Service", subtitle: "Shops, support, client-facing roles", icon: ShoppingBag },
  { title: "Healthcare & Medicine", subtitle: "Hospitals, clinics, care roles", icon: Heart },
  { title: "Technology & Engineering", subtitle: "Software, hardware, IT", icon: Cpu },
  { title: "Business & Operations", subtitle: "Admin, logistics, management", icon: Building2 },
  { title: "Sales & Marketing", subtitle: "Revenue, campaigns, outreach", icon: Megaphone },
  { title: "Creative & Media", subtitle: "Design, content, film, music", icon: Palette },
  { title: "Finance & Accounting", subtitle: "Banking, bookkeeping, auditing", icon: Landmark },
  { title: "Education & Social Care", subtitle: "Teaching, training, community", icon: BookOpen },
  { title: "Trades & Construction", subtitle: "Plumbing, electrical, building", icon: Wrench },
];

const ACTIVITIES = [
  "Talking to people",
  "Managing tasks & schedules",
  "Solving problems",
  "Working with data or numbers",
  "Creating content or designs",
  "Leading or coaching others",
  "Selling or persuading",
  "Building or fixing things",
  "Caring for or supporting people",
  "Writing or researching",
  "Teaching or explaining",
  "Organising processes",
];

const Q1_TILES_BY_INDUSTRY: Record<string, string[]> = {
  "Hospitality & Food Service": [
    "Serving and looking after guests",
    "Handling complaints and difficult situations",
    "Upselling and recommending to customers",
    "Training and supporting new team members",
    "Managing a section or station under pressure",
    "Coordinating with kitchen or back-of-house",
    "Creating menus, specials or experiences",
    "Keeping stock, prep and inventory organised",
    "Leading a shift or running a team",
    "Maintaining hygiene and safety standards",
    "Building regulars and loyal customers",
    "Working fast and accurately at high volume",
  ],
  "Retail & Customer Service": [
    "Serving customers and handling enquiries",
    "Resolving complaints and difficult situations",
    "Selling, upselling and hitting targets",
    "Training or supporting colleagues",
    "Managing stock, displays or floor layout",
    "Operating tills, systems and admin",
    "Leading a team or shift",
    "Keeping the shop floor organised and running",
    "Working with data, reports or sales figures",
    "Building customer loyalty and relationships",
    "Processing returns, refunds and exchanges",
    "Working fast and accurately under pressure",
  ],
  "Healthcare & Medicine": [
    "Assessing and monitoring patients",
    "Administering medication or treatments",
    "Supporting patients emotionally and mentally",
    "Documenting clinical notes and records",
    "Educating patients or their families",
    "Coordinating care across teams or agencies",
    "Training or supervising junior colleagues",
    "Identifying risks or safeguarding concerns",
    "Managing a caseload or patient list",
    "Using clinical equipment or technology",
    "Responding to emergencies or urgent situations",
    "Improving ward or clinic processes",
  ],
  "Technology & Engineering": [
    "Writing, reviewing or debugging code",
    "Building or maintaining systems and infrastructure",
    "Analysing data or working with databases",
    "Designing or architecting solutions",
    "Testing, QA and quality assurance",
    "Managing deployments and releases",
    "Explaining technical concepts to others",
    "Documenting systems or processes",
    "Identifying and fixing security risks",
    "Leading technical projects or sprints",
    "Learning and applying new technologies",
    "Automating manual processes",
  ],
  "Business & Operations": [
    "Managing projects and delivering to deadlines",
    "Coordinating teams or departments",
    "Analysing data and producing reports",
    "Improving processes and ways of working",
    "Managing budgets or financial planning",
    "Negotiating with vendors or stakeholders",
    "Recruiting, onboarding or developing people",
    "Writing documents, policies or procedures",
    "Running meetings and managing stakeholders",
    "Managing suppliers or procurement",
    "Ensuring compliance and managing risk",
    "Handling admin, scheduling and organisation",
  ],
  "Sales & Marketing": [
    "Prospecting and generating new leads",
    "Managing and growing existing accounts",
    "Pitching, presenting and closing deals",
    "Creating content or campaigns",
    "Analysing performance data and reporting",
    "Managing social media or digital channels",
    "Writing copy or creating messaging",
    "Running paid advertising or SEO",
    "Building relationships with clients or partners",
    "Researching markets, trends or competitors",
    "Managing a pipeline or CRM",
    "Planning and executing go-to-market activity",
  ],
  "Creative & Media": [
    "Designing visuals, layouts or brand assets",
    "Writing, editing or producing content",
    "Filming, photographing or recording",
    "Editing video, audio or post-production",
    "Taking and interpreting client briefs",
    "Managing creative projects and timelines",
    "Researching trends, references or inspiration",
    "Presenting creative work to stakeholders",
    "Working with tools like Adobe, Figma or DAWs",
    "Animating, illustrating or motion design",
    "Managing social content or digital channels",
    "Translating or localising content",
  ],
  "Finance & Accounting": [
    "Preparing financial statements and reports",
    "Managing accounts payable or receivable",
    "Building financial models or forecasts",
    "Conducting audits or compliance reviews",
    "Processing payroll or tax returns",
    "Analysing financial data and spotting trends",
    "Managing budgets and cost control",
    "Advising clients on financial decisions",
    "Negotiating deals or contracts",
    "Identifying financial risks or irregularities",
    "Working with accounting software or ERP",
    "Documenting financial processes and policies",
  ],
  "Education & Social Care": [
    "Planning and delivering lessons or sessions",
    "Assessing and tracking progress",
    "Supporting students or clients emotionally",
    "Managing behaviour or difficult situations",
    "Writing reports, case notes or documentation",
    "Liaising with parents, families or carers",
    "Coordinating with external agencies or services",
    "Designing curricula or learning programmes",
    "Advocating for students or vulnerable people",
    "Running group sessions or workshops",
    "Identifying safeguarding or welfare concerns",
    "Mentoring or coaching individuals",
  ],
  "Trades & Construction": [
    "Installing, fitting or building physical things",
    "Diagnosing faults and troubleshooting",
    "Reading blueprints, plans or technical drawings",
    "Operating tools, machinery or equipment",
    "Following health and safety procedures",
    "Coordinating with other trades on site",
    "Managing materials, stock or supplies",
    "Communicating with clients about the job",
    "Training or supervising apprentices",
    "Estimating, quoting or pricing jobs",
    "Inspecting work and maintaining quality",
    "Managing a site or project schedule",
  ],
};

const STUDENT_SUBTEXTS: Record<string, string> = {
  "Leading or coaching others": "e.g. society president, group project lead",
  "Selling or persuading": "e.g. pitching ideas, sponsorship, fundraising",
  "Caring for or supporting people": "e.g. volunteering, peer support, tutoring",
  "Building or fixing things": "e.g. hackathons, lab work, DIY projects",
};

// Generic fallback Q2 tiles (used if industry not found)
const GENERIC_Q2_TILES = [
  "I solved something that had everyone else stuck",
  "I helped someone through a difficult situation",
  "I organised chaos and made things run smoothly",
  "I created something I'm genuinely proud of",
  "I closed a deal or convinced someone of something",
  "I learned something completely new",
  "I led people through something challenging",
];

interface SkillQuizProps {
  open: boolean;
  onClose: () => void;
  onComplete: (topSkill: string) => void;
  onQuizResults?: (userSkills: UserSkill[], topMatches: ScoredPosting[], skippedQ3?: boolean) => void;
}

export function SkillQuiz({ open, onClose, onComplete, onQuizResults }: SkillQuizProps) {
  const [step, setStep] = useState(0);
  const [isStudent, setIsStudent] = useState(false);
  const [industry, setIndustry] = useState<string | null>(null);
  const [q1Selections, setQ1Selections] = useState<string[]>([]);
  const [q2Selection, setQ2Selection] = useState<string | null>(null);
  const [q3Answer, setQ3Answer] = useState("");
  const [loading, setLoading] = useState(false);
  const [userSkills, setUserSkills] = useState<UserSkill[] | null>(null);
  const [topMatches, setTopMatches] = useState<ScoredPosting[]>([]);

  if (!open) return null;

  const industryConfig = getIndustryConfig(industry);

  // Get Q2 tiles — industry-specific or generic fallback
  const q2Tiles = industry ? getIndustryQ2Tiles(industry) : [];
  const activeQ2Tiles = q2Tiles.length > 0 ? q2Tiles : GENERIC_Q2_TILES;

  // Get Q2/Q3 headings — fixed copy across all industries
  const q2Heading = "Pick the one that describes how you do your best work";
  const q2Subtitle = "Choose the one that feels most true — even if more than one applies.";
    

  const q3Heading = industryConfig?.q3.heading
    ?? (isStudent ? "Tell us about something you've done that you're proud of" : "Tell us about something you're proud of");
  const q3Subtitle = industryConfig?.q3.subtitle
    ?? (isStudent ? "A project, a job, a society role, anything — big or small." : "At work, big or small — what's something you did that you felt good about?");
  const q3Placeholder = industryConfig?.q3.placeholder
    ?? (isStudent
      ? "e.g. I led our university charity campaign and raised £3,000, I built an app for my final year project, I managed social media for our student union..."
      : "e.g. I trained 3 new starters, I reorganised how we handle complaints, I hit my sales target during a really tough month…");

  const toggleActivity = (a: string) => {
    setQ1Selections((prev) =>
      prev.includes(a) ? prev.filter((x) => x !== a) : [...prev, a]
    );
  };

  const selectPath = (student: boolean) => {
    setIsStudent(student);
    setStep(1);
  };

  const handleSubmit = (skipQ3 = false) => {
    setLoading(true);
    setStep(5);

    const q3SkipRef = skipQ3;
    const start = Date.now();

    setTimeout(() => {
      const result = runQuizScoring(q1Selections, q2Selection || "", q3SkipRef ? "" : q3Answer, isStudent, industry);
      const elapsed = Date.now() - start;
      const remaining = Math.max(0, 1500 - elapsed);

      setTimeout(() => {
        // Store skip state for results page
        (window as any).__skilljob_skippedQ3 = q3SkipRef;
        // Skip the results popup — navigate directly
        if (onQuizResults && result.topMatches.length > 0) {
          onQuizResults(result.userSkills, result.topMatches, q3SkipRef);
          resetAndClose();
        } else if (result.userSkills.length > 0) {
          onComplete(result.userSkills[0].name);
          resetAndClose();
        } else {
          setUserSkills(result.userSkills);
          setTopMatches(result.topMatches);
          setLoading(false);
        }
      }, remaining);
    }, 100);
  };

  const handleSeeAll = () => {
    if (onQuizResults && userSkills && topMatches.length > 0) {
      onQuizResults(userSkills, topMatches, !!(window as any).__skilljob_skippedQ3);
    } else if (userSkills && userSkills.length > 0) {
      onComplete(userSkills[0].name);
    }
    resetAndClose();
  };

  const resetAndClose = () => {
    setStep(0);
    setIsStudent(false);
    setIndustry(null);
    setQ1Selections([]);
    setQ2Selection(null);
    setQ3Answer("");
    setLoading(false);
    setUserSkills(null);
    setTopMatches([]);
    onClose();
  };

  const handleStartOver = () => {
    setStep(0);
    setIsStudent(false);
    setIndustry(null);
    setQ1Selections([]);
    setQ2Selection(null);
    setQ3Answer("");
    setLoading(false);
    setUserSkills(null);
    setTopMatches([]);
  };

  const progress = step >= 1 && step <= 4 ? (step / 4) * 100 : 100;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-foreground/40 backdrop-blur-sm animate-fade-in"
        onClick={resetAndClose}
      />

      <div className="relative z-10 w-full max-w-[560px] bg-card rounded-2xl shadow-2xl overflow-hidden animate-scale-in max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-6 pb-0 shrink-0">
          <div className="flex items-center justify-between mb-4">
            {step >= 1 && step <= 4 && (
              <span className="text-sm font-medium text-muted-foreground">
                Step {step} of 4
              </span>
            )}
            {(step === 0 || step === 5) && <span />}
            <button
              onClick={resetAndClose}
              className="h-8 w-8 rounded-full flex items-center justify-center hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          {step >= 1 && step <= 4 && (
            <Progress value={progress} className="h-1.5 mb-6" />
          )}
        </div>

        {/* Content */}
        <div className="px-6 pb-6 min-h-[320px] flex flex-col overflow-y-auto">
          {/* Step 0 — Path Selector */}
          {step === 0 && (
            <div className="animate-fade-in flex flex-col items-center flex-1 py-4">
              <h3 className="text-[22px] font-medium text-foreground text-center mb-8">
                First, which best describes you right now?
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
                <div className="border border-border rounded-xl p-8 bg-card hover:border-primary/40 transition-all flex flex-col items-center text-center">
                  <Briefcase className="h-8 w-8 text-primary mb-4" />
                  <h4 className="font-semibold text-foreground text-base mb-1">I'm currently working</h4>
                  <p className="text-sm text-muted-foreground mb-6">Full-time, part-time, or freelance</p>
                  <button
                    onClick={() => selectPath(false)}
                    className="w-full h-10 rounded-xl bg-primary text-primary-foreground font-bold text-sm hover:brightness-110 transition-all"
                  >
                    Start →
                  </button>
                </div>
                <div className="border border-border rounded-xl p-8 bg-card hover:border-primary/40 transition-all flex flex-col items-center text-center">
                  <GraduationCap className="h-8 w-8 text-primary mb-4" />
                  <h4 className="font-semibold text-foreground text-base mb-1">I'm a student or recent graduate</h4>
                  <p className="text-sm text-muted-foreground mb-6">University, college, or just finished</p>
                  <button
                    onClick={() => selectPath(true)}
                    className="w-full h-10 rounded-xl border border-primary text-primary font-bold text-sm hover:bg-primary/5 transition-all"
                  >
                    Start →
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Step 1 — Industry Selection */}
          {step === 1 && (
            <div className="animate-fade-in flex flex-col flex-1">
              <h3 className="text-xl font-bold text-foreground">
                {isStudent ? "What area interests you most?" : "What industry do you work in?"}
              </h3>
              <p className="text-sm text-muted-foreground mt-1 mb-6">
                {isStudent
                  ? "Pick the field you'd most like to work in — or already have experience in."
                  : "Pick the one closest to your current role."}
              </p>
              <div className="grid grid-cols-2 gap-2 flex-1">
                {INDUSTRIES.map(({ title, subtitle, icon: Icon }) => (
                  <button
                    key={title}
                    onClick={() => {
                      setIndustry(title);
                      setQ2Selection(null);
                      setQ1Selections([]);
                    }}
                    className={`px-3 py-3 rounded-xl text-left transition-all border flex items-start gap-2.5 ${
                      industry === title
                        ? "bg-primary/10 border-primary"
                        : "bg-muted/50 border-border hover:border-primary/40"
                    }`}
                  >
                    <Icon className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                    <div className="min-w-0">
                      <span className={`text-sm font-medium block ${industry === title ? "text-primary" : "text-foreground"}`}>
                        {title}
                      </span>
                      <span className="text-xs text-muted-foreground block mt-0.5">{subtitle}</span>
                    </div>
                  </button>
                ))}
              </div>
              <button
                onClick={() => setStep(2)}
                disabled={!industry}
                className="mt-6 w-full h-12 rounded-xl bg-primary text-primary-foreground font-bold hover:brightness-110 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Next →
              </button>
            </div>
          )}

          {/* Step 2 — Activities (Q1) */}
          {step === 2 && (
            <div className="animate-fade-in flex flex-col flex-1">
              <h3 className="text-xl font-bold text-foreground">
                {isStudent ? "What do you actually spend your time doing?" : "What do you actually do at work?"}
              </h3>
              <p className="text-sm text-muted-foreground mt-1 mb-6">
                {isStudent
                  ? "Think about university, jobs, projects, clubs — anything counts. Pick everything that applies."
                  : "Think about your typical day. Pick everything that applies."}
              </p>
              <div className="grid grid-cols-2 gap-2 flex-1">
                {(isStudent ? ACTIVITIES : (industry && Q1_TILES_BY_INDUSTRY[industry] ? Q1_TILES_BY_INDUSTRY[industry] : ACTIVITIES)).map((a) => (
                  <button
                    key={a}
                    onClick={() => toggleActivity(a)}
                    className={`px-3 py-2.5 rounded-xl text-sm font-medium text-left transition-all border ${
                      q1Selections.includes(a)
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-muted/50 text-foreground border-border hover:border-primary/40"
                    }`}
                  >
                    <span>{a}</span>
                    {isStudent && STUDENT_SUBTEXTS[a] && (
                      <span className="block text-xs text-muted-foreground italic mt-0.5 font-normal">
                        {q1Selections.includes(a) ? "" : STUDENT_SUBTEXTS[a]}
                      </span>
                    )}
                  </button>
                ))}
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setStep(1)}
                  className="h-12 px-6 rounded-xl border border-border text-foreground font-medium hover:bg-muted transition-all"
                >
                  Back
                </button>
                <button
                  onClick={() => setStep(3)}
                  disabled={q1Selections.length === 0}
                  className="flex-1 h-12 rounded-xl bg-primary text-primary-foreground font-bold hover:brightness-110 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Next →
                </button>
              </div>
            </div>
          )}

          {/* Step 3 — Good day / Q2 (single-select, industry-specific tiles) */}
          {step === 3 && (
            <div className="animate-fade-in flex flex-col flex-1">
              <h3 className="text-xl font-bold text-foreground">{q2Heading}</h3>
              <p className="text-sm text-muted-foreground mt-1 mb-6">{q2Subtitle}</p>
              <div className="space-y-2 flex-1">
                {activeQ2Tiles.map((tile) => (
                  <button
                    key={tile}
                    onClick={() => setQ2Selection(tile)}
                    className={`w-full px-4 py-3 rounded-xl text-sm font-medium text-left transition-all border ${
                      q2Selection === tile
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-muted/50 text-foreground border-border hover:border-primary/40"
                    }`}
                  >
                    {tile}
                  </button>
                ))}
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setStep(2)}
                  className="h-12 px-6 rounded-xl border border-border text-foreground font-medium hover:bg-muted transition-all"
                >
                  Back
                </button>
                <button
                  onClick={() => setStep(4)}
                  disabled={!q2Selection}
                  className="flex-1 h-12 rounded-xl bg-primary text-primary-foreground font-bold hover:brightness-110 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Next →
                </button>
              </div>
            </div>
          )}

          {/* Step 4 — Proud moment / Q3 (skippable) */}
          {step === 4 && (
            <div className="animate-fade-in flex flex-col flex-1">
              <h3 className="text-xl font-bold text-foreground">{q3Heading}</h3>
              <p className="text-sm text-muted-foreground mt-1 mb-6">{q3Subtitle}</p>
              <textarea
                value={q3Answer}
                onChange={(e) => setQ3Answer(e.target.value)}
                rows={3}
                placeholder={q3Placeholder}
                className="w-full px-4 py-3 rounded-xl bg-background border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-sm resize-none"
              />
              <div className="flex-1" />
              <div className="flex flex-col mt-6">
                <div className="flex gap-3">
                  <button
                    onClick={() => setStep(3)}
                    className="h-12 px-6 rounded-xl border border-border text-foreground font-medium hover:bg-muted transition-all"
                  >
                    Back
                  </button>
                  <button
                    onClick={() => handleSubmit(false)}
                    disabled={q3Answer.length < 15}
                    className="flex-1 h-12 rounded-xl bg-primary text-primary-foreground font-bold hover:brightness-110 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    Discover my skills →
                  </button>
                </div>
                <p className="text-xs text-muted-foreground italic text-center mt-4">
                  People who complete this step get significantly more accurate matches.
                </p>
                <button
                  onClick={() => handleSubmit(true)}
                  className="text-[13px] text-muted-foreground hover:text-foreground transition-colors text-center mt-1.5 underline underline-offset-2"
                >
                  Skip and use my answers so far →
                </button>
              </div>
            </div>
          )}

          {/* Loading / Results */}
          {step === 5 && (
            <div className="flex flex-col items-center justify-center flex-1">
              {loading ? (
                <div className="animate-fade-in flex flex-col items-center py-8">
                  <Loader2 className="h-10 w-10 text-primary animate-spin mb-4" />
                  <p className="text-foreground font-medium">Analysing your answers…</p>
                </div>
              ) : userSkills ? (
                <div className="w-full transition-opacity duration-200">
                  <QuizResults
                    userSkills={userSkills}
                    topMatches={topMatches}
                    onSeeAll={handleSeeAll}
                    onStartOver={handleStartOver}
                    isStudent={isStudent}
                  />
                </div>
              ) : null}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
