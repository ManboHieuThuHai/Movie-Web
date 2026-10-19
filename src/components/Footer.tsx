"use client";

import Image from "next/image";
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
  const footerLinks = [
    messages.home,
    messages.live,
    messages.mustWatch,
    messages.contactUs,
    messages.faq,
    messages.recentRelease,
    messages.terms,
    messages.premium,
    messages.topImdb,
    messages.aboutUs,
    messages.privacy,
  ];
  return (
    <footer className="relative isolate h-[25rem] overflow-hidden border-t border-white/10 bg-black px-8 py-12 text-white lg:h-[30rem] md:p-16">
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
      <div className="relative mx-auto flex h-full max-w-4xl flex-col justify-around">
        <Link href={`/${locale}`} className="mx-auto flex w-fit items-center gap-3 text-white">
          <Image
            src="/tmovie-55621206.png"
            alt=""
            width={48}
            height={48}
            className="mr-2 w-8 md:mr-4 md:w-12"
          />
          <span className="text-2xl font-semibold md:text-4xl">
            theMovies
          </span>
        </Link>
        <nav
          aria-label={locale === "vi" ? "Liên kết cuối trang" : "Footer links"}
          className="-mx-2 flex flex-wrap items-start justify-between text-center text-base font-semibold md:text-2xl"
        >
          {footerLinks.map((label) => (
            <a key={label} href="#" className="footer-item">
              {label}
            </a>
          ))}
        </nav>
      </div>
    </footer>
  );
}
