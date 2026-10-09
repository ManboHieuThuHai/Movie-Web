"use client";

import { useLocale } from "@/src/i18n/LocaleProvider";

export default function Loading() {
  const { messages } = useLocale();
  return (
    <main className="flex min-h-screen items-center justify-center bg-background text-white">
      <p className="font-heading text-4xl uppercase tracking-wide text-primary">
        {messages.loading} theMovies...
      </p>
    </main>
  );
}
