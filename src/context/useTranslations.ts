// src/context/useTranslations.ts
import { useContext } from "react";
import { LanguageContext } from "./languageContext";
import { translations, FALLBACK_LANGUAGE } from "../i18n";

export function useTranslations() {
  const ctx = useContext(LanguageContext);
  if (!ctx)
    throw new Error("useTranslations must be used within a LanguageProvider");
  return translations[ctx.language] ?? translations[FALLBACK_LANGUAGE];
}
