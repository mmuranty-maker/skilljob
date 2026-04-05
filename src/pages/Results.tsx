import { useState, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { SlidersHorizontal, ArrowLeft, X, Sparkles } from "lucide-react";
import type { Job } from "@/data/jobs";
import type { UserSkill, ScoredPosting } from "@/lib/quizScoring";
import { ResultsTopBar } from "@/components/results/ResultsTopBar";
import { FilterSidebar, type Filters, defaultFilters } from "@/components/results/FilterSidebar";
import { JobListCard } from "@/components/results/JobListCard";
import { JobDetailPanel } from "@/components/results/JobDetailPanel";
import { SkeletonCards } from "@/components/results/SkeletonCards";
import { SkillQuiz } from "@/components/SkillQuiz";
import { searchJobsBySkills, jobs } from "@/data/jobs";
import { useIsMobile } from "@/hooks/use-mobile";

interface ResultsState {
  results: Job[];
  skillTags: string[];
  quizResults?: { userSkills: UserSkill[]; topMatches: ScoredPosting[] };
}

const ResultsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const incoming = (location.state as ResultsState) || null;

  const [skillTags, setSkillTags] = useState<string[]>(incoming?.skillTags ?? []);
  const [results, setResults] = useState<Job[]>(incoming?.results ?? []);
  const [quizResults, setQuizResults] = useState(incoming?.quizResults ?? undefined);
  const [filters, setFilters] = useState<Filters>(defaultFilters);
  const [selectedId, setSelectedId] = useState<string | null>(results.length > 0 ? results[0].id : null);
  const [showMobileDetail, setShowMobileDetail] = useState(false);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [quizOpen, setQuizOpen] = useState(false);

  const isQuizMode = !!quizResults;

  const handleSearch = (tags: string[]) => {
    const matched = searchJobsBySkills(tags);
    setResults(matched);
    setFilters(defaultFilters);
    if (matched.length > 0) setSelectedId(matched[0].id);
  };

  // Parse posted days from string like "2 days ago"
  const parseDays = (posted: string): number => {
    const m = posted.match(/(\d+)/);
    return m ? parseInt(m[1], 10) : 999;
  };

  const filteredResults = useMemo(() => {
    return results.filter((job) => {
      if (filters.jobTypes.length > 0 && !filters.jobTypes.includes(job.type)) return false;
      if (filters.seniorities.length > 0 && !filters.seniorities.includes(job.seniority)) return false;
      if (filters.salaryMin && job.salaryMax < filters.salaryMin) return false;
      if (filters.salaryMax && job.salaryMin > filters.salaryMax) return false;
      if (filters.datePosted !== "any") {
        const days = parseDays(job.posted);
        const limit = parseInt(filters.datePosted, 10);
        if (days > limit) return false;
      }
      if (filters.categories.length > 0) {
        const jobCat = job.category.toLowerCase();
        const match = filters.categories.some((c) => jobCat.includes(c.toLowerCase()));
        if (!match) return false;
      }
      return true;
    });
  }, [results, filters]);

  const selectedJob = filteredResults.find((j) => j.id === selectedId) ?? filteredResults[0] ?? null;
  const selectedScored = isQuizMode && selectedJob
    ? quizResults!.topMatches.find((m) => m.id === selectedJob.id) ?? null
    : null;

  const handleCardClick = (id: string) => {
    setSelectedId(id);
    if (isMobile) setShowMobileDetail(true);
  };

  const handleQuizComplete = (userSkills: UserSkill[], topMatches: ScoredPosting[]) => {
    setQuizResults({ userSkills, topMatches });
    setResults(topMatches);
    setSkillTags(userSkills.map((s) => s.name));
    setFilters(defaultFilters);
    if (topMatches.length > 0) setSelectedId(topMatches[0].id);
    setQuizOpen(false);
  };

  const handleBrowseAll = () => {
    setResults(jobs);
    setSkillTags([]);
    setFilters(defaultFilters);
    if (jobs.length > 0) setSelectedId(jobs[0].id);
  };

  return (
    <div className="min-h-screen bg-[hsl(40,14%,96%)] flex flex-col">
      <ResultsTopBar
        skillTags={skillTags}
        setSkillTags={setSkillTags}
        resultCount={filteredResults.length}
        onSearch={handleSearch}
      />

      {/* Mobile filter button */}
      {isMobile && (
        <div className="px-4 py-2 bg-white border-b border-[hsl(220,13%,91%)]">
          <button
            onClick={() => setShowMobileFilters(true)}
            className="flex items-center gap-2 text-sm font-medium text-foreground"
          >
            <SlidersHorizontal className="h-4 w-4" />
            Filters
            {Object.values(filters).some((v) =>
              Array.isArray(v) ? v.length > 0 : v !== "any" && v !== null
            ) && (
              <span className="h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">
                !
              </span>
            )}
          </button>
        </div>
      )}

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar - desktop only */}
        {!isMobile && (
          <FilterSidebar
            filters={filters}
            onChange={setFilters}
            className="w-[220px] shrink-0 sticky top-14 h-[calc(100vh-56px)] overflow-y-auto custom-scrollbar"
          />
        )}

        {/* Job list */}
        <div
          className={`${
            isMobile ? "w-full" : "w-[340px]"
          } shrink-0 bg-[#F5F5F3] overflow-y-auto h-[calc(100vh-56px)] custom-scrollbar px-3 pt-3`}
        >
          {filteredResults.length > 0 ? (
            <>
              <div className="px-1 py-2.5">
                <p className="text-xs text-muted-foreground">
                  Sorted by best skill match · {filteredResults.length} result{filteredResults.length !== 1 ? "s" : ""}
                </p>
              </div>
              {filteredResults.map((job) => {
                const scored = isQuizMode
                  ? quizResults!.topMatches.find((m) => m.id === job.id) ?? null
                  : null;
                return (
                  <JobListCard
                    key={job.id}
                    job={job}
                    scored={scored}
                    query={skillTags.join(", ")}
                    isSelected={selectedJob?.id === job.id}
                    onClick={() => handleCardClick(job.id)}
                  />
                );
              })}
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full px-6 text-center">
              <p className="text-muted-foreground text-sm mb-3">
                No roles match these filters. Try widening your search.
              </p>
              <button
                onClick={() => setFilters(defaultFilters)}
                className="text-sm text-primary font-semibold hover:text-primary/80 transition-colors"
              >
                Clear filters
              </button>
            </div>
          )}
        </div>

        {/* Detail panel - desktop */}
        {!isMobile && (
          <JobDetailPanel
            job={selectedJob}
            scored={selectedScored}
            query={skillTags.join(", ")}
            userSkills={quizResults?.userSkills}
          />
        )}
      </div>

      {/* Mobile detail overlay */}
      {isMobile && showMobileDetail && selectedJob && (
        <div className="fixed inset-0 z-50 bg-white flex flex-col">
          <div className="h-14 flex items-center px-4 border-b border-[hsl(220,13%,91%)]">
            <button onClick={() => setShowMobileDetail(false)} className="flex items-center gap-2 text-sm font-medium text-foreground">
              <ArrowLeft className="h-4 w-4" />
              Back to results
            </button>
          </div>
          <div className="flex-1 overflow-y-auto">
            <JobDetailPanel
              job={selectedJob}
              scored={selectedScored}
              query={skillTags.join(", ")}
              userSkills={quizResults?.userSkills}
            />
          </div>
          <div className="p-4 border-t border-[hsl(220,13%,91%)]">
            <button className="w-full h-12 rounded-lg bg-primary text-primary-foreground font-bold text-sm">
              Apply Now
            </button>
          </div>
        </div>
      )}

      {/* Mobile filter drawer */}
      {isMobile && showMobileFilters && (
        <div className="fixed inset-0 z-50 flex flex-col">
          <div className="absolute inset-0 bg-black/30" onClick={() => setShowMobileFilters(false)} />
          <div className="absolute bottom-0 left-0 right-0 max-h-[80vh] bg-white rounded-t-2xl overflow-y-auto animate-fade-up">
            <div className="sticky top-0 bg-white flex items-center justify-between p-4 border-b border-[hsl(220,13%,91%)]">
              <h3 className="font-semibold text-foreground">Filters</h3>
              <button onClick={() => setShowMobileFilters(false)}>
                <X className="h-5 w-5 text-muted-foreground" />
              </button>
            </div>
            <FilterSidebar filters={filters} onChange={setFilters} className="border-r-0" />
          </div>
        </div>
      )}
    </div>
  );
};

export default ResultsPage;
