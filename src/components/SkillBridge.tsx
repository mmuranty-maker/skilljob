import { useState } from "react";
import { Sparkles, Search } from "lucide-react";
import { skillMappings } from "@/data/jobs";

interface SkillBridgeProps {
  onSkillSearch?: (skill: string) => void;
}

// Map job titles to their skills from our dataset
function getSkillsForTitle(input: string): string[] {
  const q = input.toLowerCase().trim();
  if (!q) return [];

  const matched = skillMappings.filter((m) =>
    m.title.toLowerCase().includes(q)
  );

  if (matched.length > 0) {
    return [...new Set(matched.flatMap((m) => m.skills))];
  }

  return [];
}

const EXAMPLE_TITLES = ["Waiter", "Nurse", "Software Engineer", "Chef", "Project Manager", "Barista"];

export function SkillBridge({ onSkillSearch }: SkillBridgeProps) {
  const [titleInput, setTitleInput] = useState("");
  const [generatedSkills, setGeneratedSkills] = useState<string[]>([]);
  const [hasGenerated, setHasGenerated] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const generate = (title: string) => {
    const value = title || titleInput;
    if (!value.trim()) return;
    setTitleInput(value);
    setIsAnimating(true);
    setGeneratedSkills([]);
    setHasGenerated(true);

    const skills = getSkillsForTitle(value);

    // Animate skills appearing one by one
    skills.forEach((skill, i) => {
      setTimeout(() => {
        setGeneratedSkills((prev) => [...prev, skill]);
        if (i === skills.length - 1) setIsAnimating(false);
      }, 150 * (i + 1));
    });

    if (skills.length === 0) {
      setIsAnimating(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") generate(titleInput);
  };

  return (
    <section className="py-24 px-4 border-t border-border bg-muted/30">
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="text-3xl sm:text-4xl font-black tracking-tight">
          Your experience is worth more than a{" "}
          <span className="text-gradient">title.</span>
        </h2>
        <p className="mt-4 text-lg text-muted-foreground max-w-xl mx-auto">
          We translate your day-to-day grind into the professional skills employers are starving for.
        </p>

        {/* Generator Card */}
        <div className="mt-12 card-bg border border-border rounded-2xl p-8 text-left shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="h-5 w-5 text-primary" />
            <h3 className="font-bold text-lg text-foreground">Discover your hidden skills</h3>
          </div>
          <p className="text-sm text-muted-foreground mb-6">
            Enter your current or past job title and we'll show you the professional skills you already have.
          </p>

          <div className="flex items-center gap-0">
            <input
              type="text"
              value={titleInput}
              onChange={(e) => setTitleInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Enter your job title (e.g. Waiter, Barista...)"
              className="flex-1 h-12 px-4 rounded-l-xl bg-background border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
            />
            <button
              onClick={() => generate(titleInput)}
              disabled={isAnimating}
              className="h-12 px-6 rounded-r-xl bg-primary text-primary-foreground font-bold hover:brightness-110 transition-all shrink-0 flex items-center gap-2 disabled:opacity-70"
            >
              <Sparkles className="h-4 w-4" />
              Generate
            </button>
          </div>

          {/* Example titles */}
          <div className="mt-3 flex flex-wrap gap-2">
            <span className="text-xs text-muted-foreground">Try:</span>
            {EXAMPLE_TITLES.map((title) => (
              <button
                key={title}
                onClick={() => generate(title)}
                className="text-xs px-3 py-1 rounded-full border border-border text-muted-foreground hover:text-foreground hover:border-primary/50 hover:bg-primary/5 transition-all cursor-pointer"
              >
                {title}
              </button>
            ))}
          </div>

          {/* Generated Skills */}
          {hasGenerated && (
            <div className="mt-8 pt-6 border-t border-border">
              {generatedSkills.length > 0 ? (
                <>
                  <p className="text-sm font-semibold text-foreground mb-4">
                    Your skills as a <span className="text-primary">{titleInput}</span>:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {generatedSkills.map((skill, i) => (
                      <button
                        key={`${skill}-${i}`}
                        onClick={() => onSkillSearch?.(skill)}
                        className="group flex items-center gap-1.5 px-4 py-2 rounded-full bg-primary/10 text-primary font-medium text-sm hover:bg-primary hover:text-primary-foreground transition-all cursor-pointer animate-fade-up"
                        style={{ animationDelay: `${i * 50}ms` }}
                      >
                        {skill}
                        <Search className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </button>
                    ))}
                  </div>
                  <p className="mt-4 text-xs text-muted-foreground">
                    Click any skill to find matching jobs →
                  </p>
                </>
              ) : (
                !isAnimating && (
                  <p className="text-sm text-muted-foreground">
                    We couldn't find skills for that title yet. Try one of the examples above!
                  </p>
                )
              )}
            </div>
          )}
        </div>

        <p className="mt-10 text-muted-foreground text-base">
          <span className="text-primary font-semibold">The Result:</span> Roles that match what you <em>actually</em> do — not what's on your CV.
        </p>
      </div>
    </section>
  );
}
