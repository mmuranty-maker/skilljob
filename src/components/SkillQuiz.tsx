import { useState } from "react";
import { X, Loader2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { allSkills } from "@/data/jobs";

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

const EXAMPLE_CHIPS = [
  "Solving conflicts",
  "Explaining things clearly",
  "Keeping things on track",
  "Coming up with ideas",
];

// Map quiz answers to relevant skills from our dataset
function deriveSkills(activities: string[], freeText: string, proudOf: string): string[] {
  const combined = `${activities.join(" ")} ${freeText} ${proudOf}`.toLowerCase();

  const activitySkillMap: Record<string, string[]> = {
    "talking to people": ["Communication", "Active listening", "Customer Service", "Verbal Communication"],
    "managing tasks & schedules": ["Planning", "Time Management", "Task Delegation", "Organisation"],
    "solving problems": ["Problem Solving", "Critical thinking", "Debugging", "Troubleshooting"],
    "working with data or numbers": ["Data analysis", "Excel", "Reporting", "Statistical analysis"],
    "creating content or designs": ["Content Creation", "Graphic Design", "Copywriting", "Figma"],
    "leading or coaching others": ["Team Leadership", "Coaching", "Mentoring", "People Management"],
    "selling or persuading": ["Negotiation", "Sales Support", "Persuasion", "Closing"],
    "building or fixing things": ["Troubleshooting", "Machine Maintenance", "System design", "Hands-on repair"],
    "caring for or supporting people": ["Empathy", "Patient care", "Conflict Resolution", "Customer Connection"],
    "writing or researching": ["Research", "Writing", "Documentation", "Content strategy"],
    "teaching or explaining": ["Teaching", "Presentation", "Curriculum design", "Communication"],
    "organising processes": ["Process improvement", "Workflow Speed", "Agile", "Risk management"],
  };

  const candidateSkills: string[] = [];
  for (const activity of activities) {
    const mapped = activitySkillMap[activity.toLowerCase()];
    if (mapped) candidateSkills.push(...mapped);
  }

  // Also match against existing skills in dataset
  const bonus = allSkills.filter((s) => combined.includes(s.toLowerCase()));
  candidateSkills.push(...bonus);

  // Deduplicate and return 6-8
  const unique = [...new Set(candidateSkills)];
  return unique.slice(0, 8);
}

interface SkillQuizProps {
  open: boolean;
  onClose: () => void;
  onComplete: (topSkill: string) => void;
}

export function SkillQuiz({ open, onClose, onComplete }: SkillQuizProps) {
  const [step, setStep] = useState(1);
  const [selected, setSelected] = useState<string[]>([]);
  const [freeText, setFreeText] = useState("");
  const [proudOf, setProudOf] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<string[] | null>(null);

  if (!open) return null;

  const toggleActivity = (a: string) => {
    setSelected((prev) =>
      prev.includes(a) ? prev.filter((x) => x !== a) : [...prev, a]
    );
  };

  const handleSubmit = () => {
    setLoading(true);
    setStep(4);
    setTimeout(() => {
      const skills = deriveSkills(selected, freeText, proudOf);
      setResults(skills.length > 0 ? skills : ["Communication", "Problem Solving", "Organisation", "Teamwork", "Time Management", "Adaptability"]);
      setLoading(false);
    }, 1500);
  };

  const handleFindRoles = () => {
    if (results && results.length > 0) {
      onComplete(results[0]);
    }
    resetAndClose();
  };

  const resetAndClose = () => {
    setStep(1);
    setSelected([]);
    setFreeText("");
    setProudOf("");
    setLoading(false);
    setResults(null);
    onClose();
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
          {/* Step 1 */}
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
                      selected.includes(a)
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
                disabled={selected.length === 0}
                className="mt-6 w-full h-12 rounded-xl bg-primary text-primary-foreground font-bold hover:brightness-110 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Next →
              </button>
            </div>
          )}

          {/* Step 2 */}
          {step === 2 && (
            <div className="animate-fade-in flex flex-col flex-1">
              <h3 className="text-xl font-bold text-foreground">
                What do people come to you for?
              </h3>
              <p className="text-sm text-muted-foreground mt-1 mb-6">
                What do colleagues, customers, or friends ask you for help with?
              </p>
              <input
                type="text"
                value={freeText}
                onChange={(e) => setFreeText(e.target.value)}
                placeholder="e.g. calming upset customers, keeping the team organised, fixing technical issues…"
                className="w-full h-12 px-4 rounded-xl bg-background border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-sm"
              />
              <div className="mt-4 flex flex-wrap gap-2">
                {EXAMPLE_CHIPS.map((c) => (
                  <span
                    key={c}
                    className="px-3 py-1.5 rounded-full bg-muted text-muted-foreground text-xs font-medium"
                  >
                    {c}
                  </span>
                ))}
              </div>
              <div className="flex-1" />
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setStep(1)}
                  className="h-12 px-6 rounded-xl border border-border text-foreground font-medium hover:bg-muted transition-all"
                >
                  Back
                </button>
                <button
                  onClick={() => setStep(3)}
                  disabled={freeText.trim().length < 10}
                  className="flex-1 h-12 rounded-xl bg-primary text-primary-foreground font-bold hover:brightness-110 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Next →
                </button>
              </div>
            </div>
          )}

          {/* Step 3 */}
          {step === 3 && (
            <div className="animate-fade-in flex flex-col flex-1">
              <h3 className="text-xl font-bold text-foreground">
                Tell us about something you're proud of
              </h3>
              <p className="text-sm text-muted-foreground mt-1 mb-6">
                At work, big or small — what's something you did that you felt good about?
              </p>
              <textarea
                value={proudOf}
                onChange={(e) => setProudOf(e.target.value)}
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
            <div className="animate-fade-in flex flex-col items-center justify-center flex-1 py-8">
              {loading ? (
                <>
                  <Loader2 className="h-10 w-10 text-primary animate-spin mb-4" />
                  <p className="text-foreground font-medium">Analysing your answers…</p>
                </>
              ) : results ? (
                <>
                  <h3 className="text-xl font-bold text-foreground mb-2">
                    Here are your skills
                  </h3>
                  <p className="text-sm text-muted-foreground mb-6">
                    Based on your answers, these are the skills you bring to the table.
                  </p>
                  <div className="flex flex-wrap gap-2 justify-center mb-8">
                    {results.map((skill, i) => (
                      <span
                        key={skill}
                        className="px-4 py-2 rounded-full bg-primary/10 text-primary font-medium text-sm animate-fade-up"
                        style={{ animationDelay: `${i * 80}ms` }}
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                  <button
                    onClick={handleFindRoles}
                    className="w-full h-12 rounded-xl bg-primary text-primary-foreground font-bold hover:brightness-110 transition-all"
                  >
                    Find roles that match these skills →
                  </button>
                </>
              ) : null}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
