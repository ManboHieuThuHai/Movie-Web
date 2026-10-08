import Link from "next/link";

import Catalog from "@/src/components/Catalog";
import HeroSlide from "@/src/components/HeroSlide";
import {
  getPopular,
  type TmdbCatalogCategory,
  type TmdbCatalogSort,
  type TmdbMovie,
} from "@/src/lib/tmdb";

async function getHeroMovies(): Promise<TmdbMovie[]> {
  try {
    const response = await getPopular();
    return response.results.slice(0, 6);
  } catch {
    return [];
  }
}

type CatalogSectionProps = {
  id: string;
  category: TmdbCatalogCategory;
  sort: TmdbCatalogSort;
  heading: string;
};

function CatalogSection({
  id,
  category,
  sort,
  heading,
}: CatalogSectionProps) {
  const path = `/${category}?type=${sort}`;

  return (
    <section id={id} className="scroll-mt-20">
      <div className="site-shell flex items-end justify-between pt-12">
        <h2 className="font-heading text-4xl uppercase text-white">{heading}</h2>
        <Link
          href={path}
          className="text-sm font-semibold text-primary transition-colors hover:text-white"
        >
          View more
        </Link>
      </div>
      <Catalog
        category={category}
        sort={sort}
        heading={heading}
        showSearch={false}
        showHeader={false}
      />
    </section>
  );
}

export default async function Home() {
  const heroMovies = await getHeroMovies();

  return (
    <main id="home" className="min-h-screen bg-background text-foreground">
      {heroMovies.length > 0 ? (
        <HeroSlide movies={heroMovies} />
      ) : (
        <section className="flex min-h-[520px] items-end bg-gradient-to-br from-primary/30 via-background to-background px-6 pb-20 lg:px-10">
          <div className="site-shell">
            <p className="text-sm uppercase tracking-[0.24em] text-primary">
              theMovies
            </p>
            <h1 className="mt-3 font-heading text-7xl uppercase text-white">
              Find something worth watching.
            </h1>
          </div>
        </section>
      )}

      <CatalogSection
        id="movies"
        category="movie"
        sort="popular"
        heading="Trending Movies"
      />
      <CatalogSection
        id="top-rated-movies"
        category="movie"
        sort="top_rated"
        heading="Top Rated Movies"
      />
      <CatalogSection
        id="tv-series"
        category="tv"
        sort="popular"
        heading="Trending TV Series"
      />
      <CatalogSection
        id="top-rated-tv"
        category="tv"
        sort="top_rated"
        heading="Top Rated TV Series"
      />
    </main>
  );
}
