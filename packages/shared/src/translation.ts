export type TranslationKey = "dashboard" | "crossword" | "verb_conjugation" | "contact" | "verbaquest" | "user settings" | "logout" | "here_are_the crosswords_you_have_previously_attempted:" | "not_attempted_crosswords" | "try_it_again" | "navigate_to_crossword" | "time:" | "play" | "status:" | "topics:" | "difficulty:" | "completed" | "not_attempted" | "search_crosswords" | "crosswords" | "congratulations" | "puzzle_completed!" | "completed_crossword" | "do_more_crosswords" | "close" | "language" | "app_language" | "difficulty" | "saved_notification" | "done";

export type TranslationContextType = {
    [key in TranslationKey]: string;
};
