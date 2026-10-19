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
      Boolean(video.key) &&
      (video.type === "Trailer" || video.type === "Teaser"),
  ).slice(0, 5);
  const cast = media.credits.cast.slice(0, 5).map((actor) => ({
    ...actor,
    profileUrl: getTmdbImageUrl(actor.profile_path),
  }));
  const backdropUrl = getTmdbImageUrl(media.backdrop_path, "original");
  const posterUrl = getTmdbImageUrl(
    media.poster_path || media.backdrop_path,
  );

  return (
    <main className="min-h-screen bg-background pb-16 text-foreground">
      <section className="relative isolate overflow-hidden bg-background px-4 py-12 md:px-8 md:pb-20 md:pt-32 lg:px-16">
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

              <div className="py-2 lg:py-4">
                <h2 className="text-xl font-medium text-white">{messages.casts}</h2>
                <div className="-mx-2 mt-1 flex flex-wrap">
                  {cast.map((actor) => (
                    <div key={actor.id} className="mb-1 w-28 px-2">
                      {actor.profileUrl ? (
                        <Image
                          src={actor.profileUrl}
                          alt={actor.name}
                          width={500}
                          height={750}
                          className="w-full rounded-xl"
                          sizes="112px"
                        />
                      ) : (
                        <div className="flex aspect-[2/3] items-center justify-center rounded-xl bg-white/10 text-xs text-white/40">
                          {messages.noPhoto}
                        </div>
                      )}
                      <span className="text-xs font-normal text-white md:text-sm">
                        {actor.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
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
                <TrailerPreview
                  videoKey={video.key}
                  title={video.name}
                  watchLabel={messages.watchTrailer}
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
            <h2 className="text-lg font-medium text-white md:text-2xl">
              {isTv ? messages.similarSeries : messages.similarMovies}
            </h2>
            <MovieRail
              movies={media.similar.results}
              mediaType={mediaType}
              autoAdvance
              locale={locale}
            />
          </section>
        )}
    </main>
  );
}
