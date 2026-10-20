"use client";

import Image from "next/image";

import MovieRail from "@/src/components/MovieRail";
import TrailerPreview from "@/src/components/TrailerPreview";
import { getMessages, type Locale } from "@/src/i18n/config";
import {
  getTmdbImageUrl,
  type TmdbCatalogCategory,
  type TmdbMovieDetails,
  type TmdbTvDetails,
} from "@/src/lib/tmdb";

type MediaDetailsProps = {
  media: TmdbMovieDetails | TmdbTvDetails;
  mediaType: TmdbCatalogCategory;
  locale?: Locale;
};

export default function MediaDetails({ media, mediaType, locale = "en" }: MediaDetailsProps) {
  const messages = getMessages(locale);
  const isTv = mediaType === "tv";
  
  const trailers = media.videos.results.filter(
    (video) =>
      video.site === "YouTube" &&
      Boolean(video.key),
      // Xóa filter type để hiển thị TẤT CẢ videos (không chỉ Trailer/Teaser)
  );
  const cast = media.credits.cast.slice(0, 20).map((actor) => ({
    ...actor,
    profileUrl: getTmdbImageUrl(actor.profile_path),
  }));
  const backdropUrl = getTmdbImageUrl(media.backdrop_path, "original");
  const posterUrl = getTmdbImageUrl(
    media.poster_path || media.backdrop_path,
  );

  // DEBUG
  console.log('🎬 MediaDetails:', {
    movieId: media.id,
    trailersCount: trailers.length,
    trailerNames: trailers.map(v => v.name),
    totalVideos: media.videos.results.length,
    allVideos: media.videos.results.map(v => ({ type: v.type, name: v.name })),
  });

  return (
    <main className="min-h-screen bg-background pb-16 text-foreground" suppressHydrationWarning>
      <section className="relative isolate overflow-hidden bg-background px-4 py-12 md:px-8 md:pb-20 md:pt-32 lg:px-16" suppressHydrationWarning>
        {backdropUrl && (
          <Image
            src={backdropUrl}
            alt=""
            fill
            priority
            className="object-cover object-center"
            sizes="100vw"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-black/50 to-black/30" />
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-background" />

        <div className="relative mx-auto max-w-screen-2xl">
          <div className="-mx-4 flex max-h-fit items-start">
            <div className="hidden w-64 px-4 md:block lg:w-96">
              {posterUrl ? (
                <Image
                  src={posterUrl}
                  alt=""
                  width={500}
                  height={750}
                  className="w-full rounded-3xl"
                  sizes="(max-width: 1023px) 256px, 384px"
                />
              ) : (
                <div className="aspect-[2/3] w-full rounded-3xl bg-white/10" />
              )}
            </div>

            <div className="-my-2 flex flex-1 flex-col justify-between px-4 lg:-my-4">
              <h1 className="py-2 text-3xl font-bold text-white lg:py-4 md:text-5xl lg:text-7xl">
                {media.title}
              </h1>

              <div className="-mx-1 flex flex-wrap items-center py-4">
                {media.genres.map((genre) => (
                  <div key={genre.id} className="mb-4 px-1">
                    <span className="rounded-full border-2 border-white bg-black px-4 py-1 text-xs text-white lg:text-sm">
                      {genre.name}
                    </span>
                  </div>
                ))}
              </div>

              <p className="py-2 text-xs text-white md:py-4 md:text-sm lg:text-base">
                {media.overview || messages.noOverview}
              </p>

              {/* Cast section - nằm trong content bên phải */}
              {cast.length > 0 && (
                <div className="py-2 lg:py-4">
                  <h3 className="text-white text-xl font-medium">
                    {messages.casts}
                  </h3>
                  <div className="flex flex-wrap -mx-2 mt-1">
                    {cast.slice(0, 5).map((actor) => (
                      <div key={actor.id} className="w-28 px-2 mb-1">
                        {actor.profileUrl ? (
                          <Image
                            src={actor.profileUrl}
                            alt={actor.name}
                            width={112}
                            height={168}
                            className="rounded-xl w-full"
                            sizes="112px"
                          />
                        ) : (
                          <div className="aspect-[2/3] rounded-xl bg-white/10 flex items-center justify-center text-xs text-white/40">
                            ?
                          </div>
                        )}
                        <span className="text-white text-xs md:text-sm font-sm">
                          {actor.name}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <section
        id="trailers"
        className="relative mx-auto mt-4 max-w-screen-2xl px-4 md:px-8 lg:px-16"
      >
        {trailers.length > 0 ? (
          <div className="space-y-16">
            {trailers.map((video) => (
              <div key={video.id}>
                <h2 className="mb-4 text-base font-semibold text-white md:text-2xl">
                  {video.name}
                </h2>
                <iframe
                  src={`https://www.youtube.com/embed/${video.key}`}
                  title={video.name}
                  width="100%"
                  height="800"
                  className="rounded-lg"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            ))}
          </div>
        ) : (
          <p className="text-white/50">{messages.noTrailers}</p>
        )}
      </section>

        {media.similar.results.length > 0 && (
          <section className="mx-auto mt-16 max-w-screen-2xl px-4 md:px-8 lg:px-16">
            <h2 className="mb-6 text-lg font-medium text-white md:text-2xl">
              {isTv ? messages.similarSeries : messages.similarMovies}
            </h2>
            <MovieRail
              movies={media.similar.results}
              mediaType={mediaType}
              autoAdvance={false}
              locale={locale}
            />
          </section>
        )}
    </main>
  );
}
