import { useState, useRef, useEffect, useMemo } from "react";
import { Search, X, Sparkles } from "lucide-react";
import { suggestSkills } from "@/lib/skillSuggestions";

const MAX_SKILLS = 6;

interface ResultsTopBarProps {
  skillTags: string[];
  setSkillTags: (tags: string[]) => void;
  resultCount: number;
  onSearch: (tags: string[]) => void;
}

export function ResultsTopBar({ skillTags, setSkillTags, resultCount, onSearch }: ResultsTopBarProps) {
  const [input, setInput] = useState("");
  const [open, setOpen] = useState(false);
  const [activeIdx, setActiveIdx] = useState(0);
  const wrapRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const suggestions = useMemo(() => suggestSkills(input, skillTags, 8), [input, skillTags]);

  // Reset active index when suggestions change
  useEffect(() => { setActiveIdx(0); }, [suggestions.length]);

  // Close on outside click
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const commitSkill = (skill: string) => {
    const trimmed = skill.trim();
    if (!trimmed) return;
    if (skillTags.length >= MAX_SKILLS) return;
    if (skillTags.some((s) => s.toLowerCase() === trimmed.toLowerCase())) return;
    const next = [...skillTags, trimmed];
    setSkillTags(next);
    setInput("");
    onSearch(next);
    inputRef.current?.focus();
  };

  const removeSkill = (skill: string) => {
    const next = skillTags.filter((s) => s !== skill);
    setSkillTags(next);
    if (next.length > 0) onSearch(next);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (suggestions.length > 0) {
        setOpen(true);
        setActiveIdx((i) => Math.min(i + 1, suggestions.length - 1));
      }
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIdx((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (open && suggestions[activeIdx]) {
        commitSkill(suggestions[activeIdx]);
      } else if (input.trim()) {
        commitSkill(input);
      } else if (skillTags.length > 0) {
        onSearch(skillTags);
      }
    } else if (e.key === "Escape") {
      setOpen(false);
    } else if (e.key === "Backspace" && !input && skillTags.length > 0) {
      removeSkill(skillTags[skillTags.length - 1]);
    } else if (e.key === ",") {
      e.preventDefault();
      if (input.trim()) commitSkill(input);
    }
  };

  return (
    <div className="sticky top-0 z-30 bg-white border-b border-[#E8E8E4] shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
      <div className="h-14 flex items-center px-4 sm:px-6 gap-4">
        {/* Search input + pills */}
        <div ref={wrapRef} className="relative flex-1 max-w-[640px]">
          <div className="flex items-center gap-1.5 flex-wrap min-h-[40px] px-3 py-1.5 rounded-xl bg-[#F5F5F3] border border-transparent focus-within:bg-white focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 transition-all">
            <Search className="h-4 w-4 text-muted-foreground shrink-0" />
            {skillTags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 pl-2.5 pr-1 py-0.5 rounded-full bg-primary text-primary-foreground text-xs font-medium animate-fade-in"
              >
                {tag}
                <button
                  onClick={() => removeSkill(tag)}
                  className="h-4 w-4 rounded-full hover:bg-primary-foreground/20 flex items-center justify-center"
                  aria-label={`Remove ${tag}`}
                >
                  <X className="h-2.5 w-2.5" />
                </button>
              </span>
            ))}
            {skillTags.length < MAX_SKILLS && (
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => { setInput(e.target.value); setOpen(true); }}
                onFocus={() => setOpen(true)}
                onKeyDown={handleKeyDown}
                placeholder={skillTags.length === 0 ? "Search skills — try 'communication' or 'excel'…" : "Add another skill…"}
                className="flex-1 min-w-[140px] h-7 bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
              />
            )}
          </div>

          {/* Autocomplete dropdown */}
          {open && (suggestions.length > 0 || (input.trim().length > 0 && !suggestions.includes(input.trim()))) && (
            <div className="absolute left-0 right-0 mt-2 bg-white border border-border rounded-xl shadow-lg overflow-hidden z-40 animate-fade-in">
              {input.trim() && !suggestions.some((s) => s.toLowerCase() === input.trim().toLowerCase()) && (
                <button
                  onMouseDown={(e) => { e.preventDefault(); commitSkill(input); }}
                  className="w-full text-left px-4 py-2.5 text-sm text-foreground hover:bg-muted/50 flex items-center justify-between border-b border-border"
                >
                  <span>Add <span className="font-semibold">"{input.trim()}"</span></span>
                  <span className="text-xs text-muted-foreground">Enter</span>
                </button>
              )}
              {suggestions.length > 0 && (
                <>
                  <div className="px-4 pt-2.5 pb-1 text-[11px] uppercase tracking-wide font-semibold text-muted-foreground flex items-center gap-1.5">
                    <Sparkles className="h-3 w-3" /> Suggestions
                  </div>
                  <ul className="max-h-72 overflow-y-auto pb-1">
                    {suggestions.map((s, i) => (
                      <li key={s}>
                        <button
                          onMouseDown={(e) => { e.preventDefault(); commitSkill(s); }}
                          onMouseEnter={() => setActiveIdx(i)}
                          className={`w-full text-left px-4 py-2 text-sm flex items-center gap-2 transition-colors ${
                            i === activeIdx ? "bg-primary/10 text-foreground" : "text-foreground hover:bg-muted/50"
                          }`}
                        >
                          <Search className="h-3.5 w-3.5 text-muted-foreground" />
                          {highlight(s, input)}
                        </button>
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

function highlight(text: string, query: string) {
  const q = query.trim();
  if (!q) return text;
  const lower = text.toLowerCase();
  const idx = lower.indexOf(q.toLowerCase());
  if (idx === -1) return text;
  return (
    <>
      {text.slice(0, idx)}
      <span className="font-semibold text-primary">{text.slice(idx, idx + q.length)}</span>
      {text.slice(idx + q.length)}
    </>
  );
}
