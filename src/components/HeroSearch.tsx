import { useNavigate } from "react-router-dom";
import { HeroDemo } from "@/components/HeroDemo";

interface HeroSearchProps {
  onOpenQuiz: () => void;
}

export function HeroSearch({ onOpenQuiz }: HeroSearchProps) {
  const navigate = useNavigate();

  const goToSearch = () => {
    navigate("/results", { state: { results: [], skillTags: [] } });
  };

  return (
    <section className="hero-bg px-4 md:px-8 lg:px-16 relative overflow-hidden">
      <div className="max-w-3xl mx-auto w-full flex flex-col items-center text-center pt-16 pb-20 lg:pt-24 lg:pb-28">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight leading-tight animate-fade-up">
          Stop searching for titles.{" "}
          <span className="text-gradient">Start matching your skills.</span>
        </h1>

        <p className="mt-6 text-lg sm:text-xl text-muted-foreground max-w-2xl animate-fade-up-delay">
          Most job sites look at your job title. We look at what you can actually do. Get matched to roles you're actually built for.
        </p>

        {/* Primary CTA */}
        <div className="mt-9 w-full max-w-md animate-fade-up-delay-2">
          <button
            onClick={onOpenQuiz}
            className="w-full h-14 rounded-xl bg-primary text-primary-foreground font-bold text-base hover:brightness-110 transition-all shadow-lg shadow-primary/20"
          >
            Start the quiz · 2 min · Free →
          </button>
          <button
            onClick={goToSearch}
            className="mt-4 text-sm text-muted-foreground hover:text-foreground transition-colors underline underline-offset-4"
          >
            Already know your skills? Search directly →
          </button>
        </div>

        {/* Slim proof strip — ticker of real matches */}
        <div className="mt-14 w-full max-w-3xl animate-fade-up-delay-2">
          <HeroDemo />
        </div>
      </div>
    </section>
  );
}
