import React, { createContext, useContext, useState } from "react";
import { I18nManager } from "react-native";

const LanguageContext = createContext<any>(null);

export const LanguageProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [lang, setLangState] = useState("en");

  // NEW: Direct selection for your Account page modals
  const setLang = (newLang: string) => {
    setLangState(newLang);
    const isRTL = newLang === "ar";
    if (I18nManager.isRTL !== isRTL) {
      I18nManager.forceRTL(isRTL);
      I18nManager.allowRTL(isRTL);
    }
  };

  // OLD: Kept here so your other existing screens don't crash
  const toggleLang = () => {
    const nextLang = lang === "en" ? "ar" : "en";
    setLang(nextLang);
  };

  const t = (en: string, ar: string) => (lang === "en" ? en : ar);

  return (
    // Passing both toggleLang (old) and setLang (new)
    <LanguageContext.Provider value={{ lang, setLang, toggleLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
