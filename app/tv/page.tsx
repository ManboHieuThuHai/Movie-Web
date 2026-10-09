import { redirect } from "next/navigation";

export default async function TvCatalogRedirect({
  searchParams,
}: {
  searchParams: Promise<{ type?: string }>;
}) {
  const { type } = await searchParams;
  redirect(`/en/tv${type ? `?type=${encodeURIComponent(type)}` : ""}`);
}
