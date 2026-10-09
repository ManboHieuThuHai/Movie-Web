import { notFound } from "next/navigation";
import { LocaleProvider } from "@/src/i18n/LocaleProvider";
import { isLocale, type Locale } from "@/src/i18n/config";

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return <LocaleProvider locale={locale as Locale}>{children}</LocaleProvider>;
}
