"use client";

import Image from "next/image";
import Link from "next/link";
import { useLocale } from "@/src/i18n/LocaleProvider";

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
    <footer className="relative h-[25rem] lg:h-[30rem] overflow-hidden px-8 py-12 md:p-16">
      {/* Background image */}
      <Image
        src="/footer.png"
        alt=""
        fill
        className="object-cover object-center"
        sizes="100vw"
        priority={false}
      />
      
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/70" />
      
      {/* Content */}
      <div className="relative mx-auto flex h-full max-w-4xl flex-col justify-around">
        <Link 
          href={`/${locale}`} 
          className="mx-auto flex w-fit items-center hover:cursor-pointer group"
        >
          <Image
            src="/tmovie-55621206.png"
            alt="Logo"
            width={48}
            height={48}
            className="mr-2 w-8 md:mr-4 md:w-12"
          />
          <h1 className="text-white font-semibold text-2xl md:text-4xl group-hover:text-primary transition-colors duration-300">
            theMovies
          </h1>
        </Link>
        <nav
          aria-label={locale === "vi" ? "Liên kết cuối trang" : "Footer links"}
          className="-mx-2 flex flex-wrap items-start justify-between text-white font-semibold text-base md:text-2xl"
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
