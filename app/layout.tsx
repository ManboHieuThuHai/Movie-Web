import type { Metadata } from "next";
import { Bebas_Neue, Montserrat } from "next/font/google";
import Header from "@/src/components/Header";
import Footer from "@/src/components/Footer";
import TrailerModal from "@/src/components/TrailerModal";
import QueryProvider from "@/src/providers/QueryProvider";
import { cookies } from "next/headers";
import { defaultLocale, isLocale, type Locale } from "@/src/i18n/config";
import { LocaleProvider } from "@/src/i18n/LocaleProvider";
import "./globals.css";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
});

const bebasNeue = Bebas_Neue({
  variable: "--font-bebas-neue",
  weight: "400",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "theMovies",
  description: "Discover movies and TV series.",
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const cookieStore = await cookies();
  const cookieLocale = cookieStore.get("locale")?.value;
  const locale: Locale = cookieLocale && isLocale(cookieLocale) ? cookieLocale : defaultLocale;
  return (
    <html
      lang={locale}
      className="h-full antialiased"
    >
      <body
        className={`${montserrat.variable} ${bebasNeue.variable} flex min-h-full flex-col`}
      >
        <QueryProvider>
          <LocaleProvider locale={locale}>
            <Header />
            {children}
            <TrailerModal />
            <Footer />
          </LocaleProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
