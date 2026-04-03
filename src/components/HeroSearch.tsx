import { useState, useEffect, useRef } from "react";
import { Search } from "lucide-react";
import { allSkills, searchJobsBySkill, type Job } from "@/data/jobs";
import { JobResults } from "./JobResults";

const PLACEHOLDER_SKILLS = [
  "Content Creation",
  "Team Leadership",
  "Conflict Resolution",
  "Problem Solving",
  "Customer Service",
  "Strategic Planning",
];

export function HeroSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Job[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const resultsRef = useRef<HTMLDivElement>(null);

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

  return (
    <>
      <section className="hero-bg min-h-screen flex flex-col items-center justify-center px-4 relative overflow-hidden">
        {/* Subtle grid background */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: 'linear-gradient(hsl(var(--foreground)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)',
          backgroundSize: '60px 60px'
        }} />

        <div className="relative z-10 max-w-3xl w-full text-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight leading-tight animate-fade-up">
            Stop searching for titles.{" "}
            <span className="text-gradient">Start matching your skills.</span>
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto animate-fade-up-delay">
            Most job sites look at where you've been. We look at what you can actually do. Get matched with roles that value your hustle.
          </p>

          <div className="mt-10 flex items-center gap-0 max-w-xl mx-auto animate-fade-up-delay-2">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={`Try "${PLACEHOLDER_SKILLS[placeholderIndex]}"...`}
                className="w-full h-14 pl-12 pr-4 rounded-l-xl bg-secondary border border-border text-foreground placeholder:text-muted-foreground text-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
              />
            </div>
            <button
              onClick={handleSearch}
              className="h-14 px-8 rounded-r-xl bg-primary text-primary-foreground font-bold text-lg hover:brightness-110 transition-all animate-pulse-glow shrink-0"
            >
              Search
            </button>
          </div>

          <div className="mt-4 flex flex-wrap justify-center gap-2 animate-fade-up-delay-2">
            <span className="text-sm text-muted-foreground">Popular:</span>
            {["Customer Service", "Team Leadership", "Content Creation", "Problem Solving"].map((skill) => (
              <button
                key={skill}
                onClick={() => {
                  setQuery(skill);
                  const matched = searchJobsBySkill(skill);
                  setResults(matched);
                  setHasSearched(true);
                  setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
                }}
                className="text-sm px-3 py-1 rounded-full border border-border text-muted-foreground hover:text-foreground hover:border-primary/50 transition-all cursor-pointer"
              >
                {skill}
              </button>
            ))}
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
}
