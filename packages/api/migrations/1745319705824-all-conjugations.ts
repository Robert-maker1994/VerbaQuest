import fs from "node:fs";
import path from "node:path";
import type { LanguageCode } from "@verbaquest/types";
import csv from "csv-parser";
import type { MigrationInterface, QueryRunner } from "typeorm";
import { Conjugation, Form, Languages, Tense, Verb, Word } from "../libs/entity"; // Ensure all entities are imported
import { ConjugationTranslation } from "../libs/entity/conjugations/conjugationTranslationEntity";

// Define the expected CSV structure
interface CSVRow {
  verb_infinitive: string;
  verb_language_code: LanguageCode;
  spanish_tense: string;
  form_name: string;
  conjugated_form: string;
  is_irregular: string;
}

// Helper function for robust boolean parsing
function parseBoolean(value: string | undefined): boolean {
  return value?.trim().toLowerCase() === "true";
}

export class AllConjugations1745319705824 implements MigrationInterface {
  name = "AllConjugations1745319705824";

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Schema change from the original file (keep if needed)

    const csvFilePath = path.join(__dirname, "../../seeder/all_verb_conjugations_standard_forms.csv");

    // --- 1. Pre-computation / Caching Setup ---
    console.info("Caching prerequisite data...");
    const languageMap = new Map<LanguageCode, Languages>();
    const languages = await queryRunner.manager.find(Languages);
    for (const lang of languages) {
      languageMap.set(lang.language_code, lang);
    }

    const tenseMap = new Map<string, Tense>();
    const tenseEntity = await queryRunner.manager.find(Tense, { relations: ["language"] });
    for (const tense of tenseEntity) {
      if (tense.language) {
        // Composite key: languageCode-tenseName-mood
        const key = `${tense.mood}-${tense.tense}`;
        tenseMap.set(key.toLowerCase(), tense); // Use lowercase for case-insensitive matching
      } else {
        console.warn(`Tense with ID ${tense.tense_id} has no associated language.`);
      }
    }

    const formMap = new Map<string, Form>();
    const formEnity = await queryRunner.manager.find(Form, { relations: ["language"] });
    for (const form of formEnity) {
      if (form.language) {
        // Composite key: languageCode-formName
        const key = `${form.language.language_code}-${form.form}`;
        formMap.set(key.toLowerCase(), form); // Use lowercase for case-insensitive matching
      } else {
        console.warn(`Form with ID ${form.form_id} has no associated language.`);
      }
    }

    // Maps to cache Words and Verbs during processing
    const wordMap = new Map<string, Word>();
    const verbMap = new Map<string, Verb>();

    // --- 2. Load Existing Words/Verbs (Optimization) ---
    console.info("Caching existing Words and Verbs...");
    const existingWords = await queryRunner.manager.find(Word, {
      relations: ["language"],
      where: { partOfSpeech: "verb" }, // Assuming verbs are marked this way
    });
    for (const word of existingWords) {
      if (word.language) {
        const key = `${word.language.language_code}-${word.word_text}`;
        wordMap.set(key.toLowerCase(), word);
      }
    }
    console.info(tenseMap.keys());

    const existingVerbs = await queryRunner.manager.find(Verb, { relations: ["word", "language"] });
    for (const verb of existingVerbs) {
      if (verb.language && verb.word) {
        const key = `${verb.language.language_code}-${verb.word.word_text}`;
        verbMap.set(key.toLowerCase(), verb);
      }
    }

    console.info("Caches populated.");

    // --- 3. Read CSV Data ---
    console.info(`Reading CSV data from: ${csvFilePath}`);
    const csvData: CSVRow[] = await new Promise((resolve, reject) => {
      const rows: CSVRow[] = [];
      if (!fs.existsSync(csvFilePath)) {
        return reject(new Error(`CSV file not found at path: ${csvFilePath}`));
      }
      fs.createReadStream(csvFilePath)
        .pipe(csv())
        .on("data", (row: CSVRow) => {
          // Basic validation
          if (
            row.verb_infinitive &&
            row.verb_language_code &&
            row.form_name &&
            row.conjugated_form &&
            row.is_irregular !== undefined // Check for presence
          ) {
            rows.push(row);
          } else {
            console.warn("Skipping incomplete row:", row);
          }
        })
        .on("end", () => {
          console.info(`Successfully read ${rows.length} rows from CSV.`);
          resolve(rows);
        })
        .on("error", (error) => {
          console.error("Error reading CSV:", error);
          reject(error);
        });
    });

    if (csvData.length === 0) {
      console.warn("No valid data found in CSV file. Migration will not insert any conjugations.");
      return; // Exit early if no data
    }

    // --- 4. Process CSV Data (Loop) ---
    const conjugationsToInsert: Conjugation[] = [];
    const translationsToPrepare: {
      tempConjRef: Conjugation; // Reference to the unsaved Conjugation object
      translationText: string;
      language: Languages;
    }[] = [];

    console.info("Processing CSV rows...");
    await queryRunner.startTransaction(); // Start transaction

