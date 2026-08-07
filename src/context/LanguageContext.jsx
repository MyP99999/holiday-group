import { createContext, useContext, useMemo, useState } from "react";
import { DEFAULT_LANGUAGE, LANGUAGE_META, translate } from "../i18n";

const STORAGE_KEY = "hg:language";
const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const [language, setLanguageState] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return LANGUAGE_META[saved] ? saved : DEFAULT_LANGUAGE;
  });

  const setLanguage = (nextLanguage) => {
    if (!LANGUAGE_META[nextLanguage]) return;
    localStorage.setItem(STORAGE_KEY, nextLanguage);
    document.documentElement.lang = nextLanguage;
    setLanguageState(nextLanguage);
  };

  const value = useMemo(() => ({
    language,
    locale: LANGUAGE_META[language].locale,
    setLanguage,
    t: (key, variables) => translate(language, key, variables),
  }), [language]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  return useContext(LanguageContext);
}
