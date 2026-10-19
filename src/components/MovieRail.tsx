"use client";

import { Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

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
  const isGrid = layout === "grid";

  if (isGrid) {
    return (
      <div className="-mx-2 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6">
        {movies.map((movie) => (
          <div
            key={`${mediaType}-${movie.id}`}
            className="mb-8 min-w-0 px-2"
          >
            <MovieCard
              movie={movie}
              mediaType={mediaType}
              onPlay={onPlay}
              locale={locale}
            />
          </div>
        ))}
      </div>
    );
  }

  return (
    <Swiper
      modules={[Autoplay]}
      className="movie-rail [scrollbar-width:none]"
      grabCursor
      slidesPerView={2}
      spaceBetween={16}
      breakpoints={{
        640: { slidesPerView: 2, spaceBetween: 16 },
        768: { slidesPerView: 4, spaceBetween: 16 },
        1024: { slidesPerView: 6, spaceBetween: 16 },
      }}
      loop={movies.length > 1}
      autoplay={
        autoAdvance && movies.length > 1
          ? {
              delay: 3000,
              disableOnInteraction: false,
            }
          : false
      }
      watchOverflow
    >
      {movies.map((movie) => (
        <SwiperSlide key={`${mediaType}-${movie.id}`} className="h-auto">
          <MovieCard
            movie={movie}
            mediaType={mediaType}
            onPlay={onPlay}
            locale={locale}
          />
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
