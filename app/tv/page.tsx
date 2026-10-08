import Catalog from "@/src/components/Catalog";

type TvPageProps = {
  searchParams: Promise<{ type?: string }>;
};

export default async function TvCatalogPage({ searchParams }: TvPageProps) {
  const { type } = await searchParams;
  const sort = type === "top_rated" ? "top_rated" : "popular";

  return (
    <main className="min-h-screen bg-background pb-12 pt-28 text-foreground">
      <section className="site-shell pb-4">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary">
          Explore the collection
        </p>
        <h1 className="font-heading text-7xl uppercase text-white">TV Series</h1>
      </section>
      <Catalog category="tv" sort={sort} />
    </main>
  );
}
