import { HeroSearch } from "@/components/HeroSearch";
import { SkillBridge } from "@/components/SkillBridge";
import { Navbar } from "@/components/Navbar";

const Index = () => {
  return (
    <main className="min-h-screen">
      <Navbar />
      <div className="pt-16">
        <HeroSearch />
        <SkillBridge />
      </div>
    </main>
  );
};

export default Index;
