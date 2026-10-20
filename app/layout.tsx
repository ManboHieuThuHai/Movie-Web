import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import Header from "@/src/components/Header";
import Footer from "@/src/components/Footer";
import TrailerModal from "@/src/components/TrailerModal";
import QueryProvider from "@/src/providers/QueryProvider";
import "swiper/css";
import "swiper/css/effect-fade";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin", "vietnamese"],
  display: "swap", // Tối ưu font loading
  preload: true,
  fallback: ["system-ui", "arial"],
});

export const metadata: Metadata = {
  title: "theMovies",
  description: "Discover movies and TV series.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="flex min-h-full flex-col" suppressHydrationWarning>
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
