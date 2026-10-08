"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

import {
  getCatalogPage,
  type TmdbCatalogCategory,
  type TmdbCatalogSort,
  type TmdbMovie,
} from "@/src/lib/tmdb";
import MovieRail from "@/src/components/MovieRail";

type CatalogProps = {
  category: TmdbCatalogCategory;
  sort?: TmdbCatalogSort;
  heading?: string;
  showSearch?: boolean;
  showHeader?: boolean;
  onPlay?: (movie: TmdbMovie) => void;
};

export default function Catalog({
  category,
  sort = "popular",
  heading,
  showSearch = true,
  showHeader = true,
  onPlay,
}: CatalogProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setDebouncedQuery(searchQuery.trim());
    }, 400);

    return () => window.clearTimeout(timeout);
  }, [searchQuery]);

  const catalogQuery = useInfiniteQuery({
    queryKey: ["catalog", category, sort, debouncedQuery],
    queryFn: ({ pageParam }) =>
      getCatalogPage(category, pageParam, debouncedQuery, sort),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.page < lastPage.total_pages ? lastPage.page + 1 : undefined,
  });

  const movies = catalogQuery.data?.pages.flatMap((page) => page.results) ?? [];
  const uniqueMovies = Array.from(
    new Map(movies.map((movie) => [movie.id, movie])).values(),
  );
  const title = category === "movie" ? "Movies" : "TV Series";
  const errorMessage =
    catalogQuery.error instanceof Error
      ? catalogQuery.error.message
      : "Unable to load the catalog.";

  return (
    <section className="site-shell py-12">
      {showHeader && (
        <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary">
            Browse
          </p>
          <h1 className="font-heading text-5xl uppercase text-white">
            {heading ?? title}
          </h1>
        </div>
        {showSearch && (
          <form
            className="flex w-full gap-2 sm:max-w-md"
            onSubmit={(event) => {
              event.preventDefault();
              setDebouncedQuery(searchQuery.trim());
            }}
          >
            <label className="min-w-0 flex-1">
              <span className="sr-only">Search {title}</span>
              <input
                type="search"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder={`Search ${title.toLowerCase()}...`}
                className="w-full rounded-full border border-white/15 bg-white/5 px-5 py-3 text-sm text-white outline-none transition-colors placeholder:text-white/40 focus:border-primary"
              />
            </label>
            <button
              type="submit"
              className="btn-glow rounded-full bg-primary px-5 py-3 text-sm font-bold text-white"
            >
              Search
            </button>
          </form>
        )}
        </div>
      )}

      {catalogQuery.isLoading && (
        <p className="py-12 text-center text-white/60">Loading {title.toLowerCase()}...</p>
      )}

      {catalogQuery.isError && (
        <p className="rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-200">
          {errorMessage}
        </p>
      )}

      {!catalogQuery.isLoading && !catalogQuery.isError && uniqueMovies.length === 0 && (
        <p className="py-12 text-center text-white/60">No results found.</p>
      )}

      {uniqueMovies.length > 0 && (
        <MovieRail movies={uniqueMovies} mediaType={category} onPlay={onPlay} />
      )}

      {catalogQuery.hasNextPage && (
        <div className="mt-10 flex justify-center">
          <button
            type="button"
            className="btn-glow rounded-full border border-primary px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-primary disabled:cursor-not-allowed disabled:opacity-60"
            disabled={catalogQuery.isFetchingNextPage}
            onClick={() => catalogQuery.fetchNextPage()}
          >
            {catalogQuery.isFetchingNextPage ? "Loading..." : "Load more"}
          </button>
        </div>
      )}
    </section>
  );
}
