import Catalog from "@/src/components/Catalog";
import { isLocale } from "@/src/i18n/config";
import { isTmdbCatalogCategory } from "@/src/lib/tmdb";
import { notFound } from "next/navigation";

type CatalogPageProps = {
  params: Promise<{ locale: string; category: string }>;
  searchParams: Promise<{ keyword?: string; type?: string }>;
};

export default async function CatalogPage({
  params,
  searchParams,
}: CatalogPageProps) {
  const [
    { locale: rawLocale, category },
    { keyword, type },
  ] = await Promise.all([params, searchParams]);

  if (!isLocale(rawLocale) || !isTmdbCatalogCategory(category)) {
    notFound();
  }

  const title =
    category === "movie"
      ? rawLocale === "vi" ? "Phim" : "Movies"
      : rawLocale === "vi" ? "Phim truyền hình" : "TV Series";

  return (
    <main className="min-h-screen bg-background text-foreground">
      <section
        className="relative h-48 bg-cover bg-center bg-no-repeat after:absolute after:inset-0 after:content-[''] after:bg-gradient-to-t after:from-background after:to-transparent"
        style={{
          backgroundImage:
            "radial-gradient(ellipse at 50% 20%, rgb(255 0 0 / 0.14), transparent 58%), linear-gradient(135deg, #1c1c1c, #0f0f0f)",
        }}
      >
        <h1 className="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2 text-center text-4xl font-bold text-white md:translate-y-0">
          {title}
        </h1>
      </section>
      <Catalog
        key={keyword ?? ""}
        category={category}
        sort={type === "top_rated" ? "top_rated" : "popular"}
        locale={rawLocale}
        initialQuery={keyword ?? ""}
        showHeader={false}
      />
    </main>
  );
}
