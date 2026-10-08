"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { label: "Home", href: "/", match: "/" },
  { label: "Movies", href: "/movie", match: "/movie" },
  { label: "TV Series", href: "/tv", match: "/tv" },
];

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

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
        aria-label="Main navigation"
        className="site-shell flex h-20 items-center justify-between"
      >
        <Link
          href="/"
          className="flex items-center gap-3 font-heading text-3xl uppercase tracking-wide text-white transition-opacity hover:opacity-80"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-sm font-bold">
            H
          </span>
          the<span className="text-primary">Movies</span>
        </Link>

        <div className="flex items-center gap-6 text-sm font-semibold text-white/80 sm:gap-8">
          {navItems.map((item) => {
            const isActive =
              item.match === "/"
                ? pathname === "/"
                : pathname.startsWith(item.match);

            return (
              <Link
                key={item.label}
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                className={`border-b-2 py-2 transition-colors hover:text-white ${
                  isActive ? "border-primary text-white" : "border-transparent"
                }`}
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
