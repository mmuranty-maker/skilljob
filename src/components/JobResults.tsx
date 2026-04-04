import { useState } from "react";
import { Briefcase, MapPin, DollarSign, Clock, Sparkles, Building2, Bookmark } from "lucide-react";
import type { Job } from "@/data/jobs";
import type { UserSkill, ScoredPosting } from "@/lib/quizScoring";

interface JobResultsProps {
  results: Job[];
  query: string;
  quizResults?: {
    userSkills: UserSkill[];
    topMatches: ScoredPosting[];
  };
}

function formatSalary(amount: number) {
  return `$${Math.round(amount / 1000)}k`;
}

function ScoreBadge({ score }: { score: number }) {
  let classes = "text-xs font-semibold px-2.5 py-1 rounded-full whitespace-nowrap ";
  if (score >= 65) classes += "bg-primary/15 text-primary";
  else if (score >= 40) classes += "bg-amber-100 text-amber-700";
  else classes += "bg-muted text-muted-foreground";
  return <span className={classes}>{score}% match</span>;
}

export function JobResults({ results, query, quizResults }: JobResultsProps) {
  const [selectedId, setSelectedId] = useState<string | null>(
    results.length > 0 ? results[0].id : null
  );

  const selectedJob = results.find((j) => j.id === selectedId) ?? results[0];
  const isQuizMode = !!quizResults;

  // For quiz mode, get scored version of selected job
  const selectedScored = isQuizMode
    ? quizResults.topMatches.find((m) => m.id === selectedId) ?? quizResults.topMatches[0]
    : null;

  if (results.length === 0) {
    return (
      <section className="py-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-xl text-muted-foreground">
            No matches for "<span className="text-foreground font-semibold">{query}</span>". Try a different skill!
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-10 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          {isQuizMode ? (
            <>
              <div className="flex flex-wrap gap-2 mb-3">
                {quizResults.userSkills.map((skill) => (
                  <span
                    key={skill.name}
                    className="text-xs px-2.5 py-1 rounded-full bg-primary/10 text-primary font-medium"
                  >
                    {skill.boosted ? "★ " : ""}{skill.name}
                  </span>
                ))}
              </div>
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                {results.length} role{results.length !== 1 ? "s" : ""} matched to your skill profile
              </h2>
              <p className="text-sm text-muted-foreground mt-1">Ranked by how well your skills match each role.</p>
            </>
          ) : (
            <>
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                {results.length} role{results.length !== 1 ? "s" : ""} matched for "{query}"
              </h2>
              <p className="text-sm text-muted-foreground mt-1">These roles actively use your skill.</p>
            </>
          )}
        </div>

        <div className="flex gap-6 items-start">
          {/* Left: Job List */}
          <div className="w-[380px] shrink-0 space-y-2 max-h-[calc(100vh-200px)] overflow-y-auto pr-2 custom-scrollbar">
            {results.map((job) => {
              const scored = isQuizMode
                ? quizResults.topMatches.find((m) => m.id === job.id)
                : null;

              return (
                <button
                  key={job.id}
                  onClick={() => setSelectedId(job.id)}
                  className={`w-full text-left rounded-xl border p-4 transition-all ${
                    selectedId === job.id
                      ? "border-primary bg-primary/5 shadow-md shadow-primary/10"
                      : "border-border hover:border-primary/30 card-bg"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-base truncate">{job.title}</h3>
                        {scored && <ScoreBadge score={scored.matchScore} />}
                      </div>
                      <p className="text-sm text-muted-foreground mt-0.5">{job.company}</p>
                      <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {job.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <DollarSign className="h-3 w-3" />
                          {formatSalary(job.salaryMin)}–{formatSalary(job.salaryMax)}
                        </span>
                      </div>
                      <div className="mt-2.5 flex flex-wrap gap-1.5">
                        {job.skills.slice(0, 3).map((skill) => {
                          const isMatch = scored
                            ? scored.matchedSkills.some((ms) => ms.toLowerCase() === skill.toLowerCase())
                            : skill.toLowerCase().includes(query.toLowerCase());
                          return (
                            <span
                              key={skill}
                              className={`text-xs px-2 py-0.5 rounded-full border ${
                                isMatch
                                  ? "border-primary/50 bg-primary/10 text-primary font-medium"
                                  : "border-border text-muted-foreground"
                              }`}
                            >
                              {skill}
                            </span>
                          );
                        })}
                        {job.skills.length > 3 && (
                          <span className="text-xs text-muted-foreground">+{job.skills.length - 3}</span>
                        )}
                      </div>
                    </div>
                    <Bookmark className={`h-4 w-4 shrink-0 mt-1 ${selectedId === job.id ? "text-primary" : "text-muted-foreground/40"}`} />
                  </div>
                  <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {job.posted}
                    <span className="ml-auto text-xs px-2 py-0.5 rounded-full border border-border">{job.type}</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Right: Detail View */}
          {selectedJob && (
            <div className="flex-1 sticky top-6 border border-border rounded-xl card-bg p-8 min-h-[500px]">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-3">
                    <h2 className="text-2xl font-black">{selectedJob.title}</h2>
                    {selectedScored && <ScoreBadge score={selectedScored.matchScore} />}
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <Building2 className="h-4 w-4 text-primary" />
                    <span className="text-base font-medium text-primary">{selectedJob.company}</span>
                  </div>
                </div>
                <button className="h-10 px-5 rounded-lg bg-primary text-primary-foreground font-bold text-sm hover:brightness-110 transition-all shrink-0">
                  Apply Now
                </button>
              </div>

              <div className="flex items-center gap-4 mt-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <MapPin className="h-4 w-4" />
                  {selectedJob.location}
                </span>
                <span className="flex items-center gap-1.5">
                  <DollarSign className="h-4 w-4" />
                  {formatSalary(selectedJob.salaryMin)} – {formatSalary(selectedJob.salaryMax)} / year
                </span>
                <span className="flex items-center gap-1.5">
                  <Briefcase className="h-4 w-4" />
                  {selectedJob.type}
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="h-4 w-4" />
                  {selectedJob.posted}
                </span>
              </div>

              <div className="flex items-center gap-2 mt-4">
                <span className="text-xs px-2.5 py-1 rounded-full border border-primary/30 bg-primary/5 text-primary font-medium">{selectedJob.seniority}</span>
                <span className="text-xs px-2.5 py-1 rounded-full border border-border text-muted-foreground">{selectedJob.category}</span>
              </div>

              {/* Skills section */}
              <div className="mt-8">
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                  Skills That Match This Role
                </h3>
                <div className="flex flex-wrap gap-2">
                  {selectedJob.skills.map((skill) => {
                    const isMatch = selectedScored
                      ? selectedScored.matchedSkills.some((ms) => ms.toLowerCase() === skill.toLowerCase())
                      : skill.toLowerCase().includes(query.toLowerCase());
                    return (
                      <span
                        key={skill}
                        className={`inline-flex items-center gap-1.5 text-sm px-3.5 py-1.5 rounded-full border transition-colors ${
                          isMatch
                            ? "border-primary/60 bg-primary/15 text-primary font-semibold shadow-sm shadow-primary/10"
                            : "border-border bg-secondary/50 text-muted-foreground"
                        }`}
                      >
                        {isMatch && <Sparkles className="h-3.5 w-3.5" />}
                        {skill}
                      </span>
                    );
                  })}
                </div>

                {/* Gap skills for quiz mode */}
                {selectedScored && selectedScored.gapSkills.length > 0 && (
                  <p className="mt-3 text-xs text-muted-foreground">
                    {selectedScored.gapSkills.length} skill{selectedScored.gapSkills.length !== 1 ? "s" : ""} away from full match: {selectedScored.gapSkills.join(", ")}
                  </p>
                )}
                {selectedScored && selectedScored.gapSkills.length === 0 && (
                  <p className="mt-3 text-xs text-primary font-medium flex items-center gap-1.5">
                    <Sparkles className="h-3 w-3" />
                    Full skill match for this role!
                  </p>
                )}

                {!selectedScored && selectedJob.skills.some((s) => s.toLowerCase().includes(query.toLowerCase())) && (
                  <p className="mt-3 text-xs text-primary/80 flex items-center gap-1.5">
                    <Sparkles className="h-3 w-3" />
                    Your skill "<span className="font-semibold">{query}</span>" is a direct match for this role
                  </p>
                )}
              </div>

              {/* Nice to have */}
              {selectedJob.niceToHaveSkills && selectedJob.niceToHaveSkills.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                    Nice to Have
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedJob.niceToHaveSkills.map((skill) => {
                      const isMatch = selectedScored
                        ? quizResults!.userSkills.some((us) => us.name.toLowerCase() === skill.toLowerCase())
                        : skill.toLowerCase().includes(query.toLowerCase());
                      return (
                        <span
                          key={skill}
                          className={`text-sm px-3 py-1.5 rounded-full border ${
                            isMatch
                              ? "border-primary/40 bg-primary/10 text-primary font-medium"
                              : "border-border/60 bg-muted/30 text-muted-foreground"
                          }`}
                        >
                          {skill}
                        </span>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Description */}
              <div className="mt-8">
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                  About This Role
                </h3>
                <p className="text-foreground/90 leading-relaxed">{selectedJob.description}</p>
              </div>

              {/* Quick stats */}
              <div className="mt-8 grid grid-cols-3 gap-4">
                <div className="rounded-lg border border-border bg-secondary/30 p-4 text-center">
                  <p className="text-2xl font-black text-primary">{selectedJob.skills.length}</p>
                  <p className="text-xs text-muted-foreground mt-1">Skills Required</p>
                </div>
                <div className="rounded-lg border border-border bg-secondary/30 p-4 text-center">
                  <p className="text-2xl font-black text-primary">
                    {selectedScored
                      ? selectedScored.matchedSkills.length
                      : selectedJob.skills.filter((s) => s.toLowerCase().includes(query.toLowerCase())).length}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">Your Matches</p>
                </div>
                <div className="rounded-lg border border-border bg-secondary/30 p-4 text-center">
                  <p className="text-2xl font-black text-primary">
                    {selectedScored
                      ? selectedScored.matchScore
                      : Math.round(
                          (selectedJob.skills.filter((s) => s.toLowerCase().includes(query.toLowerCase())).length /
                            selectedJob.skills.length) *
                            100
                        )}%
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">Skill Match</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