    try {
      for (const [index, row] of csvData.entries()) {
        const { verb_infinitive, verb_language_code, form_name, spanish_tense, conjugated_form, is_irregular } = row;

        const infinitiveLower = verb_infinitive.toLowerCase();

        const formNameLower = form_name.toLowerCase();

        // --- 5a. Get Language ---
        const verbLanguage = languageMap.get(verb_language_code);
        if (!verbLanguage) {
          throw new Error(`Language with code '${verb_language_code}' not found in cache (Row ${index + 1})`);
        }

        // --- 5b. Find/Create Word ---
        const wordKey = `${verb_language_code}-${infinitiveLower}`;
        let wordEntity = wordMap.get(wordKey);

        if (!wordEntity) {
          console.info(`Creating new Word: ${verb_infinitive} (${verb_language_code})`);
          const newWord = new Word();
          newWord.word_text = verb_infinitive; // Store original case if desired
          newWord.language = verbLanguage;
          newWord.partOfSpeech = "verb";
          newWord.definition = `${verb_infinitive} (${verb_language_code})`; // Placeholder definition
          newWord.wordle_valid = verb_infinitive.length === 5; // Basic wordle check

          wordEntity = await queryRunner.manager.save(Word, newWord); // Save immediately to get ID
          wordMap.set(wordKey, wordEntity); // Cache the newly created word
        }

        // --- 5c. Find/Create Verb ---
        const verbKey = `${verb_language_code}-${infinitiveLower}`;
        let verbEntity = verbMap.get(verbKey);

        if (!verbEntity) {
          console.info(`Creating new Verb entry for: ${verb_infinitive} (${verb_language_code})`);
          const newVerb = new Verb();
          newVerb.word = wordEntity;
          newVerb.language = verbLanguage;

          newVerb.irregular = parseBoolean(is_irregular);

          verbEntity = await queryRunner.manager.save(Verb, newVerb); // Save immediately
          verbMap.set(verbKey, verbEntity); // Cache the newly created verb
        }

        // --- 5d. Get Tense ---
        const tenseKey = `${verb_language_code}-${spanish_tense}`;
        const tenseEntity = tenseMap.get(tenseKey);
        if (!tenseEntity) {
          console.log({
            verb_infinitive,
            verb_language_code,
            spanish_tense,
            form_name,
          });
          throw new Error(
            `Tense with name '${spanish_tense}', mood '${spanish_tense}', language '${verb_language_code}' not found in cache (Row ${
              index + 1
            })`,
          );
        }

        // --- 5e. Get Form ---
        const formKey = `${verb_language_code}-${formNameLower}`;
        const formEntity = formMap.get(formKey);
        if (!formEntity) {
          throw new Error(
            `Form with name '${form_name}', language '${verb_language_code}' not found in cache (Row ${index + 1})`,
          );
        }

        // --- 6. Prepare Conjugation ---
        const newConjugation = new Conjugation();
        newConjugation.verb = verbEntity;
        newConjugation.tense = tenseEntity;
        newConjugation.form = formEntity;
        newConjugation.conjugation = conjugated_form;
        newConjugation.is_irregular = parseBoolean(is_irregular);

        conjugationsToInsert.push(newConjugation);

        // --- 7. Prepare Translations ---
        for (const key in row) {
          if (key.startsWith("translation_") && row[key]) {
            const translationLangCode = key.substring("translation_".length) as LanguageCode;
            const translationText = row[key];
            const translationLanguage = languageMap.get(translationLangCode);

            if (!translationLanguage) {
              console.warn(
                `Translation language '${translationLangCode}' not found for row ${index + 1}. Skipping translation.`,
              );
              continue;
            }

            if (translationText && translationText.trim() !== "") {
              translationsToPrepare.push({
                tempConjRef: newConjugation, // Link to the object before it's saved
                translationText: translationText.trim(),
                language: translationLanguage,
              });
            }
          }
        }
      } // End of CSV row loop

      // --- 8. Batch Insertion ---
      console.info(`Attempting to insert ${conjugationsToInsert.length} conjugations...`);

      await queryRunner.manager.save(Conjugation, conjugationsToInsert, { chunk: 500 }); // Use chunking for large datasets
      console.info("Conjugations inserted successfully.");

      // Now create and save the translations, linking them to the saved conjugations
      if (translationsToPrepare.length > 0) {
        console.info(`Attempting to insert ${translationsToPrepare.length} conjugation translations...`);
        const finalTranslationsToInsert: ConjugationTranslation[] = translationsToPrepare.map((prep) => {
          const translation = new ConjugationTranslation();
          translation.conjugation = prep.tempConjRef; // Now prep.tempConjRef has an ID
          translation.translation = prep.translationText;
          translation.language = prep.language;
          return translation;
        });

        await queryRunner.manager.save(ConjugationTranslation, finalTranslationsToInsert, { chunk: 500 });
        console.info("Conjugation translations inserted successfully.");
      } else {
        console.info("No conjugation translations to insert.");
      }
      // --- 9. Commit Transaction ---
      await queryRunner.commitTransaction();
      console.info("Migration completed successfully.");
    } catch (error) {
      console.error("Error during migration process. Rolling back transaction.", error);
      await queryRunner.rollbackTransaction();
      throw error;
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    console.warn("Rolling back AllConjugations migration...");
    // Delete translations first due to foreign key constraints
    console.info("Deleting conjugation translations...");
    await queryRunner.query(`DELETE FROM "conjugation_translation"`);

    // Delete conjugations
    console.info("Deleting conjugations...");
    await queryRunner.query(`DELETE FROM "conjugation"`);

    // Optionally delete Words and Verbs created by this migration?
    // This is harder to do reliably without tracking which ones were created here.
    // Usually, deleting conjugations/translations is sufficient for rollback.
    console.warn("Note: Words and Verbs created by this migration are NOT automatically deleted.");

    // Reverse the schema change
    try {
      await queryRunner.query(`ALTER TABLE "verb_group" DROP CONSTRAINT "UQ_d8a620dbddb3411f06d055fdd74"`);
      console.info("Dropped UNIQUE constraint from verb_group.");
    } catch (e) {
      console.warn("Could not drop UNIQUE constraint from verb_group. It might not exist.", e.message);
    }

    console.info("Rollback finished.");
  }
}
