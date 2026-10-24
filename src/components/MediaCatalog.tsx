"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import MediaCard from "@/src/components/MediaCard";
import MediaSkeleton from "@/src/components/MediaSkeleton";
import {
  getCatalogPage,
  type TmdbCatalogCategory,
  type TmdbCatalogSort,
  type TmdbMovie,
} from "@/src/lib/tmdb";
import { getMessages, type Locale } from "@/src/i18n/config";

type MediaCatalogProps = {
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

export default function MediaCatalog({
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
}: MediaCatalogProps) {
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
  
  console.log('📊 Catalog Debug:', {
    totalPages: catalogQuery.data?.pages.length,
    totalMovies: movies.length,
    uniqueMovies: uniqueMovies.length,
    category,
    sort,
  });
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
            <MediaSkeleton layout={autoAdvance ? "rail" : "grid"} />
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
            <>
              {autoAdvance ? (
                <Swiper
                  modules={[Autoplay]}
                  className="movie-rail [scrollbar-width:none]"
                  grabCursor
                  slidesPerView={2}
                  spaceBetween={16}
                  breakpoints={{
                    640: { slidesPerView: 2, spaceBetween: 16 },
                    768: { slidesPerView: 4, spaceBetween: 16 },
                    1024: { slidesPerView: 6, spaceBetween: 16 },
                  }}
                  loop={uniqueMovies.length > 1}
                  autoplay={
                    uniqueMovies.length > 1
                      ? {
                          delay: 3000,
                          disableOnInteraction: false,
                        }
                      : false
                  }
                  watchOverflow
                >
                  {uniqueMovies.map((movie) => (
                    <SwiperSlide key={`${category}-${movie.id}`} className="h-auto">
                      <MediaCard
                        movie={movie}
                        mediaType={category}
                        onPlay={onPlay}
                        locale={locale}
                      />
                    </SwiperSlide>
                  ))}
                </Swiper>
              ) : (
                <div className="-mx-2 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6">
                  {uniqueMovies.map((movie) => (
                    <div
                      key={`${category}-${movie.id}`}
                      className="mb-8 min-w-0 px-2"
                    >
                      <MediaCard
                        movie={movie}
                        mediaType={category}
                        onPlay={onPlay}
                        locale={locale}
                      />
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {showWatchMore && catalogQuery.hasNextPage && (
            <div className="mt-16 flex justify-center">
              <button
                type="button"
                className="btn-default px-8 py-2.5 text-base font-medium disabled:cursor-not-allowed disabled:opacity-50"
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
