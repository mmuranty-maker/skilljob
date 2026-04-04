import { useState } from "react";
import { Briefcase, MapPin, DollarSign, Clock, Sparkles, Building2, Bookmark } from "lucide-react";
import type { Job } from "@/data/jobs";

interface JobResultsProps {
  results: Job[];
  query: string;
}

function formatSalary(amount: number) {
  return `$${(amount / 1000).toFixed(0)}k`;
}

export function JobResults({ results, query }: JobResultsProps) {
  const [selectedId, setSelectedId] = useState<string | null>(
    results.length > 0 ? results[0].id : null
  );

  const selectedJob = results.find((j) => j.id === selectedId) ?? results[0];

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
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            {results.length} role{results.length !== 1 ? "s" : ""} matched for "{query}"
          </h2>
          <p className="text-sm text-muted-foreground mt-1">These roles actively use your skill.</p>
        </div>

        <div className="flex gap-6 items-start">
          {/* Left: Job List */}
          <div className="w-[380px] shrink-0 space-y-2 max-h-[calc(100vh-200px)] overflow-y-auto pr-2 custom-scrollbar">
            {results.map((job) => (
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
                    <h3 className="font-bold text-base truncate">{job.title}</h3>
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
                        const isMatch = skill.toLowerCase().includes(query.toLowerCase());
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
            ))}
          </div>

          {/* Right: Detail View */}
          {selectedJob && (
            <div className="flex-1 sticky top-6 border border-border rounded-xl card-bg p-8 min-h-[500px]">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-black">{selectedJob.title}</h2>
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

              {/* Skills as social proof */}
              <div className="mt-8">
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                  Skills That Match This Role
                </h3>
                <div className="flex flex-wrap gap-2">
                  {selectedJob.skills.map((skill) => {
                    const isMatch = skill.toLowerCase().includes(query.toLowerCase());
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
                {selectedJob.skills.some((s) => s.toLowerCase().includes(query.toLowerCase())) && (
                  <p className="mt-3 text-xs text-primary/80 flex items-center gap-1.5">
                    <Sparkles className="h-3 w-3" />
                    Your skill "<span className="font-semibold">{query}</span>" is a direct match for this role
                  </p>
                )}
              </div>

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
                    {selectedJob.skills.filter((s) => s.toLowerCase().includes(query.toLowerCase())).length}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">Your Matches</p>
                </div>
                <div className="rounded-lg border border-border bg-secondary/30 p-4 text-center">
                  <p className="text-2xl font-black text-primary">
                    {Math.round(
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
