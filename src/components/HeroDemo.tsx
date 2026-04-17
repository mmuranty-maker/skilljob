import { ArrowRight, Sparkles } from "lucide-react";

// Vertical scrolling ticker of career transformations.
// Continuous slow scroll with edge fade. Shows 4-5 items at once.

type Transition = {
  from: string;
  to: string;
  score: number;
};

const TRANSITIONS: Transition[] = [
  { from: "Barista", to: "Customer Success Manager", score: 91 },
  { from: "Warehouse worker", to: "Operations Analyst", score: 87 },
  { from: "Waiter", to: "Sales Development Rep", score: 89 },
  { from: "UX Writer", to: "Product Builder", score: 90 },
  { from: "Retail Manager", to: "Operations Lead", score: 96 },
  { from: "Teacher", to: "L&D Specialist", score: 93 },
  { from: "Bartender", to: "Account Executive", score: 88 },
  { from: "Hotel Receptionist", to: "Onboarding Manager", score: 92 },
  { from: "Line Cook", to: "Production Supervisor", score: 85 },
  { from: "Nanny", to: "People Operations Coordinator", score: 86 },
];

function MiniRing({ score }: { score: number }) {
  const size = 38;
  const stroke = 4;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const color = score >= 91 ? "hsl(152, 72%, 38%)" : "hsl(150, 55%, 45%)";
  const track = score >= 91 ? "hsl(152, 72%, 38% / 0.15)" : "hsl(150, 55%, 45% / 0.15)";

  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke={track} strokeWidth={stroke} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </svg>
      <span
        className="absolute inset-0 flex items-center justify-center text-[10px] font-bold"
        style={{ color }}
      >
        {score}
      </span>
    </div>
  );
}

function TransitionRow({ t, isJustMatched }: { t: Transition; isJustMatched?: boolean }) {
  return (
    <div className="flex items-center gap-3 px-4 py-3.5 rounded-xl bg-card border border-border/70 shadow-sm">
      <MiniRing score={t.score} />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 text-sm font-semibold text-foreground leading-tight">
          <span className="truncate text-muted-foreground">{t.from}</span>
          <ArrowRight className="h-3.5 w-3.5 text-primary shrink-0" />
          <span className="truncate">{t.to}</span>
        </div>
        {isJustMatched && (
          <span className="mt-1 inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-primary">
            <Sparkles className="h-2.5 w-2.5" />
            Just matched
          </span>
        )}
      </div>
    </div>
  );
}

export function HeroDemo() {
  // Duplicate the list for a seamless loop
  const loop = [...TRANSITIONS, ...TRANSITIONS];

  return (
    <div className="relative w-full max-w-[480px] mx-auto">
      {/* Soft glow backdrop */}
      <div
        aria-hidden
        className="absolute -inset-8 bg-gradient-to-br from-primary/15 via-primary/5 to-transparent blur-3xl rounded-full"
      />

      {/* Header */}
      <div className="relative mb-3 flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
          </span>
          <span className="text-xs font-bold uppercase tracking-[0.14em] text-foreground">
            Live matches
          </span>
        </div>
        <span className="text-xs font-medium text-muted-foreground">Updated just now</span>
      </div>

      {/* Ticker viewport */}
      <div
        className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-background/40 via-card/60 to-background/40 border border-border/60 backdrop-blur-sm"
        style={{ height: 420 }}
      >
        {/* Top fade */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-background to-transparent z-10" />
        {/* Bottom fade — leaves room for stat card */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-background to-transparent z-10" />

        <div className="ticker-track flex flex-col gap-2.5 p-4">
          {loop.map((t, i) => (
            <TransitionRow
              key={`${t.from}-${i}`}
              t={t}
              isJustMatched={i === 0}
            />
          ))}
        </div>
      </div>

      {/* Stat card overlay */}
      <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 z-20 px-4 py-2.5 rounded-full bg-card border border-border shadow-lg shadow-primary/10 flex items-center gap-2 whitespace-nowrap">
        <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
        <span className="text-sm font-bold text-foreground">2,604 roles matched today</span>
      </div>

      <style>{`
        @keyframes ticker-scroll {
          0% { transform: translateY(0); }
          100% { transform: translateY(-50%); }
        }
        .ticker-track {
          animation: ticker-scroll 40s linear infinite;
        }
        .ticker-track:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
}
