import type { TranslationKey } from "@verbaquest/types";
import type React from "react";
import { createContext, useCallback, useContext, useEffect, useState } from "react";
import backendEndpoints from "./api/api";
import { useAuth } from "./auth/useAuth";
interface TranslationContextType {
  translate: (key: TranslationKey) => string;
  refreshTranslations: () => void;
}

const TranslationContext = createContext<TranslationContextType>({
  translate: (key: TranslationKey) => key,
  refreshTranslations: () => { },
});

interface TranslationProviderProps {
  children: React.ReactNode;
}

export const TranslationProvider: React.FC<TranslationProviderProps> = ({ children }) => {
  const { user } = useAuth();
  const [translations, setTranslations] = useState<Record<TranslationKey, string>>({
    dashboard: "dashboard",
    crossword: "crossword",
    verb_conjugation: "verb conjugation",
    contact: "contact",
    verbaquest: "verbaquest",
    "user settings": "user settings",
    logout: "logout",
    "here_are_the crosswords_you_have_previously_attempted:": "here are the crosswords you have previously attempted:",
    not_attempted_crosswords: "you haven't attempted any crosswords yet.",
    try_it_again: "try it again!",
    navigate_to_crossword: "navigate to Crossword",
    "time:": "time:",
    play: "play",
    "status:": "status:",
    "topics:": "topics:",
    "difficulty:": "difficulty:",
    completed: "completed",
    not_attempted: "not attempted",
    search_crosswords: "search crosswords",
    crosswords: "crosswords",
    congratulations: "congratulations!",
    "puzzle_completed!": "puzzle completed!",
    completed_crossword: "You solved the crossword! Great job!",
    do_more_crosswords: "Do more Crosswords",
    close: "Close",
    language: "preferred learning language",
    difficulty: "preferred difficulty",
    saved_notification: "These changes have been saved.",
    done: "Done",
    app_language: "EN",
    latest_crosswords: "latest crosswords",
    favorite_crosswords: "favorite crosswords",
  });

  useEffect(() => {
    const fetchTranslations = async () => {
      try {
        const response = await backendEndpoints.getPageTranslations();
        setTranslations(response);

      } catch (error) {
        console.error("Error fetching translations:", error);
      }
    };

    fetchTranslations();
  }, []);

  const translate = useCallback(
    (key: string) => {
      if (!user) return key;
      const translation = translations[key as keyof typeof translations];
      if (translation) {
        return translation;
      }
      return key;
    },
    [user, translations],
  );

  const refreshTranslations = useCallback(async () => {
    try {
      const response = await backendEndpoints.getPageTranslations();
      setTranslations(response);

    } catch (error) {
      console.error("Error fetching translations:", error);
    }
  }, []);

  const value: TranslationContextType = {
    translate,
    refreshTranslations,
  };

  return <TranslationContext.Provider value={value}>{children}</TranslationContext.Provider>;
};

export const useTranslation = () => useContext(TranslationContext);
