import { useState } from "react";
import { X, Loader2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { QuizResults } from "./QuizResults";
import { runQuizScoring, type UserSkill, type ScoredPosting } from "@/lib/quizScoring";

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
  const [step, setStep] = useState(1);
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

  const handleSubmit = () => {
    setLoading(true);
    setStep(4);

    // Minimum 1.5s loading
    const start = Date.now();

    setTimeout(() => {
      const result = runQuizScoring(q1Selections, q2Selection || "", q3Answer);
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
    setStep(1);
    setQ1Selections([]);
    setQ2Selection(null);
    setQ3Answer("");
    setLoading(false);
    setUserSkills(null);
    setTopMatches([]);
    onClose();
  };

  const handleStartOver = () => {
    setStep(1);
    setQ1Selections([]);
    setQ2Selection(null);
    setQ3Answer("");
    setLoading(false);
    setUserSkills(null);
    setTopMatches([]);
  };

  const progress = step <= 3 ? (step / 3) * 100 : 100;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-foreground/40 backdrop-blur-sm animate-fade-in"
        onClick={resetAndClose}
      />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-[560px] bg-card rounded-2xl shadow-2xl overflow-hidden animate-scale-in">
        {/* Header */}
        <div className="p-6 pb-0">
          <div className="flex items-center justify-between mb-4">
            {step <= 3 && (
              <span className="text-sm font-medium text-muted-foreground">
                Step {step} of 3
              </span>
            )}
            {step === 4 && <span />}
            <button
              onClick={resetAndClose}
              className="h-8 w-8 rounded-full flex items-center justify-center hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          {step <= 3 && (
            <Progress value={progress} className="h-1.5 mb-6" />
          )}
        </div>

        {/* Content */}
        <div className="px-6 pb-6 min-h-[320px] flex flex-col">
          {/* Step 1 — Activities */}
          {step === 1 && (
            <div className="animate-fade-in flex flex-col flex-1">
              <h3 className="text-xl font-bold text-foreground">
                What do you actually do at work?
              </h3>
              <p className="text-sm text-muted-foreground mt-1 mb-6">
                Think about your typical day. Pick everything that applies.
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
                    {a}
                  </button>
                ))}
              </div>
              <button
                onClick={() => setStep(2)}
                disabled={q1Selections.length === 0}
                className="mt-6 w-full h-12 rounded-xl bg-primary text-primary-foreground font-bold hover:brightness-110 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Next →
              </button>
            </div>
          )}

          {/* Step 2 — Good day at work (single-select) */}
          {step === 2 && (
            <div className="animate-fade-in flex flex-col flex-1">
              <h3 className="text-xl font-bold text-foreground">
                What does a good day at work look like for you?
              </h3>
              <p className="text-sm text-muted-foreground mt-1 mb-6">
                Pick the one that sounds most like you.
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
                  onClick={() => setStep(1)}
                  className="h-12 px-6 rounded-xl border border-border text-foreground font-medium hover:bg-muted transition-all"
                >
                  Back
                </button>
                <button
                  onClick={() => setStep(3)}
                  disabled={!q2Selection}
                  className="flex-1 h-12 rounded-xl bg-primary text-primary-foreground font-bold hover:brightness-110 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Next →
                </button>
              </div>
            </div>
          )}

          {/* Step 3 — Proud moment */}
          {step === 3 && (
            <div className="animate-fade-in flex flex-col flex-1">
              <h3 className="text-xl font-bold text-foreground">
                Tell us about something you're proud of
              </h3>
              <p className="text-sm text-muted-foreground mt-1 mb-6">
                At work, big or small — what's something you did that you felt good about?
              </p>
              <textarea
                value={q3Answer}
                onChange={(e) => setQ3Answer(e.target.value)}
                rows={3}
                placeholder="e.g. I trained 3 new starters, I reorganised how we handle complaints, I hit my sales target during a really tough month…"
                className="w-full px-4 py-3 rounded-xl bg-background border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-sm resize-none"
              />
              <div className="flex-1" />
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setStep(2)}
                  className="h-12 px-6 rounded-xl border border-border text-foreground font-medium hover:bg-muted transition-all"
                >
                  Back
                </button>
                <button
                  onClick={handleSubmit}
                  className="flex-1 h-12 rounded-xl bg-primary text-primary-foreground font-bold hover:brightness-110 transition-all"
                >
                  Discover my skills →
                </button>
              </div>
            </div>
          )}

          {/* Loading / Results */}
          {step === 4 && (
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
