/**
 * @module @verbaquest/types/language
 * @description This module defines types related to languages supported by the application.
 */

/**
 * Represents language codes.
 * @enum {string}
 * @property {"en"} ENGLISH - English language code.
 * @property {"es"} SPANISH - Spanish language code.
 * @property {"fr"} FRENCH - French language code.
 */
export enum LanguageCode {
    ENGLISH = "en",
    SPANISH = "es",
    FRENCH = "fr",
}

/**
 * Represents language names.
 * @enum {string}
 * @property {"english"} ENGLISH - English language name.
 * @property {"spanish"} SPANISH - Spanish language name.
 * @property {"french"} FRENCH - French language name.
 */
export enum LanguageName {
    ENGLISH = "English",
    SPANISH = "Spanish",
    FRENCH = "French",
}
