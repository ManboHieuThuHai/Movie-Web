import { redirect } from "next/navigation";

export default async function MovieDetailsRedirect({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  redirect(`/en/movie/${encodeURIComponent(id)}`);
}
