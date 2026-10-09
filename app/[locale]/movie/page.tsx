import Catalog from "@/src/components/Catalog";
import { isLocale, type Locale } from "@/src/i18n/config";
import { notFound } from "next/navigation";

export default async function MovieCatalogPage({ params, searchParams }: { params: Promise<{ locale: string }>; searchParams: Promise<{ type?: string }> }) {
  const [{ locale: rawLocale }, { type }] = await Promise.all([params, searchParams]);
  if (!isLocale(rawLocale)) notFound();
  const locale = rawLocale as Locale;
  return <main className="min-h-screen bg-background pb-12 pt-28 text-foreground"><section className="site-shell pb-4 text-center"><h1 className="font-heading text-7xl uppercase text-white">{locale === "vi" ? "Phim" : "Movies"}</h1></section><Catalog category="movie" sort={type === "top_rated" ? "top_rated" : "popular"} locale={locale} showHeader={false} /></main>;
}
