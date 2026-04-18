interface SegmentedProgressProps {
  current: number; // 0-based for warm-up, 1..total for real steps
  total: number;
  warmup?: boolean; // when true, render "Step 0 — warm-up" and show no filled segments
}

export function SegmentedProgress({ current, total, warmup = false }: SegmentedProgressProps) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-1.5">
        {Array.from({ length: total }).map((_, i) => {
          const isComplete = !warmup && i < current;
          const isActive = !warmup && i === current - 1;
          return (
            <div
              key={i}
              className={`h-2.5 w-2.5 rounded-full transition-all duration-300 ${
                isComplete
                  ? "bg-primary"
                  : isActive
                  ? "bg-primary/40 ring-2 ring-primary/30"
                  : "bg-muted"
              }`}
            />
          );
        })}
      </div>
      <span className="text-sm font-medium text-muted-foreground whitespace-nowrap">
        {warmup ? "Step 0 — warm-up" : `Step ${Math.min(current, total)} of ${total}`}
      </span>
    </div>
  );
}
