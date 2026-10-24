"use client";

import { Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import MediaCard from "@/src/components/MediaCard";
import type { TmdbCatalogCategory, TmdbMovie } from "@/src/lib/tmdb";
import type { Locale } from "@/src/i18n/config";

type MediaCarouselProps = {
  movies: TmdbMovie[];
  mediaType: TmdbCatalogCategory;
  onPlay?: (movie: TmdbMovie) => void;
  locale?: Locale;
};

/**
 * Simple carousel for displaying media items
 * Used in MediaDetails for similar movies/shows
 */
export default function MediaCarousel({
  movies,
  mediaType,
  onPlay,
  locale = "en",
}: MediaCarouselProps) {
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
      watchOverflow
    >
      {movies.map((movie) => (
        <SwiperSlide key={`${mediaType}-${movie.id}`} className="h-auto">
          <MediaCard
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
