import { ArrowRight } from "lucide-react";

// Slim horizontal proof strip — vertical ticker of career transformations.
// Compact (~200px tall), shows 3 rows at once, edge fades top/bottom.

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
  const size = 32;
  const stroke = 3.5;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const color = "hsl(var(--primary))";
  const track = "hsl(var(--primary) / 0.15)";

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
        className="absolute inset-0 flex items-center justify-center text-[9px] font-bold text-primary"
      >
        {score}
      </span>
    </div>
  );
}

function TransitionRow({ t }: { t: Transition }) {
  return (
    <div className="flex items-center gap-3 px-3 py-2 h-[52px]">
      <MiniRing score={t.score} />
      <div className="flex-1 min-w-0 flex items-center gap-2 text-sm font-medium leading-tight text-left">
        <span className="truncate text-muted-foreground">{t.from}</span>
        <ArrowRight className="h-3.5 w-3.5 text-primary shrink-0" />
        <span className="truncate font-semibold text-foreground">{t.to}</span>
      </div>
    </div>
  );
}

export function HeroDemo() {
  const loop = [...TRANSITIONS, ...TRANSITIONS];

  return (
    <div className="relative w-full max-w-xl mx-auto">
      {/* Header label */}
      <div className="mb-3 flex items-center justify-center gap-2">
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
        </span>
        <span className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
          Real matches happening now
        </span>
      </div>

      {/* Ticker viewport — 3 rows visible */}
      <div
        className="relative overflow-hidden rounded-xl border border-border/60 bg-card/40"
        style={{ height: 168 }}
      >
        {/* Top fade */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-10 bg-gradient-to-b from-background to-transparent z-10" />
        {/* Bottom fade */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-background to-transparent z-10" />

        <div className="ticker-track flex flex-col">
          {loop.map((t, i) => (
            <TransitionRow key={`${t.from}-${i}`} t={t} />
          ))}
        </div>
      </div>

      <style>{`
        @keyframes ticker-scroll {
          0% { transform: translateY(0); }
          100% { transform: translateY(-50%); }
        }
        .ticker-track {
          animation: ticker-scroll 30s linear infinite;
        }
        .ticker-track:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
}
