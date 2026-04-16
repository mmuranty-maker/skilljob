import { Sparkles, MapPin, Briefcase, Clock, CheckCircle2, Heart, Plus, Lock } from "lucide-react";
import type { Job } from "@/data/jobs";
import type { ScoredPosting, UserSkill } from "@/lib/quizScoring";
import { jobExtraData } from "@/data/jobExtraData";
import { Progress } from "@/components/ui/progress";

function formatSalary(amount: number) {
  return `£${Math.round(amount / 1000)}k`;
}

interface JobDetailPanelProps {
  job: Job | null;
  scored: ScoredPosting | null;
  query: string;
  userSkills?: UserSkill[];
  allJobs?: Job[];
  allScored?: ScoredPosting[];
  onSelectJob?: (id: string) => void;
  onApply?: () => void;
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <>
      <hr className="my-6 border-[#F0F0EC]" />
      <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
        {children}
      </h3>
    </>
  );
}

function BulletItem({ icon, children, highlight }: { icon: "check" | "heart" | "none"; children: React.ReactNode; highlight?: "match" | "gap" | null }) {
  const bgClass = highlight === "match" ? "bg-[#F0FAF5]" : highlight === "gap" ? "bg-[#FEF3F0]" : "";
  return (
    <li className={`flex items-start gap-2.5 py-1.5 px-2 rounded-md ${bgClass}`}>
      {icon === "check" && (
        <span className="mt-0.5 h-4 w-4 rounded-full bg-primary/15 flex items-center justify-center shrink-0">
          <CheckCircle2 className="h-3 w-3 text-primary" />
        </span>
      )}
      {icon === "heart" && (
        <span className="mt-0.5 h-4 w-4 rounded-full bg-primary/15 flex items-center justify-center shrink-0">
          <Heart className="h-3 w-3 text-primary" />
        </span>
      )}
      <span className="text-sm text-foreground/80 leading-relaxed">{children}</span>
    </li>
  );
}

