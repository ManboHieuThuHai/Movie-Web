"use client";

import { createContext, useContext, type ReactNode } from "react";
import { getMessages, type Locale } from "@/src/i18n/config";

const LocaleContext = createContext<Locale>("en");

export function LocaleProvider({ locale, children }: { locale: Locale; children: ReactNode }) {
  return <LocaleContext.Provider value={locale}>{children}</LocaleContext.Provider>;
}

export function useLocale() {
  const locale = useContext(LocaleContext);
  return { locale, messages: getMessages(locale) };
}
