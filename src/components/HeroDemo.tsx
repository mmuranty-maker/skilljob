import { useEffect, useState } from "react";
import { CheckCircle2, Sparkles } from "lucide-react";
import { INDUSTRIES } from "@/data/industries";

// A 3-scene looping product demo.
// Scene 0: Industry tiles light up one by one.
// Scene 1: Skill chips assemble with a soft confetti glow.
// Scene 2: Match ring animates to 92% with a top match callout.

const SCENES = ["industries", "skills", "match"] as const;
type Scene = typeof SCENES[number];

const SKILL_CHIPS = [
  "Team leadership",
  "Process design",
  "Stakeholder comms",
  "Problem solving",
  "Operations",
];

export function HeroDemo() {
  const [scene, setScene] = useState<Scene>("industries");
  const [tick, setTick] = useState(0); // animation progress within scene

  // Drive scene cycling
  useEffect(() => {
    const order: Record<Scene, number> = { industries: 3200, skills: 3000, match: 3800 };
    const t = setTimeout(() => {
      setTick(0);
      setScene((s) => SCENES[(SCENES.indexOf(s) + 1) % SCENES.length]);
    }, order[scene]);
    return () => clearTimeout(t);
  }, [scene]);

  // Drive intra-scene tick (used for staggered reveals)
  useEffect(() => {
    const i = setInterval(() => setTick((t) => t + 1), 320);
    return () => clearInterval(i);
  }, [scene]);

  return (
    <div className="relative w-full aspect-[4/5] sm:aspect-[5/6] max-w-[520px] mx-auto">
      {/* Soft glow backdrop */}
      <div
        aria-hidden
        className="absolute -inset-8 bg-gradient-to-br from-primary/15 via-primary/5 to-transparent blur-3xl rounded-full"
      />

      {/* Frame */}
      <div className="relative h-full w-full rounded-3xl bg-card border border-border shadow-2xl shadow-primary/10 overflow-hidden">
        {/* Faux browser bar */}
        <div className="h-9 bg-muted/40 border-b border-border flex items-center gap-1.5 px-3.5">
          <span className="h-2.5 w-2.5 rounded-full bg-[#FF5F57]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#FEBC2E]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#28C840]" />
          <div className="ml-3 flex-1 h-5 rounded-md bg-background/60 border border-border" />
        </div>

        <div className="relative h-[calc(100%-2.25rem)] p-5 sm:p-6">
          {/* Scene caption */}
          <p
            key={scene}
            className="text-[11px] font-bold uppercase tracking-[0.14em] text-primary mb-3 animate-fade-in"
          >
            {scene === "industries" && "Pick your world"}
            {scene === "skills" && "Build your skill profile"}
            {scene === "match" && "Find your match"}
          </p>

          {scene === "industries" && <IndustriesScene tick={tick} />}
          {scene === "skills" && <SkillsScene tick={tick} />}
          {scene === "match" && <MatchScene tick={tick} />}
        </div>
      </div>
    </div>
  );
}

function IndustriesScene({ tick }: { tick: number }) {
  // Highlight one tile at a time, cycling
  const visible = INDUSTRIES.slice(0, 9);
  const highlightIdx = tick % visible.length;
  return (
    <div className="grid grid-cols-3 gap-2.5 animate-fade-in">
      {visible.map(({ title, icon: Icon, chipBg, chipFg }, i) => {
        const active = i === highlightIdx;
        return (
          <div
            key={title}
            className={`flex flex-col items-center gap-1.5 p-2.5 rounded-xl border transition-all duration-500 ${
              active
                ? "border-primary bg-primary/5 scale-[1.04] shadow-md shadow-primary/15"
                : "border-border bg-background/40"
            }`}
          >
            <div
              className="h-10 w-10 rounded-xl flex items-center justify-center transition-all duration-500"
              style={{ backgroundColor: chipBg }}
            >
              <Icon className="h-5 w-5" style={{ color: chipFg }} strokeWidth={1.75} />
            </div>
            <p className="text-[10px] font-semibold text-foreground text-center leading-tight line-clamp-1">
              {title.split(" & ")[0]}
            </p>
          </div>
        );
      })}
    </div>
  );
}

function SkillsScene({ tick }: { tick: number }) {
  // Reveal chips one by one
  const revealed = Math.min(SKILL_CHIPS.length, tick + 1);
  return (
    <div className="animate-fade-in">
      <p className="text-sm text-muted-foreground mb-4">
        You specialise in <span className="text-foreground font-semibold">team leadership and operations</span>.
      </p>
      <div className="flex flex-wrap gap-2 relative">
        {SKILL_CHIPS.slice(0, revealed).map((s, i) => (
          <span
            key={s}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 text-primary border border-primary/20 text-sm font-medium"
            style={{
              animation: "fade-in 0.4s ease-out both",
              animationDelay: `${i * 60}ms`,
            }}
          >
            <Sparkles className="h-3 w-3" />
            {s}
          </span>
        ))}
      </div>

      {/* Soft confetti bursts */}
      {revealed >= 3 && (
        <div aria-hidden className="pointer-events-none absolute inset-0">
          {[...Array(8)].map((_, i) => (
            <span
              key={i}
              className="absolute h-1.5 w-1.5 rounded-full"
              style={{
                left: `${20 + i * 8}%`,
                top: `${40 + (i % 3) * 10}%`,
                backgroundColor: ["#1D9E75", "#2DBA8C", "#A7E8CC", "#0F6E56"][i % 4],
                animation: `fade-in 0.6s ease-out ${i * 80}ms both`,
                opacity: 0.7,
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function MatchScene({ tick }: { tick: number }) {
  // Animate ring 0 → 92 over the scene
  const target = 92;
  const progress = Math.min(target, Math.round((tick + 1) * 22));
  const size = 130;
  const stroke = 12;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;
  const ringColor = "hsl(152, 72%, 38%)";
  const trackColor = "hsl(152, 72%, 38% / 0.15)";

  return (
    <div className="flex flex-col items-center justify-center h-full pb-2 animate-fade-in">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke={trackColor} strokeWidth={stroke} />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={ringColor}
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            style={{ transition: "stroke-dashoffset 0.4s ease-out" }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-black" style={{ color: ringColor }}>
            {progress}
            <span className="text-base font-bold">%</span>
          </span>
          <span className="text-[10px] font-bold uppercase tracking-wider text-foreground/70 mt-0.5">match</span>
        </div>
      </div>

      <div
        className="mt-5 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/25"
        style={{ animation: "fade-in 0.5s ease-out 0.7s both" }}
      >
        <CheckCircle2 className="h-4 w-4 text-primary" />
        <span className="text-sm font-semibold text-foreground">Top match: Operations Lead</span>
      </div>
      <p className="mt-2 text-xs text-muted-foreground" style={{ animation: "fade-in 0.5s ease-out 0.9s both" }}>
        ★ Outstanding match · You're built for this role
      </p>
    </div>
  );
}
