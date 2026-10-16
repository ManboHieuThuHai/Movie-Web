type MovieSkeletonProps = {
  count?: number;
  layout?: "rail" | "grid";
};

function MovieSkeletonCard() {
  return (
    <div
      className="movie-rail__item animate-pulse motion-reduce:animate-none"
      aria-hidden="true"
    >
      <div className="aspect-[2/3] overflow-hidden rounded-lg bg-white/10" />
    </div>
  );
}

export default function MovieSkeleton({
  count = 6,
  layout = "grid",
}: MovieSkeletonProps) {
  return (
    <div
      className={layout === "grid" ? "movie-grid" : "movie-rail"}
      aria-label="Loading movies"
      aria-busy="true"
    >
      {Array.from({ length: count }, (_, index) => (
        <MovieSkeletonCard key={index} />
      ))}
    </div>
  );
}
