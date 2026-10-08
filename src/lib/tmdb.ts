const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const TMDB_API_KEY_ENV = "TMDB_API_READ_TOKEN";
const TMDB_IMAGE_BASE_URL = "https://image.tmdb.org/t/p";

export type TmdbImageSize = "w185" | "w500" | "original";

export type TmdbMovie = {
  id: number;
  title: string;
  original_title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  vote_average: number;
  vote_count: number;
  genre_ids?: number[];
};

type TmdbMovieList = {
  page: number;
  results: TmdbMovie[];
  total_pages: number;
  total_results: number;
};

type TmdbCatalogRawItem = Omit<TmdbMovie, "title" | "original_title" | "release_date"> & {
  title?: string;
  name?: string;
  original_title?: string;
  original_name?: string;
  release_date?: string;
  first_air_date?: string;
};

type TmdbCatalogResponse = Omit<TmdbMovieList, "results"> & {
  results: TmdbCatalogRawItem[];
};

type TmdbVideo = {
  id: string;
  key: string;
  name: string;
  site: string;
  size: number;
  type: string;
  official: boolean;
  published_at: string;
};

type TmdbCredits = {
  id: number;
  cast: Array<{
    id: number;
    name: string;
    character: string;
    profile_path: string | null;
  }>;
  crew: Array<{
    id: number;
    name: string;
    job: string;
    department: string;
    profile_path: string | null;
  }>;
};

type TmdbMovieDetails = TmdbMovie & {
  adult: boolean;
  budget: number;
  genres: Array<{ id: number; name: string }>;
  homepage: string | null;
  imdb_id: string | null;
  runtime: number | null;
  status: string;
  tagline: string | null;
  videos: { results: TmdbVideo[] };
  credits: TmdbCredits;
  similar: TmdbMovieList;
};

type TmdbTvDetailsResponse = Omit<
  TmdbMovieDetails,
  "title" | "original_title" | "release_date"
> & {
  name: string;
  original_name: string;
  first_air_date: string;
  number_of_seasons: number;
  number_of_episodes: number;
};

export type TmdbTvDetails = TmdbMovieDetails & {
  number_of_seasons: number;
  number_of_episodes: number;
};

type TmdbRequestParams = Record<string, string | number | undefined>;

export function getTmdbImageUrl(
  path: string | null,
  size: TmdbImageSize = "w500",
) {
  return path ? `${TMDB_IMAGE_BASE_URL}/${size}${path}` : null;
}

function getApiToken() {
  const token = process.env.TMDB_API_READ_TOKEN;

  if (!token) {
    throw new Error(`Missing ${TMDB_API_KEY_ENV} environment variable.`);
  }

  return token;
}

async function fetchTmdb<T>(
  path: string,
  params: TmdbRequestParams = {},
): Promise<T> {
  const isBrowser = typeof window !== "undefined";
  const url = isBrowser
    ? new URL("/api/tmdb", window.location.origin)
    : new URL(`${TMDB_BASE_URL}${path}`);

  if (isBrowser) {
    url.searchParams.set("path", path);
  }

  Object.entries({ language: "en-US", ...params }).forEach(
    ([key, value]) => {
      if (value !== undefined) {
        url.searchParams.set(key, String(value));
      }
    },
  );

  const response = await fetch(url, {
    headers: isBrowser
      ? { Accept: "application/json" }
      : {
          Accept: "application/json",
          Authorization: `Bearer ${getApiToken()}`,
        },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`TMDB request failed: ${response.status} ${response.statusText}`);
  }

  return response.json() as Promise<T>;
}

export function getPopular(page = 1) {
  return fetchTmdb<TmdbMovieList>("/movie/popular", { page });
}

export function getTrending(
  timeWindow: "day" | "week" = "week",
) {
  return fetchTmdb<TmdbMovieList>(`/trending/movie/${timeWindow}`);
}

export function getTopRated(page = 1) {
  return fetchTmdb<TmdbMovieList>("/movie/top_rated", { page });
}

export function searchMovies(query: string, page = 1) {
  return fetchTmdb<TmdbMovieList>("/search/movie", {
    query,
    page,
    include_adult: "false",
  });
}

export type TmdbCatalogCategory = "movie" | "tv";
export type TmdbCatalogSort = "popular" | "top_rated";

export async function getCatalogPage(
  category: TmdbCatalogCategory,
  page = 1,
  query = "",
  sort: TmdbCatalogSort = "popular",
): Promise<TmdbMovieList> {
  const normalizedQuery = query.trim();
  const path = normalizedQuery
    ? `/search/${category}`
    : `/${category}/${sort}`;
  const response = await fetchTmdb<TmdbCatalogResponse>(path, {
    page,
    ...(normalizedQuery ? { query: normalizedQuery, include_adult: "false" } : {}),
  });

  return {
    ...response,
    results: response.results.map((item) => ({
      ...item,
      title: item.title ?? item.name ?? "Untitled",
      original_title: item.original_title ?? item.original_name ?? "",
      release_date: item.release_date ?? item.first_air_date ?? "",
    })),
  };
}

export function getMovieDetails(movieId: number | string) {
  return fetchTmdb<TmdbMovieDetails>(`/movie/${movieId}`, {
    append_to_response: "videos,credits,similar",
  });
}

export async function getTvDetails(tvId: number | string) {
  const response = await fetchTmdb<TmdbTvDetailsResponse>(`/tv/${tvId}`, {
    append_to_response: "videos,credits,similar",
  });

  return {
    ...response,
    title: response.name,
    original_title: response.original_name,
    release_date: response.first_air_date,
  } satisfies TmdbTvDetails;
}

export type {
  TmdbCredits,
  TmdbMovieDetails,
  TmdbMovieList,
  TmdbVideo,
};
