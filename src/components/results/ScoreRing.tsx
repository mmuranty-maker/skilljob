interface ScoreRingProps {
  score: number;
  size?: number;
  strokeWidth?: number;
  showLabel?: boolean;
}

// Tier mapping per spec:
// 0-49 Yellow, 50-80 Orange, 81-90 Green, 91-100 Super green
export function getScoreTier(score: number) {
  if (score >= 91)
    return {
      key: "super",
      label: "Outstanding match",
      // super green
      color: "hsl(152, 72%, 38%)",
      track: "hsl(152, 72%, 38% / 0.15)",
      bg: "hsl(152, 72%, 38% / 0.10)",
      text: "hsl(152, 72%, 28%)",
    };
  if (score >= 81)
    return {
      key: "green",
      label: "Strong match",
      color: "hsl(150, 55%, 45%)",
      track: "hsl(150, 55%, 45% / 0.15)",
      bg: "hsl(150, 55%, 45% / 0.10)",
      text: "hsl(150, 55%, 32%)",
    };
  if (score >= 50)
    return {
      key: "orange",
      label: "Good match",
      color: "hsl(28, 92%, 55%)",
      track: "hsl(28, 92%, 55% / 0.15)",
      bg: "hsl(28, 92%, 55% / 0.10)",
      text: "hsl(28, 92%, 38%)",
    };
  return {
    key: "yellow",
    label: "Building match",
    color: "hsl(45, 95%, 50%)",
    track: "hsl(45, 95%, 50% / 0.18)",
    bg: "hsl(45, 95%, 50% / 0.10)",
    text: "hsl(38, 80%, 35%)",
  };
}

export function ScoreRing({ score, size = 120, strokeWidth = 10, showLabel = true }: ScoreRingProps) {
  const tier = getScoreTier(score);
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (Math.min(100, Math.max(0, score)) / 100) * circumference;

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={tier.track}
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={tier.color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 0.8s cubic-bezier(0.4, 0, 0.2, 1)" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-bold leading-none" style={{ color: tier.color }}>
          {score}
          <span className="text-sm font-semibold">%</span>
        </span>
        {showLabel && (
          <span className="text-[10px] font-medium uppercase tracking-wider mt-1" style={{ color: tier.text }}>
            match
          </span>
        )}
      </div>
    </div>
  );
}

interface ScoreBadgeProps {
  score: number;
  size?: number;
}

// Compact ring used in list cards
export function ScoreBadge({ score, size = 44 }: ScoreBadgeProps) {
  const tier = getScoreTier(score);
  const strokeWidth = 4;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (Math.min(100, Math.max(0, score)) / 100) * circumference;

  return (
    <div className="relative inline-flex items-center justify-center shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke={tier.track} strokeWidth={strokeWidth} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={tier.color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </svg>
      <span className="absolute text-[11px] font-bold" style={{ color: tier.color }}>
        {score}
      </span>
    </div>
  );
}
