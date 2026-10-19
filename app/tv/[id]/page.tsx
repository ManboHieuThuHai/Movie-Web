import { redirect } from "next/navigation";

export default async function TvDetailsRedirect({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  redirect(`/en/tv/${encodeURIComponent(id)}`);
}
