interface SegmentedProgressProps {
  current: number; // 1-based
  total: number;
}

export function SegmentedProgress({ current, total }: SegmentedProgressProps) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-1.5">
        {Array.from({ length: total }).map((_, i) => {
          const isComplete = i < current;
          const isActive = i === current - 1;
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
        Step {Math.min(current, total)} of {total}
      </span>
    </div>
  );
}
