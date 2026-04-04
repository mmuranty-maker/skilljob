import { useState, useEffect, useRef, forwardRef, useImperativeHandle } from "react";
import { Search, Sparkles } from "lucide-react";
import { searchJobsBySkill, type Job } from "@/data/jobs";
import { JobResults } from "./JobResults";
import { SkillQuiz } from "./SkillQuiz";
import type { UserSkill, ScoredPosting } from "@/lib/quizScoring";
import heroPeople from "@/assets/hero-people.jpg";

const PLACEHOLDER_SKILLS = [
  "Content Creation",
  "Team Leadership",
  "Conflict Resolution",
  "Problem Solving",
  "Customer Service",
  "Strategic Planning",
];

export interface HeroSearchHandle {
  triggerSearch: (skill: string) => void;
  openQuiz: () => void;
}

export const HeroSearch = forwardRef<HeroSearchHandle>(function HeroSearch(_, ref) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Job[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [quizOpen, setQuizOpen] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [quizResults, setQuizResults] = useState<{ userSkills: UserSkill[]; topMatches: ScoredPosting[] } | null>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderIndex((i) => (i + 1) % PLACEHOLDER_SKILLS.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (showSearch) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [showSearch]);

  const handleSearch = () => {
    if (!query.trim()) return;
    setQuizResults(null); // Clear quiz results when doing a manual search
    const matched = searchJobsBySkill(query);
    setResults(matched);
    setHasSearched(true);
    setTimeout(() => {
      resultsRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSearch();
  };

  const triggerSearch = (skill: string) => {
    setQuery(skill);
    setQuizResults(null);
    const matched = searchJobsBySkill(skill);
    setResults(matched);
    setHasSearched(true);
    inputRef.current?.scrollIntoView({ behavior: "smooth" });
    setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: "smooth" }), 300);
  };

  const handleQuizResults = (userSkills: UserSkill[], topMatches: ScoredPosting[]) => {
    setQuizResults({ userSkills, topMatches });
    // Convert scored postings to regular results for display
    setResults(topMatches);
    setQuery(userSkills[0]?.name || "Your skills");
    setHasSearched(true);
    setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: "smooth" }), 300);
  };

  useImperativeHandle(ref, () => ({ triggerSearch, openQuiz: () => setQuizOpen(true) }));

  return (
    <>
      <section className="hero-bg min-h-screen flex items-center px-4 md:px-8 lg:px-16 relative overflow-hidden">
        <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center py-20">
          {/* Left: Text + Search */}
          <div className="relative z-10">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight leading-tight animate-fade-up">
              Stop searching for titles.{" "}
              <span className="text-gradient">Start matching your skills.</span>
            </h1>

            <p className="mt-6 text-lg sm:text-xl text-muted-foreground max-w-xl animate-fade-up-delay">
              Most job sites look at your job title. We look at what you can actually do. Get matched with roles that value your hustle.
            </p>

            {/* Two-path entry point */}
            <div className="mt-10 max-w-xl animate-fade-up-delay-2">
              <h2 className="text-lg font-bold text-foreground mb-4">How would you like to get started?</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-card border border-border rounded-xl p-6 hover:border-primary/40 transition-all flex flex-col">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <Search className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="font-bold text-foreground mb-1">I know my skills</h3>
                  <p className="text-sm text-muted-foreground mb-5 flex-1">Search by what you can do and get matched to roles instantly.</p>
                  <button
                    onClick={() => setShowSearch(true)}
                    className="w-full h-11 rounded-lg bg-primary text-primary-foreground font-semibold text-sm hover:brightness-110 transition-all"
                  >
                    Search by skill →
                  </button>
                </div>

                <div className="bg-card border border-border rounded-xl p-6 hover:border-primary/40 transition-all flex flex-col">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <Sparkles className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="font-bold text-foreground mb-1">Help me discover my skills</h3>
                  <p className="text-sm text-muted-foreground mb-5 flex-1">Answer 3 quick questions and we'll build your skill profile for you.</p>
                  <button
                    onClick={() => setQuizOpen(true)}
                    className="w-full h-11 rounded-lg border border-primary text-primary font-semibold text-sm hover:bg-primary/5 transition-all"
                  >
                    Start the quiz →
                  </button>
                </div>
              </div>

              {showSearch && (
                <div className="mt-5 animate-fade-in">
                  <div className="flex items-center gap-0">
                    <div className="relative flex-1">
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                      <input
                        ref={inputRef}
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder={`Try "${PLACEHOLDER_SKILLS[placeholderIndex]}"...`}
                        className="w-full h-14 pl-12 pr-4 rounded-l-xl bg-card border border-border text-foreground placeholder:text-muted-foreground text-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all shadow-sm"
                      />
                    </div>
                    <button
                      onClick={handleSearch}
                      className="h-14 px-8 rounded-r-xl bg-primary text-primary-foreground font-bold text-lg hover:brightness-110 transition-all shrink-0"
                    >
                      Search
                    </button>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <span className="text-sm text-muted-foreground">Popular:</span>
                    {["Communication", "Problem Solving", "Reporting", "Excel", "Negotiation"].map((skill) => (
                      <button
                        key={skill}
                        onClick={() => triggerSearch(skill)}
                        className="text-sm px-3 py-1 rounded-full border border-border text-muted-foreground hover:text-foreground hover:border-primary/50 hover:bg-primary/5 transition-all cursor-pointer"
                      >
                        {skill}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right: Hero Image */}
          <div className="relative animate-fade-up-delay hidden lg:block">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl shadow-primary/10">
              <img
                src={heroPeople}
                alt="Diverse group of professionals collaborating on job search"
                width={1280}
                height={720}
                className="w-full h-auto object-cover"
              />
              <div className="absolute bottom-6 left-6 right-6 bg-card/90 backdrop-blur-sm rounded-xl p-4 border border-border shadow-lg">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary/15 flex items-center justify-center">
                    <Search className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-foreground">2,604 roles matched today</p>
                    <p className="text-xs text-muted-foreground">Based on skills, not titles</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {hasSearched && (
        <div ref={resultsRef}>
          <JobResults
            results={results}
            query={query}
            quizResults={quizResults ?? undefined}
          />
        </div>
      )}

      <SkillQuiz
        open={quizOpen}
        onClose={() => setQuizOpen(false)}
        onComplete={(skill) => triggerSearch(skill)}
        onQuizResults={handleQuizResults}
      />
    </>
  );
});
