import { useState, useEffect, useRef, forwardRef, useImperativeHandle } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Sparkles, X } from "lucide-react";
import { searchJobsBySkills, type Job } from "@/data/jobs";
import { SkillQuiz } from "./SkillQuiz";
import type { UserSkill, ScoredPosting } from "@/lib/quizScoring";
import heroPeople from "@/assets/hero-people.jpg";

const POPULAR_SKILLS = [
  "Communication",
  "Problem Solving",
  "Documentation",
  "Empathy",
  "Research",
  "Reporting",
  "Creativity",
  "Excel",
  "Negotiation",
  "Teamwork",
];

const MAX_SKILLS = 6;

export interface HeroSearchHandle {
  triggerSearch: (skill: string) => void;
  openQuiz: () => void;
}

export const HeroSearch = forwardRef<HeroSearchHandle>(function HeroSearch(_, ref) {
  const navigate = useNavigate();
  const [skillTags, setSkillTags] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [quizOpen, setQuizOpen] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (showSearch) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [showSearch]);

  const addSkills = (text: string) => {
    const parts = text.split(",").map((s) => s.trim()).filter(Boolean);
    setSkillTags((prev) => {
      const next = [...prev];
      for (const part of parts) {
        if (next.length >= MAX_SKILLS) break;
        if (!next.some((s) => s.toLowerCase() === part.toLowerCase())) {
          next.push(part);
        }
      }
      return next;
    });
    setInputValue("");
  };

  const removeSkill = (skill: string) => {
    setSkillTags((prev) => prev.filter((s) => s !== skill));
  };

  const doSearch = (tags: string[]) => {
    if (tags.length === 0) return;
    const matched = searchJobsBySkills(tags);
    navigate("/results", { state: { results: matched, skillTags: tags } });
  };

  const handleSearch = () => {
    // Also commit any pending input text before searching
    let tags = [...skillTags];
    if (inputValue.trim()) {
      const parts = inputValue.split(",").map((s) => s.trim()).filter(Boolean);
      for (const part of parts) {
        if (tags.length >= MAX_SKILLS) break;
        if (!tags.some((s) => s.toLowerCase() === part.toLowerCase())) {
          tags.push(part);
        }
      }
      setSkillTags(tags);
      setInputValue("");
    }
    doSearch(tags);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    // If comma typed, split and add as pills
    if (val.includes(",")) {
      addSkills(val);
    } else {
      setInputValue(val);
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    const pasted = e.clipboardData.getData("text");
    if (pasted.includes(",")) {
      e.preventDefault();
      addSkills(pasted);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (inputValue.trim()) {
        addSkills(inputValue);
      }
      // Search with whatever pills exist (including just-added ones)
      setTimeout(() => {
        // Use functional approach to get latest tags
        setSkillTags((current) => {
          if (current.length > 0) doSearch(current);
          return current;
        });
      }, 0);
    } else if (e.key === "Backspace" && !inputValue && skillTags.length > 0) {
      setSkillTags((prev) => prev.slice(0, -1));
    }
  };

  const triggerSearch = (skill: string) => {
    const newTags = [skill];
    const matched = searchJobsBySkills(newTags);
    navigate("/results", { state: { results: matched, skillTags: newTags } });
  };

  const handlePopularClick = (skill: string) => {
    if (skillTags.length >= MAX_SKILLS) return;
    if (!skillTags.some((s) => s.toLowerCase() === skill.toLowerCase())) {
      setSkillTags((prev) => [...prev, skill]);
    }
  };

  const handleQuizResults = (userSkills: UserSkill[], topMatches: ScoredPosting[]) => {
    navigate("/results", {
      state: {
        results: topMatches,
        skillTags: userSkills.map((s) => s.name),
        quizResults: { userSkills, topMatches },
      },
    });
  };

  useImperativeHandle(ref, () => ({ triggerSearch, openQuiz: () => setQuizOpen(true) }));

  const canSearch = skillTags.length >= 1;

  const getPlaceholder = () => {
    if (skillTags.length === 0) return "Try Customer Service or Team Leadership...";
    if (skillTags.length === 1) return "Add another skill or press Enter to search";
    return "Press Enter to search";
  };

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
                <div className="bg-card border-[1.5px] border-primary rounded-xl p-6 hover:border-primary/80 transition-all flex flex-col">
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-primary-foreground bg-primary px-2.5 py-0.5 rounded-full w-fit mb-3">
                    ★ Recommended
                  </span>
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <Sparkles className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="font-bold text-foreground mb-1">Help me discover my skills</h3>
                  <p className="text-sm text-muted-foreground mb-5 flex-1">Most accurate results. Tell us what you do and we'll find roles you didn't know you qualified for.</p>
                  <button
                    onClick={() => setQuizOpen(true)}
                    className="w-full h-11 rounded-lg bg-primary text-primary-foreground font-semibold text-sm hover:brightness-110 transition-all"
                  >
                    Start the quiz →
                  </button>
                </div>

                <div className="bg-card border border-border rounded-xl p-6 hover:border-primary/40 transition-all flex flex-col">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4 mt-[26px]">
                    <Search className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="font-bold text-foreground mb-1">I know my skills</h3>
                  <p className="text-sm text-muted-foreground mb-5 flex-1">Already know your skills? Search directly and get matched instantly.</p>
                  <button
                    onClick={() => setShowSearch(true)}
                    className="w-full h-11 rounded-lg border border-primary text-primary font-semibold text-sm hover:bg-primary/5 transition-all"
                  >
                    Search by skill →
                  </button>
                </div>
              </div>

              {showSearch && (
                <div className="mt-5 animate-fade-in">
                  {/* Multi-skill tag input */}
                  <div className="flex items-end gap-2">
                    <div className="relative flex-1 min-h-[44px] flex flex-wrap items-center gap-1.5 pl-12 pr-3 py-2.5 rounded-xl bg-card border border-border focus-within:ring-2 focus-within:ring-primary/50 focus-within:border-primary transition-all shadow-sm">
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                      {skillTags.map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-[20px] bg-primary text-primary-foreground text-sm font-medium"
                        >
                          {tag}
                          <button
                            onClick={() => removeSkill(tag)}
                            className="hover:bg-primary-foreground/20 rounded-full p-0.5 transition-colors"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </span>
                      ))}
                      {skillTags.length < MAX_SKILLS && (
                        <input
                          ref={inputRef}
                          type="text"
                          value={inputValue}
                          onChange={handleInputChange}
                          onKeyDown={handleKeyDown}
                          onPaste={handlePaste}
                          placeholder={getPlaceholder()}
                          className="flex-1 min-w-[120px] h-8 bg-transparent text-foreground placeholder:text-muted-foreground text-base focus:outline-none"
                        />
                      )}
                    </div>
                    <button
                      onClick={handleSearch}
                      disabled={!canSearch}
                      className="h-11 px-8 rounded-xl bg-primary text-primary-foreground font-bold text-lg hover:brightness-110 transition-all shrink-0 disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      Search
                    </button>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <span className="text-sm text-muted-foreground">Popular:</span>
                    {POPULAR_SKILLS.filter((s) => !skillTags.some((t) => t.toLowerCase() === s.toLowerCase())).map((skill) => (
                      <button
                        key={skill}
                        onClick={() => handlePopularClick(skill)}
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

      <SkillQuiz
        open={quizOpen}
        onClose={() => setQuizOpen(false)}
        onComplete={(skill) => triggerSearch(skill)}
        onQuizResults={handleQuizResults}
      />
    </>
  );
});