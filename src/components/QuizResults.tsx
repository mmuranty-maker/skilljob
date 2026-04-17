import type { ScoredPosting, UserSkill } from "@/lib/quizScoring";
import { DollarSign } from "lucide-react";

interface QuizResultsProps {
  userSkills: UserSkill[];
  topMatches: ScoredPosting[];
  onSeeAll: () => void;
  onStartOver: () => void;
  q4Failed?: boolean;
  isStudent?: boolean;
}

function formatSalary(amount: number) {
  return `$${Math.round(amount / 1000)}k`;
}

function ScoreBadge({ score }: { score: number }) {
  let classes = "text-xs font-semibold px-2.5 py-1 rounded-full ";
  if (score >= 65) classes += "bg-primary/15 text-primary";
  else if (score >= 40) classes += "bg-amber-100 text-amber-700";
  else classes += "bg-muted text-muted-foreground";
  return <span className={classes}>{score}% match</span>;
}

export function QuizResults({
  userSkills,
  topMatches,
  onSeeAll,
  onStartOver,
  q4Failed,
  isStudent = false,
}: QuizResultsProps) {
  const top3 = topMatches.slice(0, 3);
  const lowMatches = topMatches.filter((m) => m.matchScore > 20).length < 3;

  return (
    <div className="animate-fade-in flex flex-col gap-6 max-h-[70vh] overflow-y-auto pr-1">
      {/* Section 1: Skill profile */}
      <div>
        <h3 className="text-xl font-bold text-foreground mb-3">Here are your skills</h3>
        <div className="flex flex-wrap gap-2">
          {userSkills.map((skill, i) => (
            <span
              key={skill.name}
              className="px-3.5 py-1.5 rounded-full bg-primary/10 text-primary font-medium text-sm animate-fade-up"
              style={{ animationDelay: `${i * 60}ms` }}
            >
              {skill.boosted ? "★ " : ""}
              {skill.name}
            </span>
          ))}
        </div>
        {q4Failed && (
          <p className="mt-2 text-xs text-muted-foreground">
            Results based on your selections. Add more detail next time for even better matches.
          </p>
        )}
      </div>

      {/* Section 2: Top matches */}
      <div>
        <h3 className="text-lg font-bold text-foreground mb-3">
          {isStudent ? "Entry-level roles you're already qualified for" : "Roles that match your skills"}
        </h3>
        <div className="space-y-3">
          {top3.map((posting) => (
            <div
              key={posting.id}
              className="border border-border rounded-xl p-4 bg-card hover:border-primary/30 transition-all"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-[15px] text-foreground">{posting.title}</h4>
                  <p className="text-[13px] text-muted-foreground mt-0.5">
                    {posting.company} · {posting.location}
                  </p>
                  <div className="flex items-center gap-1.5 mt-1 text-[13px] text-muted-foreground">
                    <DollarSign className="h-3.5 w-3.5" />
                    {formatSalary(posting.salaryMin)}–{formatSalary(posting.salaryMax)} / year
                  </div>
                </div>
                <ScoreBadge score={posting.matchScore} />
              </div>

              {/* Matched skills */}
              <div className="mt-3 flex flex-wrap items-center gap-1.5">
                {posting.matchedSkills.slice(0, 3).map((skill) => (
                  <span
                    key={skill}
                    className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20"
                  >
                    {skill}
                  </span>
                ))}
                {posting.matchedSkills.length > 3 && (
                  <span className="text-xs text-muted-foreground">
                    +{posting.matchedSkills.length - 3} more
                  </span>
                )}
              </div>

              {/* Gap line */}
              <div className="mt-2">
                {posting.gapSkills.length === 0 ? (
                  <p className="text-xs text-primary font-medium">
                    {isStudent ? "✓ Strong match for this role" : "✓ Full skill match"}
                  </p>
                ) : (
                  <p className="text-xs text-muted-foreground">
                    {posting.gapSkills.length} skill{posting.gapSkills.length !== 1 ? "s" : ""}{" "}
                    {isStudent ? "to develop for this role" : "away from full match"}:{" "}
                    {posting.gapSkills.slice(0, 3).join(", ")}
                    {posting.gapSkills.length > 3 ? "…" : ""}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>

        {lowMatches && (
          <p className="mt-3 text-xs text-muted-foreground">
            We're adding more roles soon — these are your closest matches today.
          </p>
        )}
      </div>

      {/* Section 3: CTAs */}
      <div className="pt-2">
        <button
          onClick={onSeeAll}
          className="w-full h-12 rounded-xl bg-primary text-primary-foreground font-bold hover:brightness-110 transition-all"
        >
          {isStudent ? "See roles you can apply for now →" : "See all matching roles →"}
        </button>
        <button
          onClick={onStartOver}
          className="w-full mt-2 text-sm text-primary hover:text-primary/80 transition-colors py-2"
        >
          Start over
        </button>
      </div>
    </div>
  );
}
