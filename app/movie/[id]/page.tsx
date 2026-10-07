import Image from "next/image";
import { notFound } from "next/navigation";

import MovieCard from "@/src/components/MovieCard";
import {
  getMovieDetails,
  getTmdbImageUrl,
  type TmdbMovieDetails,
} from "@/src/lib/tmdb";

type MoviePageProps = {
  params: Promise<{ id: string }>;
};

function formatRuntime(runtime: number | null) {
  if (!runtime) {
    return null;
  }

  const hours = Math.floor(runtime / 60);
  const minutes = runtime % 60;

  return `${hours}h ${minutes}m`;
}

async function loadMovie(movieId: string): Promise<TmdbMovieDetails> {
  const parsedId = Number(movieId);

  if (!Number.isInteger(parsedId) || parsedId <= 0) {
    notFound();
  }

  try {
    return await getMovieDetails(parsedId);
  } catch {
    notFound();
  }
}

export default async function MoviePage({ params }: MoviePageProps) {
  const { id } = await params;
  const movie = await loadMovie(id);
  const trailers = movie.videos.results.filter(
    (video) =>
      video.site === "YouTube" &&
      (video.type === "Trailer" || video.type === "Teaser"),
  );
  const runtime = formatRuntime(movie.runtime);
  const backdropUrl = getTmdbImageUrl(movie.backdrop_path, "original");
  const posterUrl = getTmdbImageUrl(movie.poster_path);
  const cast = movie.credits.cast.slice(0, 12).map((actor) => ({
    ...actor,
    profileUrl: getTmdbImageUrl(actor.profile_path, "w185"),
  }));

  return (
    <main className="min-h-screen bg-background pb-16 text-foreground">
      <section className="relative h-[55vh] min-h-[420px] overflow-hidden">
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
        <div className="absolute inset-0 bg-gradient-to-t from-background via-black/45 to-black/20" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-transparent" />
      </section>

      <div className="relative z-10 mx-auto -mt-36 max-w-7xl px-6 lg:px-10">
        <section className="grid gap-8 lg:grid-cols-[260px_1fr]">
          <div className="relative aspect-[2/3] w-48 overflow-hidden rounded-lg bg-white/5 shadow-2xl shadow-black/60 lg:w-full">
            {posterUrl ? (
              <Image
                src={posterUrl}
                alt={`${movie.title} poster`}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 192px, 260px"
              />
            ) : (
              <div className="flex h-full items-center justify-center p-4 text-center text-white/50">
                No poster available
              </div>
            )}
          </div>

          <div className="self-end pb-2">
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.24em] text-primary">
              Movie details
            </p>
            <h1 className="font-heading text-6xl uppercase leading-none text-white sm:text-8xl">
              {movie.title}
            </h1>
            {movie.tagline && (
              <p className="mt-4 text-lg italic text-white/70">{movie.tagline}</p>
            )}
            <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-sm text-white/65">
              {movie.release_date && <span>{movie.release_date.slice(0, 4)}</span>}
              {runtime && <span>{runtime}</span>}
              <span>{movie.vote_average.toFixed(1)} / 10</span>
              {movie.genres.length > 0 && (
                <span>{movie.genres.map((genre) => genre.name).join(" / ")}</span>
              )}
            </div>
            <p className="mt-6 max-w-3xl leading-7 text-white/75">
              {movie.overview || "No overview available."}
            </p>
          </div>
        </section>

        <section id="trailers" className="mt-16 scroll-mt-24">
          <h2 className="font-heading text-4xl uppercase text-white">Cast</h2>
          <div className="mt-6 flex gap-5 overflow-x-auto pb-4">
            {cast.map((actor) => (
              <div key={actor.id} className="w-24 shrink-0 text-center">
                <div className="relative mx-auto h-24 w-24 overflow-hidden rounded-full bg-white/10">
                  {actor.profileUrl ? (
                    <Image
                      src={actor.profileUrl}
                      alt={actor.name}
                      fill
                      className="object-cover"
                      sizes="96px"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-xs text-white/40">
                      No photo
                    </div>
                  )}
                </div>
                <p className="mt-3 truncate text-sm font-semibold text-white">
                  {actor.name}
                </p>
                <p className="truncate text-xs text-white/50">{actor.character}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-16">
          <h2 className="font-heading text-4xl uppercase text-white">Trailers</h2>
          {trailers.length > 0 ? (
            <div className="mt-6 grid gap-6 md:grid-cols-2">
              {trailers.map((video) => (
                <div key={video.id}>
                  <div className="aspect-video overflow-hidden rounded-lg bg-black shadow-xl shadow-black/30">
                    <iframe
                      className="h-full w-full"
                      src={`https://www.youtube.com/embed/${video.key}`}
                      title={video.name}
                      loading="lazy"
                      allow="autoplay; encrypted-media; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                  <p className="mt-3 truncate text-sm font-semibold text-white/80">
                    {video.name}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="mt-6 text-white/50">No trailers available.</p>
          )}
        </section>

        {movie.similar.results.length > 0 && (
          <section className="mt-16">
            <h2 className="font-heading text-4xl uppercase text-white">
              Similar movies
            </h2>
            <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
              {movie.similar.results.slice(0, 12).map((similarMovie) => (
                <MovieCard key={similarMovie.id} movie={similarMovie} />
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
