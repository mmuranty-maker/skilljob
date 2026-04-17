import { useState, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { SlidersHorizontal, ArrowLeft, X, Sparkles, ChevronDown, ChevronUp, Trophy, Compass } from "lucide-react";
import { ApplicationModal } from "@/components/results/ApplicationModal";
import type { Job } from "@/data/jobs";
import { runQuizScoring, type UserSkill, type ScoredPosting } from "@/lib/quizScoring";
import { ResultsTopBar } from "@/components/results/ResultsTopBar";
import { FilterSidebar, type Filters, defaultFilters } from "@/components/results/FilterSidebar";
import { JobListCard } from "@/components/results/JobListCard";
import { JobDetailPanel } from "@/components/results/JobDetailPanel";
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
  const openQuiz = () => navigate("/quiz");
  const [applyOpen, setApplyOpen] = useState(false);
  const [skippedQ4, setSkippedQ3] = useState(false);
  const [proudMomentOpen, setProudMomentOpen] = useState(false);
  const [proudMomentText, setProudMomentText] = useState("");
  const [showLowMatches, setShowLowMatches] = useState(false);

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
    const filtered = results.filter((job) => {
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
    // Sort by match score descending when quiz results are available
    if (quizResults) {
      const scoreMap = new Map(quizResults.topMatches.map((m) => [m.id, m.matchScore]));
      filtered.sort((a, b) => (scoreMap.get(b.id) ?? 0) - (scoreMap.get(a.id) ?? 0));
    }
    return filtered;
  }, [results, filters, quizResults]);

  const selectedJob = filteredResults.find((j) => j.id === selectedId) ?? filteredResults[0] ?? null;
  const selectedScored = isQuizMode && selectedJob
    ? quizResults!.topMatches.find((m) => m.id === selectedJob.id) ?? null
    : null;

  const handleCardClick = (id: string) => {
    setSelectedId(id);
    if (isMobile) setShowMobileDetail(true);
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
            onOpenQuiz={openQuiz}
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
              {/* Proud moment nudge for skipped Q3 */}
              {skippedQ4 && isQuizMode && (
                <div className="mx-1 mb-2">
                  <button
                    onClick={() => setProudMomentOpen(!proudMomentOpen)}
                    className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg bg-[#E8F7F2] border border-[#B8E0D2] text-[13px] text-[#0F6E56] font-medium hover:bg-[#dcf3ea] transition-colors"
                  >
                    <span>✦ Want better matches? Add a proud moment →</span>
                    {proudMomentOpen ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                  </button>
                  {proudMomentOpen && (
                    <div className="mt-2 px-3 py-3 rounded-lg bg-white border border-[#E8E8E4]">
                      <p className="text-xs text-muted-foreground mb-2">Tell us about something you're proud of — at work, big or small.</p>
                      <textarea
                        value={proudMomentText}
                        onChange={(e) => setProudMomentText(e.target.value)}
                        rows={3}
                        placeholder="e.g. I trained 3 new starters, I reorganised how we handle complaints..."
                        className="w-full px-3 py-2 rounded-lg bg-background border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-sm resize-none"
                      />
                      <button
                        disabled={proudMomentText.length < 15}
                        onClick={() => {
                          const result = runQuizScoring(
                            skillTags,
                            "",
                            proudMomentText,
                            false,
                            null
                          );
                          setQuizResults({ userSkills: result.userSkills, topMatches: result.topMatches });
                          setResults(result.topMatches);
                          setSkillTags(result.userSkills.map((s) => s.name));
                          if (result.topMatches.length > 0) setSelectedId(result.topMatches[0].id);
                          setSkippedQ3(false);
                          setProudMomentOpen(false);
                        }}
                        className="mt-2 w-full h-9 rounded-lg bg-primary text-primary-foreground font-semibold text-sm hover:brightness-110 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        Update my matches →
                      </button>
                    </div>
                  )}
                </div>
              )}
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
          ) : skillTags.length === 0 && results.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full px-6 text-center">
              <Sparkles className="h-8 w-8 text-primary mb-4" />
              <p className="text-foreground font-semibold mb-1">No skills added yet.</p>
              <p className="text-sm text-muted-foreground mb-5 max-w-[240px]">
                Search for a skill above, or take the quiz to discover yours.
              </p>
              <div className="flex gap-3 w-full max-w-[280px]">
                <button
                  onClick={openQuiz}
                  className="flex-1 h-10 rounded-lg bg-primary text-primary-foreground font-semibold text-sm hover:brightness-110 transition-all"
                >
                  Take the quiz →
                </button>
                <button
                  onClick={handleBrowseAll}
                  className="flex-1 h-10 rounded-lg border border-[#E8E8E4] bg-white text-foreground font-semibold text-sm hover:border-primary/40 transition-colors"
                >
                  Browse all roles →
                </button>
              </div>
            </div>
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
            allJobs={filteredResults}
            allScored={isQuizMode ? quizResults!.topMatches : undefined}
            onSelectJob={(id) => setSelectedId(id)}
            onApply={() => setApplyOpen(true)}
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
              allJobs={filteredResults}
              allScored={isQuizMode ? quizResults!.topMatches : undefined}
              onSelectJob={(id) => { setSelectedId(id); }}
              onApply={() => setApplyOpen(true)}
            />
          </div>
          <div className="p-4 border-t border-[hsl(220,13%,91%)]">
            <button onClick={() => setApplyOpen(true)} className="w-full h-12 rounded-lg bg-primary text-primary-foreground font-bold text-sm">
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
            <FilterSidebar filters={filters} onChange={setFilters} onOpenQuiz={openQuiz} className="border-r-0" />
          </div>
        </div>
      )}

      {/* Application modal */}
      {applyOpen && selectedJob && (
        <ApplicationModal
          job={selectedJob}
          scored={selectedScored}
          querySkills={skillTags.map((s) => s.toLowerCase())}
          onClose={() => setApplyOpen(false)}
        />
      )}
    </div>
  );
};

export default ResultsPage;
