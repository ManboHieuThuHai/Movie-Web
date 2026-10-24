"use client";

import { create } from "zustand";
import {
  getMovieDetails,
  getTvDetails,
  type TmdbCatalogCategory,
  type TmdbMovie,
} from "@/src/lib/tmdb";
import type { Locale } from "@/src/i18n/config";

type UIStore = {
  trailerKey: string | null;
  isLoadingTrailer: boolean;
  openTrailer: (trailerKey: string) => void;
  closeTrailer: () => void;
  playTrailer: (
    media: TmdbMovie,
    mediaType: TmdbCatalogCategory,
    locale: Locale
  ) => Promise<void>;
};

export const useUIStore = create<UIStore>((set) => ({
  trailerKey: null,
  isLoadingTrailer: false,
  openTrailer: (trailerKey) => set({ trailerKey }),
  closeTrailer: () => set({ trailerKey: null }),
  playTrailer: async (media, mediaType, locale) => {
    set({ isLoadingTrailer: true });
    try {
      const details =
        mediaType === "tv"
          ? await getTvDetails(media.id, locale)
          : await getMovieDetails(media.id, locale);

      const video = details.videos.results.find(
        (candidate) =>
          candidate.site === "YouTube" &&
          (candidate.type === "Trailer" || candidate.type === "Teaser")
      );

      if (video) {
        set({ trailerKey: video.key });
      }
    } catch (error) {
      console.error("Unable to load the trailer.", error);
    } finally {
      set({ isLoadingTrailer: false });
    }
  },
}));
