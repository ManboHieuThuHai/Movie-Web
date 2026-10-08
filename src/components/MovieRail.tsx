"use client";

import { useEffect, useRef, useState } from "react";

import MovieCard from "@/src/components/MovieCard";
import type { TmdbCatalogCategory, TmdbMovie } from "@/src/lib/tmdb";

type MovieRailProps = {
  movies: TmdbMovie[];
  mediaType: TmdbCatalogCategory;
  onPlay?: (movie: TmdbMovie) => void;
  autoAdvance?: boolean;
};

export default function MovieRail({
  movies,
  mediaType,
  onPlay,
  autoAdvance = true,
}: MovieRailProps) {
  const railRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (!autoAdvance || movies.length < 2 || isPaused) {
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
  }, [autoAdvance, isPaused, movies.length]);

  return (
    <div
      ref={railRef}
      className="movie-rail"
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
          <MovieCard movie={movie} mediaType={mediaType} onPlay={onPlay} />
        </div>
      ))}
    </div>
  );
}
