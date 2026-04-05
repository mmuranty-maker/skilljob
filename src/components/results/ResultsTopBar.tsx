import { Search, X } from "lucide-react";

const MAX_SKILLS = 6;

interface ResultsTopBarProps {
  skillTags: string[];
  setSkillTags: (tags: string[]) => void;
  resultCount: number;
  onSearch: (tags: string[]) => void;
}

export function ResultsTopBar({ skillTags, setSkillTags, resultCount, onSearch }: ResultsTopBarProps) {
  const removeSkill = (skill: string) => {
    const next = skillTags.filter((s) => s !== skill);
    setSkillTags(next);
    if (next.length > 0) onSearch(next);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const val = (e.target as HTMLInputElement).value.trim();
      if (val && skillTags.length < MAX_SKILLS) {
        const parts = val.split(",").map((s) => s.trim()).filter(Boolean);
        const next = [...skillTags];
        for (const p of parts) {
          if (next.length >= MAX_SKILLS) break;
          if (!next.some((s) => s.toLowerCase() === p.toLowerCase())) next.push(p);
        }
        setSkillTags(next);
        (e.target as HTMLInputElement).value = "";
        onSearch(next);
      } else if (skillTags.length > 0) {
        onSearch(skillTags);
      }
    }
  };

  return (
    <div className="sticky top-0 z-30 bg-white border-b border-[#E8E8E4] shadow-[0_1px_3px_rgba(0,0,0,0.06)] h-14 flex items-center px-6 gap-4">
      <div className="flex items-center gap-1.5 flex-wrap max-w-[480px] flex-1 min-h-[36px]">
        <Search className="h-4 w-4 text-muted-foreground shrink-0" />
        {skillTags.map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-[20px] bg-primary text-primary-foreground text-xs font-medium"
          >
            {tag}
            <button onClick={() => removeSkill(tag)} className="hover:bg-primary-foreground/20 rounded-full p-0.5">
              <X className="h-2.5 w-2.5" />
            </button>
          </span>
        ))}
        {skillTags.length < MAX_SKILLS && (
          <input
            type="text"
            placeholder="Add a skill..."
            onKeyDown={handleKeyDown}
            className="flex-1 min-w-[100px] h-7 bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
          />
        )}
      </div>
      <p className="text-sm text-muted-foreground ml-auto whitespace-nowrap">
        {resultCount} role{resultCount !== 1 ? "s" : ""} matched for your skills
      </p>
    </div>
  );
}
