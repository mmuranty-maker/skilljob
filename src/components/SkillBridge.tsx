import { ArrowRight } from "lucide-react";

const translations = [
  {
    real: "Those Waiter shifts?",
    translated: "Conflict Resolution & High-Pressure Communication",
  },
  {
    real: "Managing a 20-table section?",
    translated: "High-Volume Resource Allocation",
  },
  {
    real: "Handling angry customers?",
    translated: "De-escalation & Stakeholder Management",
  },
];

export function SkillBridge() {
  return (
    <section className="py-24 px-4 border-t border-border">
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="text-3xl sm:text-4xl font-black tracking-tight">
          Your experience is worth more than a{" "}
          <span className="text-gradient">title.</span>
        </h2>
        <p className="mt-4 text-lg text-muted-foreground max-w-xl mx-auto">
          We translate your day-to-day grind into the professional skills employers are starving for.
        </p>

        <div className="mt-14 space-y-6">
          {translations.map((t, i) => (
            <div
              key={i}
              className="card-bg border border-border rounded-xl p-6 flex flex-col sm:flex-row items-center gap-4 text-left"
            >
              <p className="text-muted-foreground text-lg flex-1 text-center sm:text-left">
                "{t.real}"
              </p>
              <ArrowRight className="h-5 w-5 text-primary shrink-0 hidden sm:block" />
              <p className="text-foreground font-bold text-lg flex-1 text-center sm:text-left">
                {t.translated}
              </p>
            </div>
          ))}
        </div>

        <p className="mt-10 text-muted-foreground text-base">
          <span className="text-primary font-semibold">The Result:</span> Roles that match what you <em>actually</em> do — not what's on your CV.
        </p>
      </div>
    </section>
  );
}
