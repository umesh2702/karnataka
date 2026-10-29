"use client";

import React, { createContext, useContext, useState } from "react";
import { Language, translations, Translations } from "@/lib/i18n";

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: Translations;
}

const defaultContext: LanguageContextType = {
  lang: "en",
  setLang: () => {},
  t: translations.en,
};

const LanguageContext = createContext<LanguageContextType>(defaultContext);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Language>(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("preferred_lang") as Language;
        if (saved === "en" || saved === "kn") return saved;
      } catch {}
    }
    return "en";
  });

  const setLang = (newLang: Language) => {
    setLangState(newLang);
    if (typeof window !== "undefined") {
      localStorage.setItem("preferred_lang", newLang);
      document.cookie = `preferred_lang=${newLang}; path=/; max-age=31536000`;
    }
  };

  return (
    <LanguageContext.Provider
      value={{
        lang,
        setLang,
        t: translations[lang] || translations.en,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  try {
    const ctx = useContext(LanguageContext);
    return ctx || defaultContext;
  } catch {
    return defaultContext;
  }
}
