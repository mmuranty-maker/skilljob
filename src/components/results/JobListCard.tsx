import { MapPin, DollarSign, Clock, Sparkles } from "lucide-react";
import type { Job } from "@/data/jobs";
import type { ScoredPosting } from "@/lib/quizScoring";

function formatSalary(amount: number) {
  return `$${Math.round(amount / 1000)}k`;
}

function MatchBadge({ score }: { score: number }) {
  let classes = "text-xs font-semibold px-2 py-0.5 rounded-full whitespace-nowrap ";
  if (score >= 65) classes += "bg-primary/15 text-primary";
  else if (score >= 40) classes += "bg-amber-100 text-amber-700";
  else classes += "bg-muted text-muted-foreground";
  return <span className={classes}>{score}% match</span>;
}

interface JobListCardProps {
  job: Job;
  scored: ScoredPosting | null;
  query: string;
  isSelected: boolean;
  onClick: () => void;
}

export function JobListCard({ job, scored, query, isSelected, onClick }: JobListCardProps) {
  const initial = job.company.charAt(0).toUpperCase();

  return (
    <button
      onClick={onClick}
      className={`w-full text-left rounded-lg border p-3.5 mb-2 transition-colors ${
        isSelected
          ? "border-[1.5px] border-primary bg-[#FAFFFE]"
          : "border-[#E8E8E4] bg-white hover:border-[#B0D9CC] hover:bg-[#FDFFFD]"
      }`}
    >
      <div className="flex items-start gap-3">
        <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm shrink-0 mt-0.5">
          {initial}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <h3 className="font-semibold text-sm text-foreground truncate">{job.title}</h3>
            {scored && <MatchBadge score={scored.matchScore} />}
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            {job.company} · {job.location}
          </p>
          <div className="flex items-center gap-3 mt-1.5 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <DollarSign className="h-3 w-3" />
              {formatSalary(job.salaryMin)}–{formatSalary(job.salaryMax)}
            </span>
          </div>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {job.skills.slice(0, 3).map((skill) => {
              const isMatch = scored
                ? scored.matchedSkills.some((ms) => ms.toLowerCase() === skill.toLowerCase())
                : query
                    .split(",")
                    .some((q) => skill.toLowerCase().includes(q.trim().toLowerCase()));
              return (
                <span
                  key={skill}
                  className={`text-[11px] px-2 py-0.5 rounded-full border ${
                    isMatch
                      ? "border-primary/50 bg-primary/10 text-primary font-medium"
                      : "border-[hsl(220,13%,91%)] text-muted-foreground"
                  }`}
                >
                  {skill}
                </span>
              );
            })}
            {job.skills.length > 3 && (
              <span className="text-[11px] text-muted-foreground">+{job.skills.length - 3}</span>
            )}
          </div>
          <div className="mt-2 flex items-center gap-2 text-[11px] text-muted-foreground">
            <Clock className="h-3 w-3" />
            {job.posted}
            <span className="ml-auto text-[11px] px-2 py-0.5 rounded-full border border-[hsl(220,13%,91%)]">
              {job.type}
            </span>
          </div>
        </div>
      </div>
    </button>
  );
}
