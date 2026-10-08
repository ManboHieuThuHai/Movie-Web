import { notFound } from "next/navigation";

import MediaDetails from "@/src/components/MediaDetails";
import { getMovieDetails } from "@/src/lib/tmdb";

type MoviePageProps = {
  params: Promise<{ id: string }>;
};

async function loadMovie(movieId: number) {
  try {
    return await getMovieDetails(movieId);
  } catch {
    notFound();
  }
}

export default async function MoviePage({ params }: MoviePageProps) {
  const { id } = await params;
  const movieId = Number(id);

  if (!Number.isInteger(movieId) || movieId <= 0) {
    notFound();
  }

  const movie = await loadMovie(movieId);
  return <MediaDetails media={movie} mediaType="movie" />;
}
