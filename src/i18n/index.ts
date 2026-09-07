// src/i18n/index.ts
import { en } from "./en";
import { pt } from "./pt";

type Translations = typeof en;

export const translations = { en, pt } satisfies Record<string, Translations>;
export type Language = keyof typeof translations;
export const languageOptions = Object.keys(translations) as Language[];
export const FALLBACK_LANGUAGE: Language = "en";
