"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Autoplay, EffectFade } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import {
  getMovieDetails,
  getTmdbImageUrl,
  type TmdbMovie,
} from "@/src/lib/tmdb";
import { useUIStore } from "@/src/store/useUIStore";
import type { Locale } from "@/src/i18n/config";

type HeroSlideProps = {
  movies: TmdbMovie[];
  onWatchNow?: (movie: TmdbMovie) => void;
  onWatchTrailer?: (movie: TmdbMovie) => void;
  locale?: Locale;
};

export default function HeroSlide({
  movies,
  onWatchNow,
  onWatchTrailer,
  locale = "en",
}: HeroSlideProps) {
  const [isInitialized, setIsInitialized] = useState(false);
  const openTrailer = useUIStore((state) => state.openTrailer);

  const handleWatchTrailer = async (movie: TmdbMovie) => {
    if (onWatchTrailer) {
      onWatchTrailer(movie);
      return;
    }

    try {
      const details = await getMovieDetails(movie.id, locale);
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
    }
  };

  if (movies.length === 0) {
    return null;
  }

  return (
    <section
      aria-label="Featured movies"
      className="relative isolate h-[25rem] overflow-hidden bg-black md:h-[36rem] lg:h-[52rem]"
    >
      <Swiper
        modules={[Autoplay, EffectFade]}
        className="absolute inset-0 z-0 h-full"
        onAfterInit={() => {
          requestAnimationFrame(() => setIsInitialized(true));
        }}
        effect="fade"
        fadeEffect={{ crossFade: true }}
        loop={movies.length > 1}
        autoplay={
          movies.length > 1
            ? { delay: 7000, disableOnInteraction: false }
            : false
        }
        speed={700}
      >
        {movies.map((movie) => {
          const backdropUrl = getTmdbImageUrl(movie.backdrop_path, "original");
          const posterUrl = getTmdbImageUrl(movie.poster_path);

          return (
            <SwiperSlide key={movie.id} className="h-full">
              {({ isActive }) => (
                <div
                  className="relative flex h-full items-center overflow-hidden bg-black bg-cover bg-center bg-no-repeat before:absolute before:inset-0 before:z-0 before:bg-black/60 before:content-['']"
                  style={
                    backdropUrl
                      ? { backgroundImage: `url("${backdropUrl}")` }
                      : undefined
                  }
                >
                  <div className="absolute inset-x-0 bottom-0 z-0 h-28 bg-gradient-to-t from-background to-transparent" />

                  <div className="site-shell relative z-10 flex h-fit w-full items-center justify-between px-4 py-12 md:px-12 md:py-32">
                    <div className="w-full px-4 lg:w-2/3">
                      <h1
                        className={`font-heading text-4xl font-bold leading-none text-white transition-all duration-700 ease-in-out delay-300 motion-reduce:transition-none motion-reduce:delay-0 ${
                          isActive && isInitialized
                            ? "translate-y-0 opacity-100"
                            : "-translate-y-24 opacity-0"
                        } md:text-6xl lg:text-8xl`}
                      >
                        {movie.title}
                      </h1>
                      <p
                        className={`my-12 text-xs font-medium text-white transition-all duration-700 ease-in-out delay-[600ms] motion-reduce:transition-none motion-reduce:delay-0 md:text-xl ${
                          isActive && isInitialized
                            ? "translate-y-0 opacity-100"
                            : "-translate-y-24 opacity-0"
                        }`}
                      >
                        {movie.overview || "Discover your next favorite movie."}
                      </p>
                      <div
                        className={`flex flex-wrap gap-4 transition-all duration-700 ease-in-out delay-[900ms] motion-reduce:transition-none motion-reduce:delay-0 ${
                          isActive && isInitialized
                            ? "translate-y-0 opacity-100"
                            : "-translate-y-24 opacity-0"
                        }`}
                      >
                        {onWatchNow ? (
                          <button
                            type="button"
                            className="btn-primary btn-lg shadow-btn"
                            onClick={() => onWatchNow(movie)}
                          >
                            {locale === "vi" ? "Xem ngay" : "Watch now"}
                          </button>
                        ) : (
                          <Link
                            href={`/${locale}/movie/${movie.id}`}
                            className="btn-primary btn-lg shadow-btn"
                          >
                            {locale === "vi" ? "Xem ngay" : "Watch now"}
                          </Link>
                        )}
                        <button
                          type="button"
                          className="btn-default btn-lg shadow-btn backdrop-blur-sm"
                          onClick={() => void handleWatchTrailer(movie)}
                        >
                          {locale === "vi" ? "Xem trailer" : "Watch trailer"}
                        </button>
                      </div>
                    </div>

                    {posterUrl && (
                      <div
                        className={`relative hidden px-4 lg:block lg:w-1/3 transition-all duration-700 ease-in-out delay-[600ms] motion-reduce:transition-none motion-reduce:delay-0 ${
                          isActive && isInitialized
                            ? "translate-y-0 opacity-100"
                            : "-translate-y-24 opacity-0"
                        }`}
                      >
                        <div className="relative h-[390px] w-96 max-w-full overflow-hidden rounded-3xl shadow-2xl shadow-black/70">
                          <Image
                            src={posterUrl}
                            alt={`${movie.title} poster`}
                            fill
                            className="object-cover"
                            sizes="(max-width: 1279px) 30vw, 384px"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </SwiperSlide>
          );
        })}
      </Swiper>
    </section>
  );
}
