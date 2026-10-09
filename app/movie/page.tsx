import { redirect } from "next/navigation";

export default async function MovieCatalogRedirect({
  searchParams,
}: {
  searchParams: Promise<{ type?: string }>;
}) {
  const { type } = await searchParams;
  redirect(`/en/movie${type ? `?type=${encodeURIComponent(type)}` : ""}`);
}
