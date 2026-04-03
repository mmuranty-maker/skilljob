import { Briefcase, Sparkles } from "lucide-react";
import type { Job } from "@/data/jobs";

interface JobResultsProps {
  results: Job[];
  query: string;
}

export function JobResults({ results, query }: JobResultsProps) {
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
    <section className="py-20 px-4">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold mb-2">
          <Sparkles className="inline h-6 w-6 text-primary mr-2" />
          {results.length} role{results.length !== 1 ? "s" : ""} matched for "{query}"
        </h2>
        <p className="text-muted-foreground mb-8">These roles actively use your skill.</p>

        <div className="space-y-4">
          {results.map((job) => (
            <div
              key={job.title}
              className="card-bg border border-border rounded-xl p-6 hover:border-primary/40 transition-all group"
            >
              <div className="flex items-start gap-4">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
                  <Briefcase className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold">{job.title}</h3>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {job.skills.map((skill) => {
                      const isMatch = skill.toLowerCase().includes(query.toLowerCase());
                      return (
                        <span
                          key={skill}
                          className={`text-sm px-3 py-1 rounded-full border transition-colors ${
                            isMatch
                              ? "border-primary/50 bg-primary/10 text-primary font-medium"
                              : "border-border text-muted-foreground"
                          }`}
                        >
                          {skill}
                        </span>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
