type MediaSkeletonProps = {
  count?: number;
  layout?: "rail" | "grid";
};

function MediaSkeletonCard() {
  return (
    <div
      className="animate-pulse motion-reduce:animate-none"
      aria-hidden="true"
    >
      <div className="aspect-[2/3] overflow-hidden rounded-lg bg-white/10" />
    </div>
  );
}

export default function MediaSkeleton({
  count = 6,
  layout = "grid",
}: MediaSkeletonProps) {
  return (
    <div
      className={
        layout === "grid"
          ? "grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-6"
          : "movie-rail [scrollbar-width:none] flex snap-x snap-proximity gap-4 overflow-x-auto overscroll-x-contain scroll-smooth motion-reduce:scroll-auto"
      }
      aria-label="Loading media"
      aria-busy="true"
    >
      {Array.from({ length: count }, (_, index) => (
        <div
          key={index}
          className={
            layout === "grid"
              ? "min-w-0"
              : "movie-rail__item min-w-0 shrink-0 basis-[calc((100%_-_1rem)/2)] snap-start md:basis-[calc((100%_-_3rem)/4)] lg:basis-[calc((100%_-_5rem)/6)]"
          }
        >
          <MediaSkeletonCard />
        </div>
      ))}
    </div>
  );
}
