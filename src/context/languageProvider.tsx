import { useState, useMemo, useCallback } from "react";
import { LanguageContext } from "./languageContext";
import { languageOptions, type Language } from "../i18n";

type LanguageProviderProps = Readonly<{
  children: React.ReactNode;
}>;

export function LanguageProvider({ children }: LanguageProviderProps) {
  const [language, setLanguage] = useState<Language>(() => {
    const stored = localStorage.getItem("language");
    return languageOptions.includes(stored as Language)
      ? (stored as Language)
      : "en";
  });

  const handleSetLanguage = useCallback((lang: Language) => {
    localStorage.setItem("language", lang);
    setLanguage(lang);
  }, []);

  const value = useMemo(
    () => ({ language, setLanguage: handleSetLanguage }),
    [language, handleSetLanguage],
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}
