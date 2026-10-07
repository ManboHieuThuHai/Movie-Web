"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const navItems = [
  { label: "Home", href: "/#home" },
  { label: "Movies", href: "/#movies" },
  { label: "TV Series", href: "/#tv-series" },
];

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);

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
        className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 lg:px-10"
      >
        <Link
          href="/#home"
          className="font-heading text-3xl uppercase tracking-wide text-white transition-opacity hover:opacity-80"
        >
          the<span className="text-primary">Movies</span>
        </Link>

        <div className="flex items-center gap-6 text-sm font-semibold text-white/80 sm:gap-8">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="transition-colors hover:text-white"
            >
              {item.label}
            </Link>
          ))}
        </div>
      </nav>
    </header>
  );
}
