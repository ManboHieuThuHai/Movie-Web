import { notFound } from "next/navigation";

import MediaDetails from "@/src/components/MediaDetails";
import { isLocale, type Locale } from "@/src/i18n/config";
import {
  getMovieDetails,
  getTvDetails,
  isTmdbCatalogCategory,
  type TmdbCatalogCategory,
} from "@/src/lib/tmdb";

type MediaDetailsPageProps = {
  params: Promise<{ locale: string; category: string; id: string }>;
};

async function loadMediaDetails(
  category: TmdbCatalogCategory,
  mediaId: number,
  locale: Locale,
) {
  try {
    return category === "movie"
      ? await getMovieDetails(mediaId, locale)
      : await getTvDetails(mediaId, locale);
  } catch {
    notFound();
  }
}

export default async function MediaDetailsPage({
  params,
}: MediaDetailsPageProps) {
  const { locale: rawLocale, category, id } = await params;

  if (!isLocale(rawLocale) || !isTmdbCatalogCategory(category)) {
    notFound();
  }

  const mediaId = Number(id);
  if (!Number.isInteger(mediaId) || mediaId <= 0) {
    notFound();
  }

  const media = await loadMediaDetails(category, mediaId, rawLocale);
  return (
    <MediaDetails media={media} mediaType={category} locale={rawLocale} />
  );
}
