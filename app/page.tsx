import Catalog from "@/src/components/Catalog";
import HeroSlide from "@/src/components/HeroSlide";
import { getPopular, type TmdbMovie } from "@/src/lib/tmdb";

async function getHeroMovies(): Promise<TmdbMovie[]> {
  try {
    const response = await getPopular();
    return response.results.slice(0, 6);
  } catch {
    return [];
  }
}

export default async function Home() {
  const heroMovies = await getHeroMovies();

  return (
    <main id="home" className="min-h-screen bg-background text-foreground">
      {heroMovies.length > 0 ? (
        <HeroSlide movies={heroMovies} />
      ) : (
        <section className="flex min-h-[520px] items-end bg-gradient-to-br from-primary/30 via-background to-background px-6 pb-20 lg:px-10">
          <div className="mx-auto w-full max-w-7xl">
            <p className="text-sm uppercase tracking-[0.24em] text-primary">
              theMovies
            </p>
            <h1 className="mt-3 font-heading text-7xl uppercase text-white">
              Find something worth watching.
            </h1>
          </div>
        </section>
      )}

      <section id="movies" className="scroll-mt-20">
        <Catalog category="movie" />
      </section>

      <section id="tv-series" className="scroll-mt-20">
        <Catalog category="tv" />
      </section>
    </main>
  );
}
