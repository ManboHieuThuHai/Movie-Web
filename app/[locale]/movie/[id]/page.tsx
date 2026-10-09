import { notFound } from "next/navigation";
import MediaDetails from "@/src/components/MediaDetails";
import { getMovieDetails } from "@/src/lib/tmdb";
import { isLocale, type Locale } from "@/src/i18n/config";

export default async function MoviePage({ params }: { params: Promise<{ locale: string; id: string }> }) {
  const { locale: rawLocale, id } = await params;
  if (!isLocale(rawLocale)) notFound();
  const movieId = Number(id);
  if (!Number.isInteger(movieId) || movieId <= 0) notFound();
  let movie;
  try {
    movie = await getMovieDetails(movieId, rawLocale as Locale);
  } catch {
    notFound();
  }
  return <MediaDetails media={movie} mediaType="movie" locale={rawLocale as Locale} />;
}
