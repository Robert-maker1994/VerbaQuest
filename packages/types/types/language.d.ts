/**
 * @module @verbaquest/types/language
 * @description This module defines types related to languages supported by the application.
 */

/**
 * Represents language codes.
 * @enum {string}
 * @property {"EN"} ENGLISH - English language code.
 * @property {"ES"} SPANISH - Spanish language code.
 * @property {"FR"} FRENCH - French language code.
 */
export enum LanguageCode {
    ENGLISH = "EN",
    SPANISH = "ES",
    FRENCH = "FR",
}

/**
 * Represents language names.
 * @enum {string}
 * @property {"english"} ENGLISH - English language name.
 * @property {"spanish"} SPANISH - Spanish language name.
 * @property {"french"} FRENCH - French language name.
 */
export enum LanguageName {
    ENGLISH = "english",
    SPANISH = "spanish",
    FRENCH = "french",
}
