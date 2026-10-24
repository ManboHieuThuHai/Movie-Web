"use client";

import { useLocale } from "@/src/i18n/LocaleProvider";
import MediaSkeleton from "@/src/components/MediaSkeleton";

export default function Loading() {
  const { messages } = useLocale();
  return (
    <main
      className="min-h-screen bg-background text-white"
      aria-label={messages.loading}
      aria-busy="true"
    >
      <section className="relative min-h-[620px] overflow-hidden bg-black/40">
        <div className="absolute inset-0 bg-gradient-to-r from-white/10 via-white/5 to-transparent" />
        <div className="site-shell relative flex min-h-[620px] items-center pb-20 pt-32">
          <div className="w-full max-w-2xl space-y-5">
            <div className="h-4 w-32 animate-pulse rounded bg-primary/40 motion-reduce:animate-none" />
            <div className="h-20 w-4/5 animate-pulse rounded bg-white/10 motion-reduce:animate-none" />
            <div className="h-5 w-full max-w-xl animate-pulse rounded bg-white/10 motion-reduce:animate-none" />
            <div className="h-5 w-4/5 max-w-xl animate-pulse rounded bg-white/10 motion-reduce:animate-none" />
            <div className="h-12 w-36 animate-pulse rounded-full bg-white/10 motion-reduce:animate-none" />
          </div>
        </div>
      </section>
      {[0, 1, 2].map((section) => (
        <section key={section} className="site-shell py-12">
          <div className="mb-8 h-10 w-64 animate-pulse rounded bg-white/10 motion-reduce:animate-none" />
          <MediaSkeleton layout="rail" />
        </section>
      ))}
    </main>
  );
}
