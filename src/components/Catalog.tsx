"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";

import {
  getCatalogPage,
  type TmdbCatalogCategory,
  type TmdbCatalogSort,
  type TmdbMovie,
} from "@/src/lib/tmdb";
import { getMessages, type Locale } from "@/src/i18n/config";
import MovieRail from "@/src/components/MovieRail";
import MovieSkeleton from "@/src/components/MovieSkeleton";

type CatalogProps = {
  category: TmdbCatalogCategory;
  sort?: TmdbCatalogSort;
  heading?: string;
  showSearch?: boolean;
  showHeader?: boolean;
  showWatchMore?: boolean;
  autoAdvance?: boolean;
  compact?: boolean;
  initialQuery?: string;
  locale?: Locale;
  onPlay?: (movie: TmdbMovie) => void;
};

export default function Catalog({
  category,
  sort = "popular",
  heading,
  showSearch = true,
  showHeader = true,
  showWatchMore = true,
  autoAdvance = false,
  compact = false,
  initialQuery = "",
  locale = "en",
  onPlay,
}: CatalogProps) {
  const router = useRouter();
  const messages = getMessages(locale);
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [activeQuery, setActiveQuery] = useState(initialQuery);

  const catalogQuery = useInfiniteQuery({
    queryKey: ["catalog", locale, category, sort, activeQuery],
    queryFn: ({ pageParam }) =>
      getCatalogPage(category, pageParam, activeQuery, sort, locale),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.page < lastPage.total_pages ? lastPage.page + 1 : undefined,
  });

  const movies = catalogQuery.data?.pages.flatMap((page) => page.results) ?? [];
  const uniqueMovies = Array.from(
    new Map(movies.map((movie) => [movie.id, movie])).values(),
  );
  const title =
    category === "movie"
      ? locale === "vi"
        ? "Phim"
        : "Movies"
      : locale === "vi"
        ? "Phim truyền hình"
        : "TV Series";
  const errorMessage =
    catalogQuery.error instanceof Error
      ? catalogQuery.error.message
      : "Unable to load the catalog.";
  const searchForm = showSearch && (
    <form
      className="flex w-full items-center gap-2 rounded-full bg-black md:w-fit"
      onSubmit={(event) => {
        event.preventDefault();
        const keyword = searchQuery.trim();
        setActiveQuery(keyword);
        router.push(
          keyword
            ? `/${locale}/${category}?keyword=${encodeURIComponent(keyword)}`
            : `/${locale}/${category}`,
        );
      }}
    >
      <label className="min-w-0 flex-1">
        <span className="sr-only">
          {locale === "vi" ? "Tìm kiếm" : "Search"} {title}
        </span>
        <input
          type="search"
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
          placeholder={
            locale === "vi"
              ? `Tìm kiếm ${title.toLowerCase()}...`
              : "Enter keyword"
          }
          className="w-full min-w-0 flex-1 rounded-full border-none bg-black px-6 py-2 text-white outline-none placeholder:text-white/50 md:w-96"
        />
      </label>
      <button
        type="submit"
        className="btn-primary btn-sm shrink-0 py-1 shadow-btn"
      >
        {locale === "vi" ? "Tìm kiếm" : "Search"}
      </button>
    </form>
  );

  return (
    <section
      className={
        showSearch
          ? "bg-background px-4 py-8 md:px-8 xl:p-16"
          : compact
            ? "py-0"
            : "site-shell py-12"
      }
    >
      <div className={showSearch ? "mx-auto max-w-screen-2xl" : undefined}>
        {showHeader && (
          <div className="mb-8">
            <h1 className="font-heading text-5xl uppercase text-white">
              {heading ?? title}
            </h1>
          </div>
        )}
        {searchForm && (
          <div className="mb-8 flex justify-start">{searchForm}</div>
        )}

        <div className={showSearch ? "mt-16" : undefined}>
          {catalogQuery.isLoading && (
            <MovieSkeleton layout={autoAdvance ? "rail" : "grid"} />
          )}

          {catalogQuery.isError && (
            <p className="rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-200">
              {locale === "vi" ? "Không thể tải danh sách." : errorMessage}
            </p>
          )}

          {!catalogQuery.isLoading &&
            !catalogQuery.isError &&
            uniqueMovies.length === 0 && (
              <p className="py-12 text-center text-white/60">
                {locale === "vi"
                  ? "Không tìm thấy kết quả."
                  : "No results found."}
              </p>
            )}

          {uniqueMovies.length > 0 && (
            <MovieRail
              movies={uniqueMovies}
              mediaType={category}
              onPlay={onPlay}
              autoAdvance={autoAdvance}
              layout={autoAdvance ? "rail" : "grid"}
              locale={locale}
            />
          )}

          {showWatchMore && catalogQuery.hasNextPage && (
            <div className="mt-10 flex justify-center">
              <button
                type="button"
                className="btn-default btn-sm shadow-btn disabled:cursor-not-allowed disabled:opacity-60"
                disabled={catalogQuery.isFetchingNextPage}
                onClick={() => catalogQuery.fetchNextPage()}
              >
                {catalogQuery.isFetchingNextPage
                  ? messages.loading
                  : messages.watchMore}
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
