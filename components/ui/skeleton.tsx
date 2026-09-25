import { cn } from "@/lib/utils";

/** Soft blush shimmer used while data loads. */
export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn(
        "animate-pulse rounded-full bg-surface-container-high/70",
        className,
      )}
    />
  );
}

export function CardSkeleton() {
  return (
    <div className="flex flex-col gap-space-md rounded-[24px] bg-surface-container-lowest p-space-lg shadow-cozy">
      <div className="flex items-center gap-2">
        <Skeleton className="h-10 w-10" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-2/3 rounded-lg" />
          <Skeleton className="h-3 w-1/3 rounded-lg" />
        </div>
      </div>
      <Skeleton className="h-3 w-full rounded-lg" />
      <Skeleton className="h-3 w-5/6 rounded-lg" />
      <Skeleton className="h-3 w-4/6 rounded-lg" />
      <div className="mt-auto flex gap-2 pt-2">
        <Skeleton className="h-9 flex-1 rounded-full" />
        <Skeleton className="h-9 flex-1 rounded-full" />
      </div>
    </div>
  );
}

export function NoteGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 gap-space-lg md:grid-cols-2 2xl:grid-cols-3">
      {Array.from({ length: count }).map((_, index) => (
        <CardSkeleton key={index} />
      ))}
    </div>
  );
}

export function ListSkeleton({ rows = 4 }: { rows?: number }) {
  return (
    <div className="flex flex-col gap-2">
      {Array.from({ length: rows }).map((_, index) => (
        <Skeleton key={index} className="h-12 rounded-[18px]" />
      ))}
    </div>
  );
}
