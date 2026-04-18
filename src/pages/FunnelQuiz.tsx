import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  ArrowLeft,
  X,
  Loader2,
  Briefcase,
  GraduationCap,
  Sparkles,
  Plus,
  MessageSquare,
  CalendarCheck,
  Lightbulb,
  BarChart3,
  PenTool,
  Users,
  Target,
  Hammer,
  HandHeart,
  FileEdit,
  GraduationCap as TeachIcon,
  ListChecks,
} from "lucide-react";
import confetti from "canvas-confetti";
import { SegmentedProgress } from "@/components/funnel/SegmentedProgress";
import { runQuizScoring, type UserSkill, type ScoredPosting } from "@/lib/quizScoring";
import { getIndustryConfig, getIndustryQ2Tiles } from "@/lib/industryMapping";
import { extractSkillsWithFallback } from "@/lib/extractSkillsApi";
import { INDUSTRIES } from "@/data/industries";

const TOTAL_STEPS = 6;
const FIRST_NAME_KEY = "skilljob.firstName";

// Pick affirmation copy after the industry step (Step 1)
function getIndustryAffirmation(industry: string | null): string {
  if (!industry) return "That's a great starting point.";
  const i = industry.toLowerCase();
  if (i.includes("hospitality")) return "Hospitality — one of the most transferable skill bases in the UK. Nice starting point.";
  if (i.includes("retail")) return "Retail — you've probably got more skills than the CV template ever asked you about.";
  if (i.includes("health") || i.includes("care") || i.includes("social")) return "Care work — some of the toughest and most-valued skills going. Keep going.";
  if (i.includes("business") || i.includes("operations") || i.includes("admin") || i.includes("finance")) return "Admin — quiet backbone of British workplaces. We see you.";
  if (i.includes("trade") || i.includes("construction") || i.includes("warehouse") || i.includes("logistic")) return "You've built skills most people never see. Let's name them.";
  if (i.includes("creative") || i.includes("media")) return "Creative work — notoriously under-described on CVs. We'll fix that.";
  return "That's a great starting point.";
}

// Generic activities (used for students or as fallback)
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

// Pick a semantically relevant icon for an activity tile based on keywords
function getActivityIcon(text: string) {
  const t = text.toLowerCase();
  if (/(writ|copy|document|report|note|polic)/.test(t)) return FileEdit;
  if (/(design|creat|visual|brand|illustrat|photo|film|edit video|content)/.test(t)) return PenTool;
  if (/(teach|train|coach|mentor|explain|lesson|curricul)/.test(t)) return TeachIcon;
  if (/(lead|manag.*team|supervis|shift|run.*team)/.test(t)) return Users;
  if (/(sell|upsell|pitch|deal|target|prospect|negotiat|close)/.test(t)) return Target;
  if (/(build|fix|install|fit|repair|tool|machin|equipment|maintain)/.test(t)) return Hammer;
  if (/(care|support|help|safeguard|patient|emotion|family|complain)/.test(t)) return HandHeart;
  if (/(data|number|analy|report|figure|forecast|model|audit|payroll|account|financ)/.test(t)) return BarChart3;
  if (/(solv|problem|debug|trouble|fault)/.test(t)) return Lightbulb;
  if (/(schedul|plan|deadline|coordin|organis|process|stock|invent|admin|brief)/.test(t)) return ListChecks;
  if (/(talk|serv|guest|customer|client|enquir|relationship|loyalty)/.test(t)) return MessageSquare;
  if (/(meeting|stakeholder|onboard|recruit)/.test(t)) return CalendarCheck;
  return Sparkles;
}

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

const GENERIC_Q2_TILES = [
  "I solved something that had everyone else stuck",
  "I helped someone through a difficult situation",
  "I organised chaos and made things run smoothly",
  "I created something I'm genuinely proud of",
  "I closed a deal or convinced someone of something",
  "I learned something completely new",
  "I led people through something challenging",
];

const ANALYSING_PHASES = [
  "Reading your answers…",
  "Mapping your skills to roles…",
  "Finding your best matches…",
];

interface FunnelLocationState {
  prefillIndustry?: string;
  isStudent?: boolean;
}