export function JobDetailPanel({ job, scored, query, userSkills, allJobs, allScored, onSelectJob, onApply }: JobDetailPanelProps) {
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
  const extra = jobExtraData[job.id];

  const matchedSkills = scored
    ? scored.matchedSkills
    : job.skills.filter((s) => querySkills.some((q) => s.toLowerCase().includes(q)));

  const gapSkills = scored
    ? scored.gapSkills
    : job.skills.filter((s) => !querySkills.some((q) => s.toLowerCase().includes(q)));

  const matchedCount = matchedSkills.length;
  const matchPercent = scored
    ? scored.matchScore
    : Math.round((matchedCount / job.skills.length) * 100);

  // All user skill names lowercased for requirement highlighting
  const userSkillNames = userSkills
    ? userSkills.map((s) => s.name.toLowerCase())
    : querySkills;

  const isRequirementMatch = (req: string) => {
    const reqLower = req.toLowerCase();
    return userSkillNames.some((s) => reqLower.includes(s));
  };

  const isRequirementGap = (req: string) => {
    const reqLower = req.toLowerCase();
    return gapSkills.some((s) => reqLower.includes(s.toLowerCase()));
  };

  // Similar roles
  const similarJobs = (allJobs ?? [])
    .filter((j) => j.id !== job.id)
    .map((j) => {
      const s = allScored?.find((m) => m.id === j.id);
      return { job: j, score: s?.matchScore ?? 0 };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 2);

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
              <h2 className="text-2xl font-semibold text-foreground">{job.title}</h2>
              <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                <span>{job.company}</span>
                <span>·</span>
                <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{job.location}</span>
                <span>·</span>
                <span className="flex items-center gap-1"><Briefcase className="h-3.5 w-3.5" />{job.type}</span>
              </div>
              <p className="text-sm text-muted-foreground mt-0.5 flex items-center gap-1">
                {formatSalary(job.salaryMin)} – {formatSalary(job.salaryMax)} / year
                <span className="ml-2">·</span>
                <Clock className="h-3.5 w-3.5 ml-2" />
                {job.posted}
              </p>
            </div>
          </div>
          <button onClick={onApply} className="h-10 px-6 rounded-lg bg-primary text-primary-foreground font-semibold text-sm hover:brightness-110 transition-all shrink-0">
            Apply Now
          </button>
        </div>

        {/* Match Score Hero Block */}
        <div className="mt-6 rounded-[10px] border border-primary/30 bg-[#E8F7F2] p-5">
          <div className="flex items-center justify-between gap-6">
            {/* Big score */}
            <div>
              <p className="text-[48px] font-bold leading-none text-primary">{matchPercent}%</p>
              <p className="text-xs text-muted-foreground mt-1">Skill match</p>
            </div>
            {/* Stats */}
            <div className="flex gap-8">
              <div className="text-center">
                <p className="text-xl font-bold text-primary">{matchedCount}</p>
                <p className="text-[11px] text-muted-foreground">Your matches</p>
              </div>
              <div className="text-center">
                <p className="text-xl font-bold text-primary">{job.skills.length}</p>
                <p className="text-[11px] text-muted-foreground">Skills required</p>
              </div>
            </div>
          </div>

          {/* Progress bar */}
          <div className="mt-4">
            <Progress value={matchPercent} className="h-1.5 bg-primary/15" />
          </div>

          {/* Skill pills */}
          <div className="mt-4 space-y-3">
            {matchedSkills.length > 0 && (
              <div>
                <p className="text-[11px] text-muted-foreground mb-1.5">You have these</p>
                <div className="flex flex-wrap gap-1.5">
                  {matchedSkills.map((skill) => (
                    <span key={skill} className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-primary/20 text-primary font-medium">
                      <Sparkles className="h-2.5 w-2.5" />{skill}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {gapSkills.length > 0 && (
              <div>
                <p className="text-[11px] text-muted-foreground mb-1.5">You're missing these</p>
                <div className="flex flex-wrap gap-1.5">
                  {gapSkills.map((skill) => (
                    <span key={skill} className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full border border-[hsl(15,65%,52%)]/30 text-[hsl(15,65%,42%)] bg-[hsl(15,65%,52%)]/5 font-medium">
                      <Plus className="h-2.5 w-2.5" />{skill}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* About this role */}
        <SectionHeading>About this role</SectionHeading>
        <p className="text-sm text-foreground/80 leading-[1.7]">{job.description}</p>

        {/* Responsibilities */}
        {extra?.responsibilities && extra.responsibilities.length > 0 && (
          <>
            <SectionHeading>Day-to-day responsibilities</SectionHeading>
            <ul className="space-y-0.5">
              {extra.responsibilities.map((r, i) => (
                <BulletItem key={i} icon="check">{r}</BulletItem>
              ))}
            </ul>
          </>
        )}

        {/* Requirements */}
        {extra?.requirements && extra.requirements.length > 0 && (
          <>
            <SectionHeading>Requirements</SectionHeading>
            <ul className="space-y-0.5">
              {extra.requirements.map((r, i) => {
                const highlight = isRequirementMatch(r) ? "match" as const : isRequirementGap(r) ? "gap" as const : null;
                return <BulletItem key={i} icon="check" highlight={highlight}>{r}</BulletItem>;
              })}
            </ul>
          </>
        )}

        {/* What's on offer */}
        {extra?.offers && extra.offers.length > 0 && (
          <>
            <SectionHeading>What's on offer</SectionHeading>
            <ul className="space-y-0.5">
              {extra.offers.map((o, i) => (
                <BulletItem key={i} icon="heart">{o}</BulletItem>
              ))}
            </ul>
          </>
        )}

        {/* Benefits */}
        {extra?.benefits && extra.benefits.length > 0 && (
          <>
            <SectionHeading>Benefits</SectionHeading>
            <div className="grid grid-cols-2 gap-2">
              {extra.benefits.map((b, i) => (
                <div key={i} className="flex items-center gap-2 text-sm text-foreground/70 px-3 py-2 rounded-lg border border-[#F0F0EC]">
                  <CheckCircle2 className="h-3.5 w-3.5 text-primary shrink-0" />
                  {b}
                </div>
              ))}
            </div>
          </>
        )}

        {/* Similar roles */}
        {similarJobs.length > 0 && (
          <>
            <SectionHeading>You might also qualify for</SectionHeading>
            <div className="grid grid-cols-2 gap-3">
              {similarJobs.map(({ job: sj, score }) => (
                <button
                  key={sj.id}
                  onClick={() => onSelectJob?.(sj.id)}
                  className="text-left p-3 rounded-lg border border-[#E8E8E4] hover:border-primary/40 transition-colors"
                >
                  <p className="text-sm font-semibold text-foreground truncate">{sj.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{sj.company}</p>
                  {score > 0 && (
                    <span className="inline-block mt-2 text-xs font-medium px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                      {score}% match
                    </span>
                  )}
                </button>
              ))}
            </div>
          </>
        )}

        {/* Bottom apply */}
        <button onClick={onApply} className="mt-8 w-full h-12 rounded-lg bg-primary text-primary-foreground font-bold text-sm hover:brightness-110 transition-all">
          Apply Now
        </button>
      </div>
    </div>
  );
}
