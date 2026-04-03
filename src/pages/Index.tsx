import { useRef } from "react";
import { HeroSearch, type HeroSearchHandle } from "@/components/HeroSearch";
import { SkillBridge } from "@/components/SkillBridge";
import { Navbar } from "@/components/Navbar";

const Index = () => {
  const heroRef = useRef<HeroSearchHandle>(null);

  return (
    <main className="min-h-screen">
      <Navbar />
      <div className="pt-16">
        <HeroSearch ref={heroRef} />
        <SkillBridge onSkillSearch={(skill) => heroRef.current?.triggerSearch(skill)} />
      </div>
    </main>
  );
};

export default Index;
