import type { Metadata } from "next";
import { Montserrat, Oswald } from "next/font/google";
import Header from "@/src/components/Header";
import Footer from "@/src/components/Footer";
import TrailerModal from "@/src/components/TrailerModal";
import QueryProvider from "@/src/providers/QueryProvider";
import "./globals.css";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin", "vietnamese"],
});

const oswald = Oswald({
  variable: "--font-oswald",
  subsets: ["latin", "vietnamese"],
});

export const metadata: Metadata = {
  title: "theMovies",
  description: "Discover movies and TV series.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${montserrat.variable} ${oswald.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <QueryProvider>
          <Header />
          {children}
          <TrailerModal />
          <Footer />
        </QueryProvider>
      </body>
    </html>
  );
}
