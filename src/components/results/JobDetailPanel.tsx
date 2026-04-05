import { Sparkles, MapPin, DollarSign, Briefcase, Clock } from "lucide-react";
import type { Job } from "@/data/jobs";
import type { ScoredPosting, UserSkill } from "@/lib/quizScoring";

function formatSalary(amount: number) {
  return `$${Math.round(amount / 1000)}k`;
}

function MatchBadge({ score }: { score: number }) {
  let classes = "text-xs font-semibold px-2.5 py-1 rounded-full whitespace-nowrap ";
  if (score >= 65) classes += "bg-primary/15 text-primary";
  else if (score >= 40) classes += "bg-amber-100 text-amber-700";
  else classes += "bg-muted text-muted-foreground";
  return <span className={classes}>{score}% match</span>;
}

interface JobDetailPanelProps {
  job: Job | null;
  scored: ScoredPosting | null;
  query: string;
  userSkills?: UserSkill[];
}

export function JobDetailPanel({ job, scored, query, userSkills }: JobDetailPanelProps) {
  if (!job) {
    return (
      <div className="flex-1 flex items-center justify-center bg-white border-l border-[#E8E8E4] shadow-[-2px_0_8px_rgba(0,0,0,0.04)] min-h-[500px]">
        <div className="text-center text-muted-foreground">
          <Briefcase className="h-12 w-12 mx-auto mb-3 opacity-30" />
          <p className="text-sm">Select a role to see details</p>
        </div>
      </div>
    );
  }

  const initial = job.company.charAt(0).toUpperCase();
  const querySkills = query.split(",").map((s) => s.trim().toLowerCase()).filter(Boolean);

  const matchedCount = scored
    ? scored.matchedSkills.length
    : job.skills.filter((s) => querySkills.some((q) => s.toLowerCase().includes(q))).length;

  const matchPercent = scored
    ? scored.matchScore
    : Math.round((matchedCount / job.skills.length) * 100);

  return (
    <div className="flex-1 bg-white border-l border-[#E8E8E4] shadow-[-2px_0_8px_rgba(0,0,0,0.04)] overflow-y-auto custom-scrollbar">
      <div className="px-9 py-10">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg shrink-0">
              {initial}
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h2 className="text-2xl font-semibold text-foreground">{job.title}</h2>
                {scored && <MatchBadge score={scored.matchScore} />}
              </div>
              <p className="text-sm text-muted-foreground mt-0.5">{job.company}</p>
            </div>
          </div>
          <button className="h-10 px-6 rounded-lg bg-primary text-primary-foreground font-semibold text-sm hover:brightness-110 transition-all shrink-0">
            Apply Now
          </button>
        </div>

        <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
          <span className="flex items-center gap-1">
            <MapPin className="h-3.5 w-3.5" />
            {job.location}
          </span>
          <span>·</span>
          <span className="flex items-center gap-1">
            <DollarSign className="h-3.5 w-3.5" />
            {formatSalary(job.salaryMin)} – {formatSalary(job.salaryMax)} / year
          </span>
          <span>·</span>
          <span className="flex items-center gap-1">
            <Briefcase className="h-3.5 w-3.5" />
            {job.type}
          </span>
          <span>·</span>
          <span className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" />
            {job.posted}
          </span>
        </div>

        <hr className="my-6 border-[#F0F0EC]" />

        {/* Skills match */}
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
            Skills that match this role
          </h3>
          <div className="flex flex-wrap gap-2">
            {job.skills.map((skill) => {
              const isMatch = scored
                ? scored.matchedSkills.some((ms) => ms.toLowerCase() === skill.toLowerCase())
                : querySkills.some((q) => skill.toLowerCase().includes(q));
              return (
                <span
                  key={skill}
                  className={`inline-flex items-center gap-1 text-sm px-3 py-1.5 rounded-full border ${
                    isMatch
                      ? "border-primary/60 bg-primary/15 text-primary font-semibold"
                      : "border-[#F0F0EC] text-muted-foreground"
                  }`}
                >
                  {isMatch && <Sparkles className="h-3 w-3" />}
                  {skill}
                </span>
              );
            })}
          </div>
          {!scored &&
            job.skills.some((s) => querySkills.some((q) => s.toLowerCase().includes(q))) && (
              <p className="mt-2.5 text-xs text-primary flex items-center gap-1">
                <Sparkles className="h-3 w-3" />
                Your skill is a direct match for this role
              </p>
            )}
        </div>

        {/* Nice to have */}
        {job.niceToHaveSkills && job.niceToHaveSkills.length > 0 && (
          <div className="mt-5">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
              Nice to have
            </h3>
            <div className="flex flex-wrap gap-2">
              {job.niceToHaveSkills.map((skill) => {
                const isMatch = userSkills
                  ? userSkills.some((us) => us.name.toLowerCase() === skill.toLowerCase())
                  : querySkills.some((q) => skill.toLowerCase().includes(q));
                return (
                  <span
                    key={skill}
                    className={`text-sm px-3 py-1.5 rounded-full border ${
                      isMatch
                        ? "border-primary/40 bg-primary/10 text-primary font-medium"
                        : "border-[#F0F0EC] text-muted-foreground"
                    }`}
                  >
                    {skill}
                  </span>
                );
              })}
            </div>
          </div>
        )}

        <hr className="my-6 border-[#F0F0EC]" />

        {/* Gap section */}
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
            Your gap
          </h3>
          {scored ? (
            scored.gapSkills.length > 0 ? (
              <>
                <div className="flex flex-wrap gap-2">
                  {scored.gapSkills.map((skill) => (
                    <span
                      key={skill}
                      className="text-sm px-3 py-1.5 rounded-full border border-[hsl(15,65%,52%)]/40 text-[hsl(15,65%,42%)] bg-[hsl(15,65%,52%)]/5"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
                <p className="mt-2.5 text-[13px] text-muted-foreground">
                  You're {scored.gapSkills.length} skill{scored.gapSkills.length !== 1 ? "s" : ""}{" "}
                  away from a full match.
                </p>
              </>
            ) : (
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium">
                <Sparkles className="h-3.5 w-3.5" />
                Full skill match
              </div>
            )
          ) : (
            <p className="text-sm text-muted-foreground">
              {job.skills.length - matchedCount > 0
                ? `${job.skills.length - matchedCount} skill${job.skills.length - matchedCount !== 1 ? "s" : ""} not matched from your search.`
                : "All searched skills match this role!"}
            </p>
          )}
        </div>

        <hr className="my-6 border-[#F0F0EC]" />

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          <div className="rounded-lg border border-[#F0F0EC] p-3 text-center">
            <p className="text-lg font-bold text-primary">{job.skills.length}</p>
            <p className="text-[11px] text-muted-foreground mt-0.5">Skills Required</p>
          </div>
          <div className="rounded-lg border border-[#F0F0EC] p-3 text-center">
            <p className="text-lg font-bold text-primary">{matchedCount}</p>
            <p className="text-[11px] text-muted-foreground mt-0.5">Your Matches</p>
          </div>
          <div className="rounded-lg border border-[#F0F0EC] p-3 text-center">
            <p className="text-lg font-bold text-primary">{matchPercent}%</p>
            <p className="text-[11px] text-muted-foreground mt-0.5">Skill Match</p>
          </div>
        </div>

        <hr className="my-6 border-[#F0F0EC]" />

        {/* Description */}
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
            About this role
          </h3>
          <p className="text-sm text-[hsl(0,0%,20%)] leading-[1.7]">{job.description}</p>
        </div>

        {/* Bottom apply */}
        <button className="mt-8 w-full h-12 rounded-lg bg-primary text-primary-foreground font-bold text-sm hover:brightness-110 transition-all">
          Apply Now
        </button>
      </div>
    </div>
  );
}
