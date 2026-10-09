"use client";

import { useEffect } from "react";

import { useUIStore } from "@/src/store/useUIStore";
import { useLocale } from "@/src/i18n/LocaleProvider";

export default function TrailerModal() {
  const trailerKey = useUIStore((state) => state.trailerKey);
  const closeTrailer = useUIStore((state) => state.closeTrailer);
  const { messages } = useLocale();

  useEffect(() => {
    if (!trailerKey) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeTrailer();
      }
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [closeTrailer, trailerKey]);

  if (!trailerKey) {
    return null;
  }

  return (
    <div
      aria-label={messages.trailerModal}
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm"
      role="dialog"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          closeTrailer();
        }
      }}
    >
      <div className="relative w-full max-w-6xl overflow-hidden rounded-lg bg-black shadow-2xl shadow-black/60">
        <button
          type="button"
          aria-label={messages.close}
          className="absolute right-3 top-3 z-10 rounded-full bg-black/70 px-3 py-1.5 text-sm font-semibold text-white transition-colors hover:bg-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          onClick={closeTrailer}
        >
          {messages.close}
        </button>
        <div className="aspect-video w-full">
          <iframe
            className="h-full w-full"
            src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1&rel=0`}
            title={messages.movieTrailer}
            allow="autoplay; encrypted-media; picture-in-picture"
            allowFullScreen
          />
        </div>
      </div>
    </div>
  );
}
