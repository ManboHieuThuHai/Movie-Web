import Link from "next/link";
import HeroSlide from "@/src/components/HeroSlide";
import Catalog from "@/src/components/Catalog";
import { getPopular, type TmdbCatalogCategory, type TmdbCatalogSort, type TmdbMovie } from "@/src/lib/tmdb";
import { getMessages, isLocale, type Locale } from "@/src/i18n/config";
import { notFound } from "next/navigation";

async function getHeroMovies(locale: Locale): Promise<TmdbMovie[]> {
  try {
    return (await getPopular(1, locale)).results.slice(0, 6);
  } catch {
    return [];
  }
}

export default async function LocalizedHome({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) notFound();
  const locale = rawLocale;
  const messages = getMessages(locale);
  const heroMovies = await getHeroMovies(locale);
  const sections: Array<{ id: string; category: TmdbCatalogCategory; sort: TmdbCatalogSort; heading: string }> = [
    { id: "movies", category: "movie", sort: "popular", heading: locale === "vi" ? "Phim nổi bật" : "Trending Movies" },
    { id: "top-rated-movies", category: "movie", sort: "top_rated", heading: locale === "vi" ? "Phim được đánh giá cao" : "Top Rated Movies" },
    { id: "tv-series", category: "tv", sort: "popular", heading: locale === "vi" ? "Phim truyền hình nổi bật" : "Trending TV Series" },
    { id: "top-rated-tv", category: "tv", sort: "top_rated", heading: locale === "vi" ? "Phim truyền hình được đánh giá cao" : "Top Rated TV Series" },
  ];

  return (
    <main id="home" className="min-h-screen bg-background text-foreground">
      {heroMovies.length > 0 ? <HeroSlide movies={heroMovies} locale={locale} /> : (
        <section className="flex min-h-[520px] items-end bg-gradient-to-br from-primary/30 via-background to-background px-6 pb-20 lg:px-10">
          <div className="site-shell"><p className="text-sm uppercase tracking-[0.24em] text-primary">theMovies</p><h1 className="mt-3 font-heading text-7xl uppercase text-white">{messages.findSomething}</h1></div>
        </section>
      )}
      {sections.map((section) => (
        <section key={section.id} id={section.id} className="scroll-mt-20">
          <div className="site-shell flex items-end justify-between pt-12">
            <h2 className="font-heading text-4xl uppercase text-white">{section.heading}</h2>
            <Link href={`/${locale}/${section.category}?type=${section.sort}`} className="text-sm font-semibold text-primary transition-colors hover:text-white">{messages.viewMore}</Link>
          </div>
          <Catalog {...section} locale={locale} showSearch={false} showHeader={false} showLoadMore={false} autoAdvance />
        </section>
      ))}
    </main>
  );
}
