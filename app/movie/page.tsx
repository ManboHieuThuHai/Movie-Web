import Catalog from "@/src/components/Catalog";

type MoviePageProps = {
  searchParams: Promise<{ type?: string }>;
};

export default async function MovieCatalogPage({ searchParams }: MoviePageProps) {
  const { type } = await searchParams;
  const sort = type === "top_rated" ? "top_rated" : "popular";

  return (
    <main className="min-h-screen bg-background pb-12 pt-28 text-foreground">
      <section className="site-shell pb-4">
        <h1 className="font-heading text-7xl uppercase text-white">Movies</h1>
      </section>
      <Catalog category="movie" sort={sort} />
    </main>
  );
}
