
// --- Moods (Extracted from your Tense migration) ---
export type Mood = "indicativo"| "indicative" | "indicativo" | "subjuntivo"   | "imperative";
// --- English Tenses ---
export type EnglishTense =
  | "present simple"
  | "present continuous"
  | "present perfect"
  | "present perfect continuous"
  | "past simple"
  | "past continuous"
  | "past perfect"
  | "past perfect continuous"
  | "future simple"
  | "future continuous"
  | "future perfect"
  | "future perfect continuous"
  | "conditional simple"
  | "conditional continuous"
  | "conditional perfect"
  | "conditional perfect continuous";

// --- Spanish Tenses ---
// Based on 1743248711332-tense.ts
// Combining tense name and mood for clarity, as they are distinct entries
export type SpanishTense =
  // Indicativo
  | "presente indicativo"
  | "pretérito imperfecto"
  | "pretérito indefinido"  
  | "futuro simple" 
  | "condicional simple" 
  | "presente perfecto"
  | "pretérito pluscuamperfecto"
  | "futuro perfecto"
  | "condicional perfecto"
  // Subjuntivo
  | "presente subjuntivo"
  | "pretérito imperfecto"
  | "pretérito perfecto"
  | "pretérito pluscuamperfecto"
  | "futuro simple" // Note: Relatively rare in modern Spanish
  | "futuro perfecto"; // Note: Relatively rare in modern Spanish

export type VerbaquestTense = EnglishTense | SpanishTense;