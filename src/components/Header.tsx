"use client";

import { useEffect, useState } from "react";
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
      setIsScrolled(window.scrollY > 60);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 transition-colors duration-300 ${
        isScrolled
          ? "border-b border-white/10 bg-black/80 backdrop-blur-md"
          : "bg-transparent"
      }`}
    >
      <nav
        aria-label={locale === "vi" ? "Điều hướng chính" : "Main navigation"}
        className="site-shell flex h-20 items-center justify-between"
      >
        <Link
          href={`/${locale}`}
          className="flex items-center gap-3 font-heading text-3xl uppercase tracking-wide text-white transition-opacity hover:opacity-80"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-sm font-bold">
            H
          </span>
          the<span className="text-primary">Movies</span>
        </Link>

        <div className="flex items-center gap-4 text-sm font-semibold text-white/80 sm:gap-8">
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
                className={`rounded-md px-1 py-2 transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-primary ${
                  isActive ? "text-white" : "text-white/80"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
          <div className="flex items-center gap-2 border-l border-white/15 pl-4" aria-label={messages.language}>
            <Link href={`/en${pathname.replace(/^\/(en|vi)/, "") || ""}`} className={locale === "en" ? "text-white" : "hover:text-white"}>EN</Link>
            <span aria-hidden="true">/</span>
            <Link href={`/vi${pathname.replace(/^\/(en|vi)/, "") || ""}`} className={locale === "vi" ? "text-white" : "hover:text-white"}>VI</Link>
          </div>
        </div>
      </nav>
    </header>
  );
}
