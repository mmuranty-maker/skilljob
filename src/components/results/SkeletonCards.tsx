import { Skeleton } from "@/components/ui/skeleton";

export function SkeletonCards() {
  return (
    <div className="divide-y divide-[hsl(220,13%,91%)]">
      {[1, 2, 3].map((i) => (
        <div key={i} className="px-4 py-4">
          <div className="flex gap-3">
            <Skeleton className="h-9 w-9 rounded-full shrink-0" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
              <div className="flex gap-2 mt-2">
                <Skeleton className="h-5 w-16 rounded-full" />
                <Skeleton className="h-5 w-16 rounded-full" />
                <Skeleton className="h-5 w-16 rounded-full" />
              </div>
              <Skeleton className="h-3 w-1/3 mt-1" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