const FunnelQuiz = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const prefill = (location.state as FunnelLocationState | null) || null;
  const hasPrefill = !!prefill?.prefillIndustry;

  const [step, setStep] = useState(1);
  type Phase =
    | "name"
    | "path"
    | "industry"
    | "activities"
    | "motivation"
    | "proud"
    | "analysing"
    | "celebrate";
  const [phase, setPhase] = useState<Phase>(hasPrefill ? "activities" : "name");

  // Inline celebration: shows a small pill above the next step's headline + briefly pulses the just-completed dot
  const [inlineMessage, setInlineMessage] = useState<string>("");
  const [pulseIndex, setPulseIndex] = useState<number | null>(null);
  const celebrate = (message: string, next: () => void, completedStep?: number) => {
    setInlineMessage(message);
    if (completedStep) {
      setPulseIndex(completedStep);
      setTimeout(() => setPulseIndex(null), 700);
    }
    next();
  };

  // First name (Q0)
  const [firstName, setFirstName] = useState<string>(() => {
    if (typeof window === "undefined") return "";
    try { return localStorage.getItem(FIRST_NAME_KEY) ?? ""; } catch { return ""; }
  });
  const [nameInput, setNameInput] = useState<string>(firstName);
  const persistFirstName = (value: string) => {
    setFirstName(value);
    try { localStorage.setItem(FIRST_NAME_KEY, value); } catch { /* ignore */ }
  };

  const [isStudent, setIsStudent] = useState(prefill?.isStudent ?? false);
  const [industry, setIndustry] = useState<string | null>(prefill?.prefillIndustry ?? null);
  const [q1Selections, setQ1Selections] = useState<string[]>([]);
  const [q2Selection, setQ2Selection] = useState<string | null>(null);
  const [q4Answer, setQ4Answer] = useState("");
  const [analysingIdx, setAnalysingIdx] = useState(0);

  const [userSkills, setUserSkills] = useState<UserSkill[]>([]);
  const [topMatches, setTopMatches] = useState<ScoredPosting[]>([]);
  const [skipQ4, setSkipQ4] = useState(false);
  const [newSkill, setNewSkill] = useState("");
  const confettiFiredRef = useRef(false);

  const industryConfig = getIndustryConfig(industry);
  const q2Tiles = industry ? getIndustryQ2Tiles(industry) : [];
  const activeQ2Tiles = q2Tiles.length > 0 ? q2Tiles : GENERIC_Q2_TILES;

  const q3Heading = industryConfig?.q4.heading
    ?? (isStudent ? "Tell us about something you've done that you're proud of" : "Tell us about something you're proud of");
  const q3Subtitle = industryConfig?.q4.subtitle
    ?? (isStudent ? "A project, a job, a society role, anything — big or small." : "At work, big or small — what's something you did that you felt good about?");
  const q3Placeholder = industryConfig?.q4.placeholder
    ?? "e.g. I trained 3 new starters, I reorganised how we handle complaints, I hit my sales target during a really tough month…";

  // Step ↔ phase mapping. `name` is Step 0 (warm-up).
  const phaseToStep: Record<Phase, number> = {
    name: 0,
    path: 1,
    industry: 2,
    activities: 3,
    motivation: 4,
    proud: 5,
    analysing: 5,
    celebrate: 5,
  };
  const currentStep = phaseToStep[phase];
  const isWarmup = phase === "name";

  // Analysing animation
  useEffect(() => {
    if (phase !== "analysing") return;
    setAnalysingIdx(0);
    const timers = [
      setTimeout(() => setAnalysingIdx(1), 1200),
      setTimeout(() => setAnalysingIdx(2), 2400),
    ];
    return () => timers.forEach(clearTimeout);
  }, [phase]);

  // Confetti when celebrate
  useEffect(() => {
    if (phase === "celebrate" && !confettiFiredRef.current) {
      confettiFiredRef.current = true;
      const fire = (originY: number) =>
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: originY },
          colors: ["#1D9E75", "#2DBA8C", "#A7E8CC", "#0F6E56"],
          scalar: 0.9,
        });
      fire(0.6);
      setTimeout(() => fire(0.55), 200);
    }
  }, [phase]);

  const goBack = () => {
    if (phase === "path") { setPhase("name"); return; }
    if (phase === "industry") { setPhase("path"); return; }
    if (phase === "activities") { setPhase("industry"); return; }
    if (phase === "motivation") { setPhase("activities"); return; }
    if (phase === "proud") { setPhase("motivation"); return; }
    if (phase === "celebrate") { setPhase("proud"); confettiFiredRef.current = false; return; }
    navigate("/");
  };

  // Submit Q0 → inline pill on next step
  const submitName = (name: string) => {
    const cleaned = name.trim().slice(0, 30);
    persistFirstName(cleaned);
    const msg = cleaned
      ? `Lovely to meet you, ${cleaned}.`
      : "Let's see what you've been up to.";
    celebrate(msg, () => setPhase("path"), 0);
  };

  const exitQuiz = () => navigate("/");

  const toggleActivity = (a: string) => {
    setQ1Selections((prev) => prev.includes(a) ? prev.filter((x) => x !== a) : [...prev, a]);
  };

  const startAnalysing = async (skipped: boolean) => {
    setSkipQ4(skipped);
    setPhase("analysing");
    const start = Date.now();

    let preExtractedQ4Skills: string[] | undefined;
    if (!skipped && q4Answer.length >= 15) {
      preExtractedQ4Skills = await extractSkillsWithFallback(q4Answer, industry);
    }
    const result = runQuizScoring(
      q1Selections,
      q2Selection || "",
      skipped ? "" : q4Answer,
      isStudent,
      industry,
      preExtractedQ4Skills
    );

    // Minimum 3.6s analysing animation
    const elapsed = Date.now() - start;
    await new Promise((r) => setTimeout(r, Math.max(0, 3600 - elapsed)));

    setUserSkills(result.userSkills);
    setTopMatches(result.topMatches);
    setPhase("celebrate");
  };

  const addNewSkill = () => {
    const trimmed = newSkill.trim();
    if (!trimmed) return;
    if (userSkills.some((s) => s.name.toLowerCase() === trimmed.toLowerCase())) {
      setNewSkill("");
      return;
    }
    setUserSkills((prev) => [...prev, { name: trimmed, boosted: false }]);
    setNewSkill("");
  };

  const removeSkill = (name: string) => {
    setUserSkills((prev) => prev.filter((s) => s.name.toLowerCase() !== name.toLowerCase()));
  };

  const goToResults = () => {
    navigate("/results", {
      state: {
        results: topMatches,
        skillTags: userSkills.map((s) => s.name),
        quizResults: { userSkills, topMatches },
      },
    });
  };

  // Top headline for celebration: pick top 2 boosted/strongest skills
  const specialism = (() => {
    const ranked = [...userSkills].sort((a, b) => Number(b.boosted) - Number(a.boosted));
    const a = ranked[0]?.name?.toLowerCase();
    const b = ranked[1]?.name?.toLowerCase();
    if (a && b) return `${a} and ${b}`;
    if (a) return a;
    return "your craft";
  })();

  const matchCount = topMatches.filter((m) => m.matchScore >= 65).length;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Top bar */}
      <header className="h-16 border-b border-border bg-background/95 backdrop-blur-sm sticky top-0 z-20">
        <div className="max-w-5xl mx-auto h-full px-4 sm:px-6 flex items-center justify-between gap-4">
          <button
            onClick={goBack}
            className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Back"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden sm:inline">Back</span>
          </button>
          <SegmentedProgress current={currentStep} total={TOTAL_STEPS} warmup={isWarmup} pulseIndex={pulseIndex} />
          <button
            onClick={exitQuiz}
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
            aria-label="Save and exit"
          >
            <span className="hidden sm:inline">Save & exit</span>
            <X className="h-4 w-4 sm:hidden" />
          </button>
        </div>
      </header>

      {/* Body */}
      <main className="flex-1 px-4 sm:px-6 py-10 sm:py-16 overflow-y-auto">
        <div className="max-w-3xl mx-auto w-full">
          {/* Q0 — NAME (warm-up) */}
          {phase === "name" && (
            <div className="animate-fade-in max-w-xl mx-auto pt-4">
              <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-foreground mb-3">
                What should we call you?
              </h1>
              <p className="text-base text-muted-foreground mb-8">
                We'll use this to make things feel a bit more personal. Nothing else needed right now.
              </p>
              <input
                type="text"
                inputMode="text"
                autoFocus
                maxLength={30}
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); submitName(nameInput); } }}
                placeholder="Your first name"
                aria-label="Your first name"
                className="w-full h-14 px-5 rounded-xl bg-card border-2 border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all text-lg"
              />
              <div className="flex flex-col items-stretch gap-3 mt-8">
                <button
                  onClick={() => submitName(nameInput)}
                  className="h-12 px-8 rounded-xl bg-primary text-primary-foreground font-bold hover:brightness-110 transition-all"
                >
                  Nice to meet you →
                </button>
                <button
                  onClick={() => submitName("")}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors underline underline-offset-2 self-center"
                >
                  Prefer not to say — skip
                </button>
              </div>
            </div>
          )}

          {/* PATH */}
          {phase === "path" && (
            <div className="animate-fade-in">
              <InlineAffirmation message={inlineMessage} resetKey="path" />
              <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-foreground mb-3">
                First, which best describes you?
              </h1>
              <p className="text-base text-muted-foreground mb-10">
                We'll tailor the questions so the matches feel right.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { student: false, icon: Briefcase, title: "I'm currently working", sub: "Full-time, part-time, or freelance" },
                  { student: true, icon: GraduationCap, title: "I'm a student or recent graduate", sub: "University, college, or just finished" },
                ].map(({ student, icon: Icon, title, sub }) => (
                  <button
                    key={title}
                    onClick={() => { setIsStudent(student); setPhase("industry"); }}
                    className="text-left border-2 border-border rounded-2xl p-6 bg-card hover:border-primary hover:shadow-md transition-all group"
                  >
                    <Icon className="h-8 w-8 text-primary mb-4" />
                    <h3 className="font-bold text-foreground text-lg mb-1">{title}</h3>
                    <p className="text-sm text-muted-foreground mb-4">{sub}</p>
                    <span className="text-sm font-semibold text-primary group-hover:underline">Start →</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* INDUSTRY */}
          {phase === "industry" && (
            <div className="animate-fade-in">
              <InlineAffirmation message={inlineMessage} resetKey="industry" />
              <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-foreground mb-3">
                {isStudent ? "What area interests you most?" : "What industry do you work in?"}
              </h1>
              <p className="text-base text-muted-foreground mb-8">
                Pick the one closest to your current role. You can always change it.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {INDUSTRIES.map(({ title, subtitle, icon: Icon, chipBg, chipFg }) => (
                  <button
                    key={title}
                    onClick={() => {
                      setIndustry(title);
                      setQ2Selection(null);
                      setQ1Selections([]);
                      celebrate(getIndustryAffirmation(title), () => setPhase("activities"), 1);
                    }}
                    className={`text-left p-4 rounded-xl border-2 transition-all flex items-start gap-3 ${
                      industry === title
                        ? "bg-primary/5 border-primary"
                        : "bg-card border-border hover:border-primary/40"
                    }`}
                  >
                    <div
                      className="h-14 w-14 rounded-2xl flex items-center justify-center shrink-0"
                      style={{ backgroundColor: chipBg }}
                    >
                      <Icon className="h-7 w-7" style={{ color: chipFg }} strokeWidth={1.75} />
                    </div>
                    <div className="min-w-0 pt-1">
                      <p className="font-semibold text-foreground text-sm">{title}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ACTIVITIES */}
          {phase === "activities" && (
            <div className="animate-fade-in">
              <InlineAffirmation message={inlineMessage} resetKey="activities" />
              <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-foreground mb-3">
                {firstName ? `Nice one, ${firstName} — ` : ""}
                {isStudent ? "what do you actually spend your time doing?" : "what do you actually do at work?"}
              </h1>
              <p className="text-base text-muted-foreground mb-8">
                Pick everything that applies. Most people pick 4–6.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-10">
                {(isStudent ? ACTIVITIES : (industry && Q1_TILES_BY_INDUSTRY[industry] ? Q1_TILES_BY_INDUSTRY[industry] : ACTIVITIES)).map((a) => {
                  const selected = q1Selections.includes(a);
                  const ActIcon = getActivityIcon(a);
                  return (
                    <button
                      key={a}
                      onClick={() => toggleActivity(a)}
                      className={`px-4 py-3.5 rounded-xl text-sm font-medium text-left transition-all border-2 flex items-center gap-3 ${
                        selected
                          ? "bg-primary text-primary-foreground border-primary"
                          : "bg-card text-foreground border-border hover:border-primary/40"
                      }`}
                    >
                      <span
                        className={`h-9 w-9 rounded-lg flex items-center justify-center shrink-0 ${
                          selected ? "bg-white/15" : "bg-primary/10"
                        }`}
                      >
                        <ActIcon
                          className={`h-4.5 w-4.5 ${selected ? "text-primary-foreground" : "text-primary"}`}
                          strokeWidth={1.75}
                        />
                      </span>
                      <span className="flex-1">{a}</span>
                    </button>
                  );
                })}
              </div>
              <div className="flex justify-end">
                <button
                  onClick={() => celebrate("Tick — that's a few real skills already.", () => setPhase("motivation"), 2)}
                  disabled={q1Selections.length === 0}
                  className="h-12 px-8 rounded-xl bg-primary text-primary-foreground font-bold hover:brightness-110 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Continue →
                </button>
              </div>
            </div>
          )}

          {/* MOTIVATION (Q2) */}
          {phase === "motivation" && (
            <div className="animate-fade-in">
              <InlineAffirmation message={inlineMessage} resetKey="motivation" />
              <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-foreground mb-3">
                Pick the one that describes how you do your best work
              </h1>
              <p className="text-base text-muted-foreground mb-8">
                Choose the one that feels most true — even if more than one applies.
              </p>
              <div className="space-y-3 mb-10">
                {activeQ2Tiles.map((tile) => (
                  <button
                    key={tile}
                    onClick={() => setQ2Selection(tile)}
                    className={`w-full px-5 py-4 rounded-xl text-left text-base font-medium transition-all border-2 ${
                      q2Selection === tile
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-card text-foreground border-border hover:border-primary/40"
                    }`}
                  >
                    {tile}
                  </button>
                ))}
              </div>
              <div className="flex justify-end">
                <button
                  onClick={() => celebrate("Interesting. Not many people can describe that the way you did.", () => setPhase("proud"), 3)}
                  disabled={!q2Selection}
                  className="h-12 px-8 rounded-xl bg-primary text-primary-foreground font-bold hover:brightness-110 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Continue →
                </button>
              </div>
            </div>
          )}

          {/* PROUD MOMENT */}
          {phase === "proud" && (
            <div className="animate-fade-in">
              <InlineAffirmation message={inlineMessage} resetKey="proud" />
              <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-foreground mb-3">
                {q3Heading}
              </h1>
              <p className="text-base text-muted-foreground mb-2">{q3Subtitle}</p>
              <p className="text-sm text-primary font-medium mb-6">
                ✦ This is where great matches are made — the more specific, the better.
              </p>
              <textarea
                value={q4Answer}
                onChange={(e) => setQ4Answer(e.target.value)}
                rows={6}
                placeholder={q3Placeholder}
                className="w-full px-5 py-4 rounded-xl bg-card border-2 border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all text-base resize-none"
                autoFocus
              />
              <p className="text-xs text-muted-foreground mt-2 mb-8">
                {q4Answer.length < 15
                  ? `Write at least a sentence — ${Math.max(0, 15 - q4Answer.length)} more character${15 - q4Answer.length === 1 ? "" : "s"}.`
                  : "✓ Looking good — hit the button below."}
              </p>
              <div className="flex flex-col sm:flex-row gap-3 sm:justify-end items-stretch sm:items-center">
                <button
                  onClick={() => celebrate("Right — let's put it all together.", () => startAnalysing(true), 4)}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors underline underline-offset-2 sm:mr-auto"
                >
                  Skip and use my answers so far →
                </button>
                <button
                  onClick={() => celebrate("Right — let's put it all together.", () => startAnalysing(false), 4)}
                  disabled={q4Answer.length < 15}
                  className="h-12 px-8 rounded-xl bg-primary text-primary-foreground font-bold hover:brightness-110 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Discover my skills →
                </button>
              </div>
            </div>
          )}

          {/* ANALYSING */}
          {phase === "analysing" && (
            <div className="animate-fade-in flex flex-col items-center justify-center py-20 text-center">
              <div className="relative mb-8">
                <div className="absolute inset-0 rounded-full bg-primary/20 animate-ping" />
                <div className="relative h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center">
                  <Loader2 className="h-10 w-10 text-primary animate-spin" />
                </div>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-8">
                Analysing your skills…
              </h2>
              <ul className="space-y-3 text-left">
                {ANALYSING_PHASES.map((label, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <span
                      className={`h-5 w-5 rounded-full flex items-center justify-center transition-all ${
                        i < analysingIdx
                          ? "bg-primary text-primary-foreground"
                          : i === analysingIdx
                          ? "bg-primary/20 ring-2 ring-primary/40"
                          : "bg-muted"
                      }`}
                    >
                      {i < analysingIdx ? <span className="text-[11px]">✓</span> : null}
                    </span>
                    <span
                      className={`text-base ${
                        i <= analysingIdx ? "text-foreground font-medium" : "text-muted-foreground"
                      }`}
                    >
                      {label}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* CELEBRATE */}
          {phase === "celebrate" && (
            <div className="animate-fade-in pt-6">
              <div className="text-center mb-10">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-4">
                  <Sparkles className="h-3.5 w-3.5" />
                  Your skill profile is ready
                </div>
                <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-foreground mb-3">
                  {firstName
                    ? `Here's what we saw in your answers, ${firstName}`
                    : "Here's what we saw in your answers"}
                </h1>
                <p className="text-lg text-muted-foreground max-w-xl mx-auto">
                  You specialise in <span className="text-foreground font-semibold">{specialism}</span>.
                  Add anything we missed — or remove what doesn't feel right.
                </p>
              </div>

              {/* Skill chips */}
              <div className="bg-card border-2 border-border rounded-2xl p-6 mb-6">
                <div className="flex flex-wrap gap-2 mb-4">
                  {userSkills.map((s, i) => (
                    <span
                      key={s.name}
                      className="inline-flex items-center gap-1.5 pl-3.5 pr-1.5 py-1.5 rounded-full bg-primary/10 text-primary font-medium text-sm animate-fade-up border border-primary/20"
                      style={{ animationDelay: `${i * 50}ms` }}
                    >
                      {s.boosted ? "★ " : ""}{s.name}
                      <button
                        onClick={() => removeSkill(s.name)}
                        className="h-5 w-5 rounded-full hover:bg-primary/20 flex items-center justify-center transition-colors"
                        aria-label={`Remove ${s.name}`}
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>

                <div className="flex items-center gap-2 pt-4 border-t border-border">
                  <Plus className="h-4 w-4 text-muted-foreground" />
                  <input
                    type="text"
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addNewSkill(); } }}
                    placeholder="Add a skill — e.g. Mentoring, Excel, Public speaking…"
                    className="flex-1 h-9 bg-transparent text-foreground placeholder:text-muted-foreground text-sm focus:outline-none"
                  />
                  {newSkill.trim() && (
                    <button
                      onClick={addNewSkill}
                      className="text-xs font-semibold text-primary hover:text-primary/80 px-2"
                    >
                      Add
                    </button>
                  )}
                </div>
              </div>

              {/* Match preview */}
              {matchCount > 0 && (
                <div className="bg-[hsl(160,60%,96%)] border border-[hsl(160,40%,80%)] rounded-xl p-5 mb-8 flex items-center justify-between gap-4">
                  <div>
                    <p className="font-bold text-foreground text-base">
                      {matchCount} role{matchCount !== 1 ? "s" : ""} match you above 65%
                    </p>
                    {topMatches[0] && (
                      <p className="text-sm text-muted-foreground mt-0.5">
                        Top match: <span className="font-medium text-foreground">{topMatches[0].title}</span> · {topMatches[0].matchScore}% match
                      </p>
                    )}
                  </div>
                  <Sparkles className="h-6 w-6 text-primary shrink-0 hidden sm:block" />
                </div>
              )}

              <div className="flex flex-col sm:flex-row-reverse gap-3">
                <button
                  onClick={goToResults}
                  disabled={userSkills.length === 0}
                  className="flex-1 h-14 rounded-xl bg-primary text-primary-foreground font-bold text-base hover:brightness-110 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  See my matching roles →
                </button>
                <button
                  onClick={() => { setPhase("path"); setIsStudent(false); setIndustry(null); setQ1Selections([]); setQ2Selection(null); setQ4Answer(""); setUserSkills([]); setTopMatches([]); confettiFiredRef.current = false; }}
                  className="h-14 px-6 rounded-xl border-2 border-border text-foreground font-semibold hover:bg-muted transition-all"
                >
                  Start over
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default FunnelQuiz;
