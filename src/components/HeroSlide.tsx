"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

import {
  getMovieDetails,
  getTmdbImageUrl,
  type TmdbMovie,
} from "@/src/lib/tmdb";
import { useUIStore } from "@/src/store/useUIStore";

type HeroSlideProps = {
  movies: TmdbMovie[];
  onWatchNow?: (movie: TmdbMovie) => void;
  onWatchTrailer?: (movie: TmdbMovie) => void;
};

export default function HeroSlide({
  movies,
  onWatchNow,
  onWatchTrailer,
}: HeroSlideProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isLoadingTrailer, setIsLoadingTrailer] = useState(false);
  const openTrailer = useUIStore((state) => state.openTrailer);
  const safeIndex = movies.length > 0 ? activeIndex % movies.length : 0;
  const activeMovie = movies[safeIndex];
  const backdropUrl = activeMovie
    ? getTmdbImageUrl(activeMovie.backdrop_path, "original")
    : null;
  const posterUrl = activeMovie
    ? getTmdbImageUrl(activeMovie.poster_path)
    : null;

  const handleWatchTrailer = async () => {
    if (onWatchTrailer) {
      onWatchTrailer(activeMovie);
      return;
    }

    setIsLoadingTrailer(true);
    try {
      const details = await getMovieDetails(activeMovie.id);
      const video = details.videos.results.find(
        (candidate) =>
          candidate.site === "YouTube" &&
          (candidate.type === "Trailer" || candidate.type === "Teaser"),
      );

      if (video) {
        openTrailer(video.key);
      }
    } catch {
      return;
    } finally {
      setIsLoadingTrailer(false);
    }
  };

  useEffect(() => {
    if (movies.length <= 1) {
      return;
    }

    const interval = window.setInterval(() => {
      setActiveIndex((currentIndex) => (currentIndex + 1) % movies.length);
    }, 7000);

    return () => window.clearInterval(interval);
  }, [movies.length]);

  if (!activeMovie) {
    return null;
  }

  return (
    <section
      aria-label="Popular movies"
      className="relative isolate min-h-[620px] overflow-hidden bg-black"
    >
      {backdropUrl && (
        <Image
          key={activeMovie.id}
          src={backdropUrl}
          alt=""
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />
      )}
      <div className="absolute inset-0 -z-0 bg-gradient-to-r from-black via-black/85 to-black/30" />
      <div className="absolute inset-x-0 bottom-0 -z-0 h-48 bg-gradient-to-t from-background to-transparent" />

      <div className="site-shell relative z-10 flex min-h-[620px] items-center pb-20 pt-32">
        <div className="max-w-2xl">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.24em] text-primary">
            Popular movie
          </p>
          <h1 className="font-heading text-6xl uppercase leading-none text-white sm:text-8xl">
            {activeMovie.title}
          </h1>
          <p className="mt-6 line-clamp-3 max-w-xl text-sm leading-7 text-white/75 sm:text-base">
            {activeMovie.overview || "Discover your next favorite movie."}
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            {onWatchNow ? (
              <button
                type="button"
                className="btn-glow rounded-full bg-primary px-6 py-3 text-sm font-bold text-white"
                onClick={() => onWatchNow(activeMovie)}
              >
                Watch now
              </button>
            ) : (
              <Link
                href={`/movie/${activeMovie.id}`}
                className="btn-glow rounded-full bg-primary px-6 py-3 text-sm font-bold text-white"
              >
                Watch now
              </Link>
            )}
            <button
              type="button"
              disabled={isLoadingTrailer}
              className="rounded-full border border-white/30 bg-white/10 px-6 py-3 text-sm font-bold text-white backdrop-blur-sm transition-colors hover:bg-white/20 disabled:cursor-wait disabled:opacity-60"
              onClick={() => void handleWatchTrailer()}
            >
              {isLoadingTrailer ? "Loading..." : "Watch trailer"}
            </button>
          </div>
        </div>

        {posterUrl && (
          <div className="absolute bottom-16 right-8 hidden h-[390px] w-[260px] overflow-hidden rounded-lg shadow-2xl shadow-black/70 lg:block xl:right-20">
            <Image
              src={posterUrl}
              alt={`${activeMovie.title} poster`}
              fill
              className="object-cover"
              sizes="260px"
            />
          </div>
        )}
      </div>

    </section>
  );
}
