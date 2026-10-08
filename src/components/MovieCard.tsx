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
import { useUIStore } from "@/src/store/useUIStore";

type MovieCardProps = {
  movie: TmdbMovie;
  onPlay?: (movie: TmdbMovie) => void;
  mediaType?: TmdbCatalogCategory;
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
}: MovieCardProps) {
  const posterUrl = getTmdbImageUrl(movie.poster_path);

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
          ? await getTvDetails(movie.id)
          : await getMovieDetails(movie.id);
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

  const playControl = (
    <button
      type="button"
      aria-label={`Play ${movie.title}`}
      disabled={isLoadingTrailer}
      className="absolute left-1/2 top-1/2 z-10 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-primary text-white opacity-0 shadow-lg shadow-primary/40 transition-all duration-300 hover:scale-110 group-hover:opacity-100 focus-visible:opacity-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white disabled:cursor-wait disabled:opacity-70"
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        void handlePlay();
      }}
    >
      <PlayIcon />
    </button>
  );

  return (
    <article className="group relative aspect-[2/3] overflow-hidden rounded-lg bg-white/5">
      {posterUrl ? (
        <Image
          src={posterUrl}
          alt={`${movie.title} poster`}
          fill
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-110"
          sizes="(max-width: 640px) 45vw, (max-width: 1024px) 25vw, 180px"
        />
      ) : (
        <div className="flex h-full items-center justify-center px-4 text-center text-sm text-white/50">
          No poster available
        </div>
      )}

      <Link
        href={`/${mediaType}/${movie.id}`}
        aria-label={`Open ${movie.title}`}
        className="absolute inset-0 z-[1]"
      />

      <div className="absolute inset-0 bg-black/45 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      {playControl}

      <div className="absolute inset-x-0 bottom-0 translate-y-2 bg-gradient-to-t from-black/90 to-transparent px-3 pb-3 pt-10 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
        <h2 className="truncate text-sm font-semibold text-white">{movie.title}</h2>
        <p className="mt-1 text-xs text-white/60">
          {movie.release_date?.slice(0, 4) || "Unknown year"}
        </p>
      </div>
    </article>
  );
}
