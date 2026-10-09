"use client";

import { useEffect, useRef, useState } from "react";

import MovieCard from "@/src/components/MovieCard";
import type { TmdbCatalogCategory, TmdbMovie } from "@/src/lib/tmdb";
import type { Locale } from "@/src/i18n/config";

type MovieRailProps = {
  movies: TmdbMovie[];
  mediaType: TmdbCatalogCategory;
  onPlay?: (movie: TmdbMovie) => void;
  autoAdvance?: boolean;
  layout?: "rail" | "grid";
  locale?: Locale;
};

export default function MovieRail({
  movies,
  mediaType,
  onPlay,
  autoAdvance = true,
  layout = "rail",
  locale = "en",
}: MovieRailProps) {
  const railRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);
  const isGrid = layout === "grid";

  useEffect(() => {
    if (isGrid || !autoAdvance || movies.length < 2 || isPaused) {
      return;
    }

    const interval = window.setInterval(() => {
      const rail = railRef.current;
      if (!rail) {
        return;
      }

      const firstCard = rail.firstElementChild;
      const cardWidth = firstCard?.getBoundingClientRect().width ?? rail.clientWidth;
      const gap = Number.parseFloat(getComputedStyle(rail).columnGap) || 0;
      const maxScrollLeft = rail.scrollWidth - rail.clientWidth;
      const nextPosition =
        rail.scrollLeft + cardWidth + gap >= maxScrollLeft - 2
          ? 0
          : rail.scrollLeft + cardWidth + gap;

      rail.scrollTo({ left: nextPosition, behavior: "smooth" });
    }, 7000);

    return () => window.clearInterval(interval);
  }, [autoAdvance, isGrid, isPaused, movies.length]);

  return (
    <div
      ref={railRef}
      className={isGrid ? "movie-grid" : "movie-rail"}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocus={() => setIsPaused(true)}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) {
          setIsPaused(false);
        }
      }}
    >
      {movies.map((movie) => (
        <div key={`${mediaType}-${movie.id}`} className="movie-rail__item">
          <MovieCard movie={movie} mediaType={mediaType} onPlay={onPlay} locale={locale} />
        </div>
      ))}
    </div>
  );
}
