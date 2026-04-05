import { useState } from "react";
import { X, Loader2, Briefcase, GraduationCap, UtensilsCrossed, ShoppingBag, Heart, Cpu, Building2, Megaphone, Palette, Landmark, BookOpen, Wrench } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { QuizResults } from "./QuizResults";
import { runQuizScoring, type UserSkill, type ScoredPosting } from "@/lib/quizScoring";

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

const STUDENT_SUBTEXTS: Record<string, string> = {
  "Leading or coaching others": "e.g. society president, group project lead",
  "Selling or persuading": "e.g. pitching ideas, sponsorship, fundraising",
  "Caring for or supporting people": "e.g. volunteering, peer support, tutoring",
  "Building or fixing things": "e.g. hackathons, lab work, DIY projects",
};

const Q2_TILES = [
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
  onQuizResults?: (userSkills: UserSkill[], topMatches: ScoredPosting[]) => void;
}

export function SkillQuiz({ open, onClose, onComplete, onQuizResults }: SkillQuizProps) {
  const [step, setStep] = useState(0); // 0 = path selector
  const [isStudent, setIsStudent] = useState(false);
  const [industry, setIndustry] = useState<string | null>(null);
  const [q1Selections, setQ1Selections] = useState<string[]>([]);
  const [q2Selection, setQ2Selection] = useState<string | null>(null);
  const [q3Answer, setQ3Answer] = useState("");
  const [loading, setLoading] = useState(false);
  const [userSkills, setUserSkills] = useState<UserSkill[] | null>(null);
  const [topMatches, setTopMatches] = useState<ScoredPosting[]>([]);

  if (!open) return null;

  const toggleActivity = (a: string) => {
    setQ1Selections((prev) =>
      prev.includes(a) ? prev.filter((x) => x !== a) : [...prev, a]
    );
  };

  const selectPath = (student: boolean) => {
    setIsStudent(student);
    setStep(1);
  };

  const handleSubmit = () => {
    setLoading(true);
    setStep(5);

    const start = Date.now();

    setTimeout(() => {
      const result = runQuizScoring(q1Selections, q2Selection || "", q3Answer, isStudent);
      const elapsed = Date.now() - start;
      const remaining = Math.max(0, 1500 - elapsed);

      setTimeout(() => {
        setUserSkills(result.userSkills);
        setTopMatches(result.topMatches);
        setLoading(false);
      }, remaining);
    }, 100);
  };

  const handleSeeAll = () => {
    if (onQuizResults && userSkills && topMatches.length > 0) {
      onQuizResults(userSkills, topMatches);
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

  // Steps 1-4 are the quiz steps, 0 is path selector, 5 is results
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
                    onClick={() => setIndustry(title)}
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

          {/* Step 2 — Activities */}
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
                {ACTIVITIES.map((a) => (
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

          {/* Step 3 — Good day (single-select) */}
          {step === 3 && (
            <div className="animate-fade-in flex flex-col flex-1">
              <h3 className="text-xl font-bold text-foreground">
                {isStudent ? "What does a great day look like for you?" : "What does a good day at work look like for you?"}
              </h3>
              <p className="text-sm text-muted-foreground mt-1 mb-6">
                {isStudent
                  ? "At uni, at work, or anywhere — pick the one that sounds most like you."
                  : "Pick the one that sounds most like you."}
              </p>
              <div className="space-y-2 flex-1">
                {Q2_TILES.map((tile) => (
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

          {/* Step 4 — Proud moment */}
          {step === 4 && (
            <div className="animate-fade-in flex flex-col flex-1">
              <h3 className="text-xl font-bold text-foreground">
                {isStudent ? "Tell us about something you've done that you're proud of" : "Tell us about something you're proud of"}
              </h3>
              <p className="text-sm text-muted-foreground mt-1 mb-6">
                {isStudent
                  ? "A project, a job, a society role, anything — big or small."
                  : "At work, big or small — what's something you did that you felt good about?"}
              </p>
              <textarea
                value={q3Answer}
                onChange={(e) => setQ3Answer(e.target.value)}
                rows={3}
                placeholder={
                  isStudent
                    ? "e.g. I led our university charity campaign and raised £3,000, I built an app for my final year project, I managed social media for our student union..."
                    : "e.g. I trained 3 new starters, I reorganised how we handle complaints, I hit my sales target during a really tough month…"
                }
                className="w-full px-4 py-3 rounded-xl bg-background border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-sm resize-none"
              />
              <div className="flex-1" />
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setStep(3)}
                  className="h-12 px-6 rounded-xl border border-border text-foreground font-medium hover:bg-muted transition-all"
                >
                  Back
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={q3Answer.length < 15}
                  className="flex-1 h-12 rounded-xl bg-primary text-primary-foreground font-bold hover:brightness-110 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Discover my skills →
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
