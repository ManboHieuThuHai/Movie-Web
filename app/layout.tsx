import type { Metadata } from "next";
import { Bebas_Neue, Montserrat } from "next/font/google";
import Header from "@/src/components/Header";
import TrailerModal from "@/src/components/TrailerModal";
import QueryProvider from "@/src/providers/QueryProvider";
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

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${montserrat.variable} ${bebasNeue.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <QueryProvider>
          <Header />
          {children}
          <TrailerModal />
        </QueryProvider>
      </body>
    </html>
  );
}
