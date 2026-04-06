import { useRef, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { HeroSearch, type HeroSearchHandle } from "@/components/HeroSearch";
import { TrustpilotBlade } from "@/components/TrustpilotBlade";
import { HowItWorks } from "@/components/HowItWorks";
import { Navbar } from "@/components/Navbar";

const Index = () => {
  const heroRef = useRef<HeroSearchHandle>(null);
  const location = useLocation();

  useEffect(() => {
    if ((location.state as any)?.openQuiz) {
      heroRef.current?.openQuiz();
      // Clear state so refresh doesn't re-open
      window.history.replaceState({}, "");
    }
  }, [location.state]);

  return (
    <main className="min-h-screen">
      <Navbar />
      <div className="pt-16">
        <HeroSearch ref={heroRef} />
        <HowItWorks onStartQuiz={() => heroRef.current?.openQuiz()} />
        <TrustpilotBlade />
      </div>
    </main>
  );
};

export default Index;
