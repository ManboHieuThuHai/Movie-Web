"use client";

import { useUIStore } from "@/src/store/useUIStore";

type TrailerPreviewProps = {
  videoKey: string;
  title: string;
  watchLabel: string;
};

export default function TrailerPreview({
  videoKey,
  title,
  watchLabel,
}: TrailerPreviewProps) {
  const openTrailer = useUIStore((state) => state.openTrailer);

  return (
    <button
      type="button"
      aria-label={`${watchLabel}: ${title}`}
      className="group relative flex aspect-video w-full items-center justify-center overflow-hidden rounded-lg bg-black bg-cover bg-center shadow-xl shadow-black/30 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
      style={{
        backgroundImage: `url("https://img.youtube.com/vi/${encodeURIComponent(videoKey)}/hqdefault.jpg")`,
      }}
      onClick={() => openTrailer(videoKey)}
    >
      <span className="absolute inset-0 bg-black/40 transition-colors group-hover:bg-black/20" />
      <span
        aria-hidden="true"
        className="relative flex h-16 w-16 items-center justify-center rounded-full bg-primary text-white shadow-lg shadow-primary/40 transition-transform group-hover:scale-110"
      >
        <span className="ml-1 h-0 w-0 border-y-[10px] border-l-[14px] border-y-transparent border-l-white" />
      </span>
      <span className="sr-only">{watchLabel}</span>
    </button>
  );
}
