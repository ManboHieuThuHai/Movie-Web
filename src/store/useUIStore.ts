"use client";

import { create } from "zustand";

type UIStore = {
  trailerKey: string | null;
  openTrailer: (trailerKey: string) => void;
  closeTrailer: () => void;
};

export const useUIStore = create<UIStore>((set) => ({
  trailerKey: null,
  openTrailer: (trailerKey) => set({ trailerKey }),
  closeTrailer: () => set({ trailerKey: null }),
}));
