import { useNavigate } from "react-router-dom";
import { HeroDemo } from "@/components/HeroDemo";
import { INDUSTRIES } from "@/data/industries";

interface HeroSearchProps {
  onOpenQuiz: () => void;
}

export function HeroSearch({ onOpenQuiz }: HeroSearchProps) {
  const navigate = useNavigate();

  const goToIndustry = (industry: string) => {
    // Skip Step 1 (path) and land directly in Step 3 (activities) with industry pre-selected.
    navigate("/quiz", { state: { prefillIndustry: industry, isStudent: false } });
  };

  const goToSearch = () => {
    // Send users straight to the results page with an empty query — they can start typing skills there.
    navigate("/results", { state: { results: [], skillTags: [] } });
  };

  return (
    <section className="hero-bg px-4 md:px-8 lg:px-16 relative overflow-hidden">
      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center pt-14 pb-16 lg:py-20">
        {/* Left: Text + CTAs + industry tiles */}
        <div className="relative z-10">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight leading-tight animate-fade-up">
            Stop searching for titles.{" "}
            <span className="text-gradient">Start matching your skills.</span>
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-muted-foreground max-w-xl animate-fade-up-delay">
            Most job sites look at your job title. We look at what you can actually do. Get matched to roles you're actually built for.
          </p>

          {/* Primary CTA */}
          <div className="mt-9 max-w-xl animate-fade-up-delay-2">
            <button
              onClick={onOpenQuiz}
              className="w-full h-14 rounded-xl bg-primary text-primary-foreground font-bold text-base hover:brightness-110 transition-all shadow-lg shadow-primary/20"
            >
              Start the quiz →
            </button>
            <p className="mt-3 text-center text-xs text-muted-foreground font-medium">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary/10 text-primary">
                2 minutes · No signup · Free
              </span>
            </p>
            <button
              onClick={goToSearch}
              className="mt-4 block mx-auto text-sm text-muted-foreground hover:text-foreground transition-colors underline underline-offset-4"
            >
              Already know your skills? Search directly →
            </button>
          </div>

          {/* Embedded Step 1 — industry tiles */}
          <div className="mt-10 max-w-xl animate-fade-up-delay-2">
            <p className="text-sm font-semibold text-foreground mb-3">
              Or jump in — pick your industry to begin:
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {INDUSTRIES.map(({ title, icon: Icon, chipBg, chipFg }) => (
                <button
                  key={title}
                  onClick={() => goToIndustry(title)}
                  className="group flex flex-col items-center gap-2 p-3 rounded-xl border border-border bg-card hover:border-primary hover:shadow-md hover:shadow-primary/10 hover:-translate-y-0.5 transition-all"
                >
                  <div
                    className="h-11 w-11 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110"
                    style={{ backgroundColor: chipBg }}
                  >
                    <Icon className="h-5 w-5" style={{ color: chipFg }} strokeWidth={1.75} />
                  </div>
                  <span className="text-[11px] font-semibold text-foreground text-center leading-tight">
                    {title.split(" & ")[0]}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Animated product demo */}
        <div className="relative animate-fade-up-delay hidden lg:block">
          <HeroDemo />
        </div>
      </div>
    </section>
  );
}
