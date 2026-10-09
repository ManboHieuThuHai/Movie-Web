"use client";

import Link from "next/link";
import { useLocale } from "@/src/i18n/LocaleProvider";

const footerPosters = [
  "/q6y0Go1tsGEsmtFryDOJo3dEmqu.jpg",
  "/8UlWHLMpgZm9bx6QYh0NFoq67TZ.jpg",
  "/1XDDXPXGiI8id7MrUxK36ke7gkX.jpg",
  "/p1F51Lvj3sMopG948F5HsBf8w3J.jpg",
  "/5P8SmMzSNYJ8dtB7z0GfHf4dKq.jpg",
  "/7WsyChQLEftFiDOVTGkv3hFpyyt.jpg",
  "/rAiYT9aN9H5c3a7xYf7d4mXvQ.jpg",
  "/vQ3kzWk7m2Z8e6n1P4s5d0f9gH.jpg",
];

export default function Footer() {
  const { locale, messages } = useLocale();
  const footerColumns = [
    [messages.home, messages.live, messages.mustWatch],
    [messages.contactUs, messages.faq, messages.recentRelease],
    [messages.terms, messages.premium, messages.topImdb, messages.aboutUs, messages.privacy],
  ];
  return (
    <footer className="relative isolate min-h-[380px] overflow-hidden border-t border-white/10 bg-black px-6 py-14 text-white lg:px-10">
      <div className="absolute inset-0 -z-10 grid grid-cols-2 opacity-25 sm:grid-cols-4">
        {footerPosters.map((posterPath, index) => (
          <div
            key={`${posterPath}-${index}`}
            className="bg-cover bg-center grayscale"
            style={{
              backgroundImage: `url(https://image.tmdb.org/t/p/w342${posterPath})`,
            }}
          />
        ))}
      </div>
      <div className="absolute inset-0 -z-10 bg-black/80" />
      <div className="site-shell relative">
        <Link href={`/${locale}`} className="mx-auto flex w-fit items-center gap-3 text-white">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-xl font-bold">
            H
          </span>
          <span className="font-heading text-4xl uppercase">
            the<span className="text-primary">Movies</span>
          </span>
        </Link>
        <div className="mx-auto mt-12 grid max-w-5xl grid-cols-2 gap-x-8 gap-y-8 text-center sm:grid-cols-3">
          {footerColumns.map((column) => (
            <nav key={column[0]} aria-label={`${column[0]} links`} className="flex flex-col gap-4 text-lg font-semibold">
              {column.map((label) => (
                <a key={label} href="#" className="transition-colors hover:text-primary">
                  {label}
                </a>
              ))}
            </nav>
          ))}
        </div>
      </div>
    </footer>
  );
}
