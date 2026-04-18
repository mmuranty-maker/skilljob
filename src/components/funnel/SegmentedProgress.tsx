interface SegmentedProgressProps {
  current: number; // 1..total
  total: number;
}

export function SegmentedProgress({ current, total }: SegmentedProgressProps) {
  const safeCurrent = Math.max(1, Math.min(current, total));
  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-1.5">
        {Array.from({ length: total }).map((_, i) => {
          const isComplete = i < safeCurrent - 1;
          const isActive = i === safeCurrent - 1;
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
        Step {safeCurrent} of {total}
      </span>
    </div>
  );
}
