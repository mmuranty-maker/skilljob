import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronDown, ChevronUp, X, Sparkles } from "lucide-react";

export interface Filters {
  jobTypes: string[];
  seniorities: string[];
  salaryMin: number | null;
  salaryMax: number | null;
  datePosted: string;
  categories: string[];
}

export const defaultFilters: Filters = {
  jobTypes: [],
  seniorities: [],
  salaryMin: null,
  salaryMax: null,
  datePosted: "any",
  categories: [],
};

const JOB_TYPES = ["Full-time", "Part-time", "Contract", "Remote"];
const SENIORITIES = ["Junior", "Mid", "Senior"];
const DATE_OPTIONS = [
  { value: "any", label: "Any time" },
  { value: "3", label: "Past 3 days" },
  { value: "7", label: "Past week" },
  { value: "30", label: "Past month" },
];
const CATEGORIES = [
  "Hospitality",
  "Retail",
  "Healthcare",
  "Technology",
  "Business",
  "Sales & Marketing",
  "Creative",
  "Finance",
  "Education",
  "Trades",
];

interface FilterSidebarProps {
  filters: Filters;
  onChange: (filters: Filters) => void;
  className?: string;
}

function FilterGroup({
  title,
  count,
  children,
  defaultOpen = true,
}: {
  title: string;
  count: number;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-[hsl(220,13%,91%)] pb-4 mb-4 last:border-b-0 last:mb-0 last:pb-0">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full text-left"
      >
        <span className="text-sm font-semibold text-foreground">
          {title}
          {count > 0 && (
            <span className="ml-1.5 text-xs font-semibold bg-primary/15 text-primary px-1.5 py-0.5 rounded-full">
              {count}
            </span>
          )}
        </span>
        {open ? (
          <ChevronUp className="h-4 w-4 text-muted-foreground" />
        ) : (
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        )}
      </button>
      {open && <div className="mt-3">{children}</div>}
    </div>
  );
}

function QuizNudge() {
  const navigate = useNavigate();
  return (
    <button
      onClick={() => navigate("/", { state: { openQuiz: true } })}
      className="mt-5 w-full rounded-lg border border-[#B8E0D2] bg-[#E8F7F2] p-3 text-left hover:border-primary/50 transition-colors"
    >
      <div className="flex items-start gap-2">
        <Sparkles className="h-3.5 w-3.5 text-[#0F6E56] mt-0.5 shrink-0" />
        <div>
          <p className="text-xs font-semibold text-[#0F6E56]">Not sure about your skills?</p>
          <p className="text-xs text-[#0F6E56] mt-0.5">Try the quiz instead →</p>
        </div>
      </div>
    </button>
  );
}

