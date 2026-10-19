"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLocale } from "@/src/i18n/LocaleProvider";

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  const { locale, messages } = useLocale();
  const navItems = [
    { label: messages.home, href: `/${locale}`, match: `/${locale}` },
    { label: messages.movies, href: `/${locale}/movie`, match: `/${locale}/movie` },
    { label: messages.tvSeries, href: `/${locale}/tv`, match: `/${locale}/tv` },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY >= 200);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 flex justify-center px-8 transition-all duration-200 ease-in-out ${
        isScrolled
          ? "bg-background py-0 md:py-4"
          : "bg-transparent py-0 md:py-8"
      }`}
    >
      <nav
        aria-label={locale === "vi" ? "Điều hướng chính" : "Main navigation"}
        className="max-w-screen-2xl flex w-full items-center justify-between"
      >
        <Link
          href={`/${locale}`}
          className="group hidden items-center md:flex"
        >
          <Image
            src="/tmovie-55621206.png"
            alt=""
            width={48}
            height={48}
            className="mr-4 w-8 md:w-12"
          />
          <span className="text-2xl font-semibold text-white transition-colors group-hover:text-primary md:text-4xl">
            theMovies
          </span>
        </Link>

        <div className="fixed bottom-0 left-0 right-0 -mx-4 flex items-center justify-evenly bg-background py-2 md:relative md:bottom-auto md:left-auto md:right-auto md:mx-0 md:bg-transparent md:py-4">
          {navItems.map((item) => {
            const isActive =
              item.match === `/${locale}`
                ? pathname === item.match
                : pathname.startsWith(item.match);

            return (
              <Link
                key={item.label}
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                className={`nav-item rounded-md px-4 py-2 text-base md:text-xl ${
                  isActive ? "after:w-full" : ""
                } focus-visible:outline-2 focus-visible:outline-primary`}
              >
                {item.label}
              </Link>
            );
          })}
        </div>
      </nav>
    </header>
  );
}
