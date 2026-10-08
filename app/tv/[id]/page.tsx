import { notFound } from "next/navigation";

import MediaDetails from "@/src/components/MediaDetails";
import { getTvDetails } from "@/src/lib/tmdb";

type TvPageProps = {
  params: Promise<{ id: string }>;
};

async function loadSeries(tvId: number) {
  try {
    return await getTvDetails(tvId);
  } catch {
    notFound();
  }
}

export default async function TvPage({ params }: TvPageProps) {
  const { id } = await params;
  const tvId = Number(id);

  if (!Number.isInteger(tvId) || tvId <= 0) {
    notFound();
  }

  const series = await loadSeries(tvId);
  return <MediaDetails media={series} mediaType="tv" />;
}
