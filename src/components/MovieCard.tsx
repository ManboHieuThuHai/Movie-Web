"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import {
  getMovieDetails,
  getTmdbImageUrl,
  getTvDetails,
  type TmdbCatalogCategory,
  type TmdbMovie,
} from "@/src/lib/tmdb";
import type { Locale } from "@/src/i18n/config";
import { useUIStore } from "@/src/store/useUIStore";

type MovieCardProps = {
  movie: TmdbMovie;
  onPlay?: (movie: TmdbMovie) => void;
  mediaType?: TmdbCatalogCategory;
  locale?: Locale;
};

function PlayIcon() {
  return (
    <span
      aria-hidden="true"
      className="ml-1 h-0 w-0 border-y-[7px] border-l-[10px] border-y-transparent border-l-white"
    />
  );
}

export default function MovieCard({
  movie,
  onPlay,
  mediaType = "movie",
  locale = "en",
}: MovieCardProps) {
  const posterUrl = getTmdbImageUrl(movie.poster_path || movie.backdrop_path);

  const [isLoadingTrailer, setIsLoadingTrailer] = useState(false);
  const openTrailer = useUIStore((state) => state.openTrailer);

  const handlePlay = async () => {
    if (onPlay) {
      onPlay(movie);
      return;
    }

    setIsLoadingTrailer(true);
    try {
      const details =
        mediaType === "tv"
          ? await getTvDetails(movie.id, locale)
          : await getMovieDetails(movie.id, locale);
      const video = details.videos.results.find(
        (candidate) =>
          candidate.site === "YouTube" &&
          (candidate.type === "Trailer" || candidate.type === "Teaser"),
      );

      if (video) {
        openTrailer(video.key);
      }
    } catch (error) {
      console.error("Unable to load the movie trailer.", error);
      return;
    } finally {
      setIsLoadingTrailer(false);
    }
  };

  return (
    <article className="group/container min-w-0">
      <div className="group/poster relative h-72 overflow-hidden rounded-3xl bg-white/5 bg-cover bg-center bg-no-repeat after:absolute after:inset-0 after:rounded-3xl after:content-[''] after:bg-black/0 after:transition-colors after:duration-300 hover:after:bg-black/60 2xl:h-80">
        <Link
          href={`/${locale}/${mediaType}/${movie.id}`}
          aria-label={`${locale === "vi" ? "Mở" : "Open"} ${movie.title}`}
          className="absolute inset-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          {posterUrl ? (
            <Image
              src={posterUrl}
              alt={`${movie.title} poster`}
              fill
              className="object-cover"
              sizes="(max-width: 639px) 45vw, (max-width: 767px) 45vw, (max-width: 1023px) 23vw, 16vw"
            />
          ) : (
            <span className="flex h-full items-center justify-center px-4 text-center text-sm text-white/50">
              No poster available
            </span>
          )}
        </Link>

        <button
          type="button"
          aria-label={`${locale === "vi" ? "Phát" : "Play"} ${movie.title}`}
          disabled={isLoadingTrailer}
          className="absolute left-1/2 top-1/2 z-10 flex -translate-x-1/2 -translate-y-1/2 scale-50 items-center justify-center rounded-full bg-primary px-8 py-4 text-xl text-white opacity-0 shadow-btn transition-all duration-300 group-hover/poster:scale-100 group-hover/poster:opacity-100 hover:shadow-btn-hover focus-visible:scale-100 focus-visible:opacity-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white disabled:cursor-wait disabled:opacity-70"
          onClick={() => void handlePlay()}
        >
          <PlayIcon />
        </button>
      </div>

      <Link
        href={`/${locale}/${mediaType}/${movie.id}`}
        className="mt-4 block text-sm font-medium text-white transition-colors duration-300 ease-in-out group-hover/container:text-primary md:text-lg"
      >
        {movie.title}
      </Link>
    </article>
  );
}
