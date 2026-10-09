"use client";

import Link from "next/link";
import { useLocale } from "@/src/i18n/LocaleProvider";

export default function NotFound() {
  const { locale, messages } = useLocale();
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-5 bg-background px-6 text-center text-white">
      <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary">
        404
      </p>
      <h1 className="font-heading text-6xl uppercase">{messages.titleNotFound}</h1>
      <Link
        href={`/${locale}`}
        className="btn-glow rounded-full bg-primary px-6 py-3 text-sm font-bold"
      >
        {messages.backHome}
      </Link>
    </main>
  );
}
