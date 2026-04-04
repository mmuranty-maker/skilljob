import { useState, useEffect, useRef, forwardRef, useImperativeHandle } from "react";
import { Search } from "lucide-react";
import { allSkills, searchJobsBySkill, type Job } from "@/data/jobs";
import { JobResults } from "./JobResults";
import { SkillQuiz } from "./SkillQuiz";
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
}

export const HeroSearch = forwardRef<HeroSearchHandle>(function HeroSearch(_, ref) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Job[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [quizOpen, setQuizOpen] = useState(false);
  const resultsRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderIndex((i) => (i + 1) % PLACEHOLDER_SKILLS.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  const handleSearch = () => {
    if (!query.trim()) return;
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
    const matched = searchJobsBySkill(skill);
    setResults(matched);
    setHasSearched(true);
    // Scroll to search input first, then to results
    inputRef.current?.scrollIntoView({ behavior: "smooth" });
    setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: "smooth" }), 300);
  };

  useImperativeHandle(ref, () => ({ triggerSearch }));

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

            <div className="mt-10 flex items-center gap-0 max-w-xl animate-fade-up-delay-2">
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
                className="h-14 px-8 rounded-r-xl bg-primary text-primary-foreground font-bold text-lg hover:brightness-110 transition-all animate-pulse-glow shrink-0"
              >
                Search
              </button>
            </div>

            <div className="mt-4 flex flex-wrap gap-2 animate-fade-up-delay-2">
              <span className="text-sm text-muted-foreground">Popular:</span>
              {["Customer Service", "Team Leadership", "Content Creation", "Problem Solving"].map((skill) => (
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
              {/* Floating card overlay */}
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
          <JobResults results={results} query={query} />
        </div>
      )}
    </>
  );
});