export function FilterSidebar({ filters, onChange, className = "" }: FilterSidebarProps) {
  const toggleArray = (arr: string[], value: string) =>
    arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value];

  const [salaryMinInput, setSalaryMinInput] = useState(filters.salaryMin?.toString() ?? "");
  const [salaryMaxInput, setSalaryMaxInput] = useState(filters.salaryMax?.toString() ?? "");

  const totalActive =
    filters.jobTypes.length +
    filters.seniorities.length +
    (filters.salaryMin || filters.salaryMax ? 1 : 0) +
    (filters.datePosted !== "any" ? 1 : 0) +
    filters.categories.length;

  const clearAll = () => {
    onChange(defaultFilters);
    setSalaryMinInput("");
    setSalaryMaxInput("");
  };

  return (
    <aside className={`bg-white border-r border-[hsl(220,13%,91%)] p-5 ${className}`}>
      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-5">
        Refine results
      </p>

      <FilterGroup title="Job type" count={filters.jobTypes.length}>
        <div className="space-y-2.5">
          {JOB_TYPES.map((type) => (
            <label key={type} className="flex items-center gap-2.5 cursor-pointer group">
              <input
                type="checkbox"
                checked={filters.jobTypes.includes(type)}
                onChange={() =>
                  onChange({ ...filters, jobTypes: toggleArray(filters.jobTypes, type) })
                }
                className="h-4 w-4 rounded border-[hsl(220,13%,91%)] text-primary focus:ring-primary/30 accent-[hsl(152,60%,36%)]"
              />
              <span className="text-sm text-foreground group-hover:text-primary transition-colors">
                {type}
              </span>
            </label>
          ))}
        </div>
      </FilterGroup>

      <FilterGroup title="Seniority" count={filters.seniorities.length}>
        <div className="space-y-2.5">
          {SENIORITIES.map((s) => (
            <label key={s} className="flex items-center gap-2.5 cursor-pointer group">
              <input
                type="checkbox"
                checked={filters.seniorities.includes(s)}
                onChange={() =>
                  onChange({ ...filters, seniorities: toggleArray(filters.seniorities, s) })
                }
                className="h-4 w-4 rounded border-[hsl(220,13%,91%)] text-primary focus:ring-primary/30 accent-[hsl(152,60%,36%)]"
              />
              <span className="text-sm text-foreground group-hover:text-primary transition-colors">
                {s}
              </span>
            </label>
          ))}
        </div>
      </FilterGroup>

      <FilterGroup title="Salary range" count={filters.salaryMin || filters.salaryMax ? 1 : 0}>
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
              $
            </span>
            <input
              type="number"
              placeholder="Min"
              value={salaryMinInput}
              onChange={(e) => setSalaryMinInput(e.target.value)}
              className="w-full h-9 pl-6 pr-2 text-sm border border-[hsl(220,13%,91%)] rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
            />
          </div>
          <span className="text-muted-foreground text-xs">—</span>
          <div className="relative flex-1">
            <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
              $
            </span>
            <input
              type="number"
              placeholder="Max"
              value={salaryMaxInput}
              onChange={(e) => setSalaryMaxInput(e.target.value)}
              className="w-full h-9 pl-6 pr-2 text-sm border border-[hsl(220,13%,91%)] rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
            />
          </div>
        </div>
        <button
          onClick={() =>
            onChange({
              ...filters,
              salaryMin: salaryMinInput ? Number(salaryMinInput) : null,
              salaryMax: salaryMaxInput ? Number(salaryMaxInput) : null,
            })
          }
          className="mt-2.5 w-full h-8 text-xs font-semibold rounded-lg border border-primary/30 text-primary hover:bg-primary/5 transition-colors"
        >
          Apply
        </button>
      </FilterGroup>

      <FilterGroup title="Date posted" count={filters.datePosted !== "any" ? 1 : 0}>
        <div className="space-y-2.5">
          {DATE_OPTIONS.map((opt) => (
            <label key={opt.value} className="flex items-center gap-2.5 cursor-pointer group">
              <input
                type="radio"
                name="datePosted"
                checked={filters.datePosted === opt.value}
                onChange={() => onChange({ ...filters, datePosted: opt.value })}
                className="h-4 w-4 border-[hsl(220,13%,91%)] text-primary focus:ring-primary/30 accent-[hsl(152,60%,36%)]"
              />
              <span className="text-sm text-foreground group-hover:text-primary transition-colors">
                {opt.label}
              </span>
            </label>
          ))}
        </div>
      </FilterGroup>

      <FilterGroup title="Category" count={filters.categories.length}>
        <div className="space-y-2.5 max-h-[200px] overflow-y-auto custom-scrollbar pr-1">
          {CATEGORIES.map((cat) => (
            <label key={cat} className="flex items-center gap-2.5 cursor-pointer group">
              <input
                type="checkbox"
                checked={filters.categories.includes(cat)}
                onChange={() =>
                  onChange({ ...filters, categories: toggleArray(filters.categories, cat) })
                }
                className="h-4 w-4 rounded border-[hsl(220,13%,91%)] text-primary focus:ring-primary/30 accent-[hsl(152,60%,36%)]"
              />
              <span className="text-sm text-foreground group-hover:text-primary transition-colors">
                {cat}
              </span>
            </label>
          ))}
        </div>
      </FilterGroup>

      {totalActive > 0 && (
        <button
          onClick={clearAll}
          className="mt-4 flex items-center gap-1.5 text-sm text-primary hover:text-primary/80 transition-colors"
        >
          <X className="h-3.5 w-3.5" />
          Clear all filters
        </button>
      )}

      {/* Quiz nudge */}
      <QuizNudge />
    </aside>
  );
}
