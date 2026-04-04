import { Sparkles, Target, Rocket, Check } from "lucide-react";

interface HowItWorksProps {
  onStartQuiz: () => void;
}

const cards = [
  {
    icon: Sparkles,
    title: "Discover your skills",
    bullets: [
      "Answer 3 quick questions",
      "No jargon, no job titles",
      "Takes under 2 minutes",
    ],
  },
  {
    icon: Target,
    title: "Get matched instantly",
    bullets: [
      "AI reads what you actually do",
      "Matches roles by real skills",
      "See your % fit for every role",
    ],
  },
  {
    icon: Rocket,
    title: "See your next step",
    bullets: [
      "Know exactly what skills you're missing",
      "Find roles you didn't know you qualified for",
      "Apply with confidence",
    ],
  },
];

export function HowItWorks({ onStartQuiz }: HowItWorksProps) {
  return (
    <section className="w-full bg-[hsl(50_14%_97%)] py-20 px-4 md:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Heading */}
        <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-center text-foreground">
          Find the role you were made for
        </h2>
        <p className="text-center text-muted-foreground mt-3 text-base max-w-lg mx-auto">
          Three steps. No CV required. No job title needed.
        </p>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          {cards.map((card) => (
            <div
              key={card.title}
              className="bg-card border border-border rounded-xl p-8 flex flex-col"
            >
              <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mb-5">
                <card.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-bold text-foreground mb-4">{card.title}</h3>
              <ul className="space-y-3 flex-1">
                {card.bullets.map((bullet) => (
                  <li key={bullet} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                    <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                    {bullet}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-12 text-center">
          <button
            onClick={onStartQuiz}
            className="h-14 px-10 rounded-xl bg-primary text-primary-foreground font-bold text-lg hover:brightness-110 transition-all"
          >
            Discover my skills →
          </button>
          <p className="mt-3 text-[13px] text-muted-foreground">
            Free · No sign-up required · Results in 2 minutes
          </p>
        </div>
      </div>
    </section>
  );
}
