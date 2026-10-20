import Catalog from "@/src/components/Catalog";
import HeroSlide from "@/src/components/HeroSlide";
import Link from "next/link";
import { notFound } from "next/navigation";

import { getMessages, isLocale, type Locale } from "@/src/i18n/config";
import {
  getPopular,
  type TmdbCatalogCategory,
  type TmdbCatalogSort,
  type TmdbMovie,
} from "@/src/lib/tmdb";

async function getHeroMovies(locale: Locale): Promise<TmdbMovie[]> {
  try {
    const popularMovies = (await getPopular(1, locale)).results;
    console.log('🎬 Hero Movies Debug:', {
      totalPopularMovies: popularMovies.length,
      locale
    });
    
    const featuredIds = [1423191, 1291595, 1148365, 1368337];
    const featuredMovies = featuredIds
      .map((id) => popularMovies.find((movie) => movie.id === id))
      .filter((movie): movie is TmdbMovie => movie !== undefined);

    return featuredMovies.length === featuredIds.length
      ? featuredMovies
      : popularMovies.slice(0, 4);
  } catch {
    return [];
  }
}

type HomePageProps = {
  params: Promise<{ locale: string }>;
};

export default async function LocalizedHome({ params }: HomePageProps) {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) notFound();
  const locale = rawLocale;
  const messages = getMessages(locale);
  const heroMovies = await getHeroMovies(locale);
  const sections: Array<{
    id: string;
    category: TmdbCatalogCategory;
    sort: TmdbCatalogSort;
    heading: string;
  }> = [
    {
      id: "movies",
      category: "movie",
      sort: "popular",
      heading: locale === "vi" ? "Phim nổi bật" : "Trending Movies",
    },
    {
      id: "top-rated-movies",
      category: "movie",
      sort: "top_rated",
      heading: locale === "vi" ? "Phim được đánh giá cao" : "Top Rated Movies",
    },
    {
      id: "tv-series",
      category: "tv",
      sort: "popular",
      heading: locale === "vi" ? "Phim truyền hình nổi bật" : "Trending TV",
    },
    {
      id: "top-rated-tv",
      category: "tv",
      sort: "top_rated",
      heading:
        locale === "vi"
          ? "Phim truyền hình được đánh giá cao"
          : "Top Rated TV",
    },
  ];

  return (
    <main id="home" className="min-h-screen bg-background text-foreground">
      {heroMovies.length > 0 ? (
        <HeroSlide movies={heroMovies} locale={locale} />
      ) : (
        <section className="flex min-h-[520px] items-end bg-gradient-to-br from-primary/30 via-background to-background px-6 pb-20 lg:px-10">
          <div className="site-shell">
            <p className="text-sm uppercase tracking-[0.24em] text-primary">
              theMovies
            </p>
            <h1 className="mt-3 font-heading text-7xl uppercase text-white">
              {messages.findSomething}
            </h1>
          </div>
        </section>
      )}
      <div className="bg-background px-4 py-8 md:px-8 md:py-16">
        <div className="mx-auto max-w-screen-2xl">
          {sections.map((section) => (
            <section
              key={section.id}
              id={section.id}
              className="scroll-mt-20 [&+section]:mt-8 md:[&+section]:mt-16"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-medium text-white md:text-2xl">
                  {section.heading}
                </h2>
                <Link
                  href={`/${locale}/${section.category}?type=${section.sort}`}
                  className="btn-default px-4 py-0 text-sm font-medium md:px-6 md:text-lg"
                >
                  {messages.viewMore}
                </Link>
              </div>
              <div className="mt-8">
                <Catalog
                  {...section}
                  locale={locale}
                  showSearch={false}
                  showHeader={false}
                  showWatchMore={false}
                  autoAdvance
                  compact
                />
              </div>
            </section>
          ))}
        </div>
      </div>
    </main>
  );
}
