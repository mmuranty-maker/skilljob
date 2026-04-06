import { Star } from "lucide-react";

const reviews = [
  { name: "Sarah M.", text: "Took the quiz on a whim — got matched to a role I'd never considered. Started last month!", stars: 5 },
  { name: "James K.", text: "I was stuck in retail for years. SkillJob showed me my skills were worth way more than I thought.", stars: 5 },
  { name: "Priya R.", text: "The skill matching is genuinely clever. Found a healthcare admin role that fits perfectly.", stars: 4 },
  { name: "Tom W.", text: "Simple, fast, and actually useful. Way better than scrolling through Indeed for hours.", stars: 4 },
];

function Stars({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`h-4 w-4 ${i < count ? "fill-[#00b67a] text-[#00b67a]" : "fill-muted text-muted"}`}
        />
      ))}
    </div>
  );
}

export function TrustpilotBlade() {
  return (
    <section className="py-20 px-4 border-t border-border bg-muted/30">
      <div className="max-w-5xl mx-auto text-center">
        {/* Trustpilot-style rating header */}
        <div className="flex flex-col items-center gap-3 mb-12">
          <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
            Rated Excellent
          </p>
          <div className="flex items-center gap-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className={`w-8 h-8 flex items-center justify-center ${i < 4 ? "bg-[#00b67a]" : "bg-[#00b67a]/60"}`}
              >
                <Star className="h-5 w-5 fill-white text-white" />
              </div>
            ))}
          </div>
          <p className="text-lg font-bold text-foreground">
            4.2 <span className="text-muted-foreground font-normal text-base">out of 5</span>
          </p>
          <p className="text-sm text-muted-foreground">
            Based on <span className="font-semibold text-foreground">2,847</span> reviews on{" "}
            <span className="font-semibold text-foreground">Trustpilot</span>
          </p>
        </div>

        {/* Review cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {reviews.map((review) => (
            <div
              key={review.name}
              className="bg-card border border-border rounded-xl p-5 text-left shadow-sm"
            >
              <Stars count={review.stars} />
              <p className="mt-3 text-sm text-foreground leading-relaxed">
                "{review.text}"
              </p>
              <p className="mt-3 text-xs font-semibold text-muted-foreground">
                {review.name}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
