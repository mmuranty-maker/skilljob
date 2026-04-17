import { useNavigate } from "react-router-dom";
import { HeroSearch } from "@/components/HeroSearch";
import { TrustpilotBlade } from "@/components/TrustpilotBlade";
import { HowItWorks } from "@/components/HowItWorks";
import { Navbar } from "@/components/Navbar";

const Index = () => {
  const navigate = useNavigate();
  const openQuiz = () => navigate("/quiz");

  return (
    <main className="min-h-screen">
      <Navbar />
      <div className="pt-16">
        <HeroSearch onOpenQuiz={openQuiz} />
        <HowItWorks onStartQuiz={openQuiz} />
        <TrustpilotBlade />
      </div>
    </main>
  );
};

export default Index;
