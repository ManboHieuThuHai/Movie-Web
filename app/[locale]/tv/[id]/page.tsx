import { notFound } from "next/navigation";
import MediaDetails from "@/src/components/MediaDetails";
import { getTvDetails } from "@/src/lib/tmdb";
import { isLocale, type Locale } from "@/src/i18n/config";

export default async function TvPage({ params }: { params: Promise<{ locale: string; id: string }> }) {
  const { locale: rawLocale, id } = await params;
  if (!isLocale(rawLocale)) notFound();
  const tvId = Number(id);
  if (!Number.isInteger(tvId) || tvId <= 0) notFound();
  let series;
  try {
    series = await getTvDetails(tvId, rawLocale as Locale);
  } catch {
    notFound();
  }
  return <MediaDetails media={series} mediaType="tv" locale={rawLocale as Locale} />;
}
