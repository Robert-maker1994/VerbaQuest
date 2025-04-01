import type { MigrationInterface, QueryRunner } from "typeorm";
import { Languages, Verb, Conjugation } from "../libs/entity";
import { LanguageCode, LanguageName } from "@verbaquest/types";
import { ConjugationTranslation } from "../libs/entity/conjugationTranslation";

class MigrationError extends Error {
    constructor(message: string, public readonly details?: DebugDetails) {
        super(message);
        this.name = "MigrationError";
    }
}
// biome-ignore lint/suspicious/noExplicitAny: <explanation>
type DebugDetails =  Record<string, any>
class EntityNotFoundError extends MigrationError {
    constructor(entityName: string, details?: DebugDetails) {
        super(`Entity '${entityName}' not found.`, details);
        this.name = "EntityNotFoundError";
    }
}

class ConjugationNotFoundError extends MigrationError {
    constructor(conjugationText: string, details?: DebugDetails) {
        super(`Conjugation '${conjugationText}' not found.`, details);
        this.name = "ConjugationNotFoundError";
    }
}

class DatabaseError extends MigrationError {
    constructor(message: string, details?: DebugDetails) {
        super(`Database error: ${message}`, details);
        this.name = "DatabaseError";
    }
}

export class ConjugationsTranslations1743488914989 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {

        

        console.log("Starting Conjugation Translations Migration...");
        const languageRepository = queryRunner.manager.getRepository(Languages);
        await languageRepository.save([
            { language_code: LanguageCode.FRENCH, 
                language_name: LanguageName.FRENCH
             },
        ])
        const conjugationRepository = queryRunner.manager.getRepository(Conjugation);
        const verbRepository = queryRunner.manager.getRepository(Verb);
        const conjugationTranslationRepository = queryRunner.manager.getRepository(ConjugationTranslation);

        try {
            console.log("Fetching 'jugar' verb...");
            const jugarVerb = await verbRepository.findOne({
                where: {
                    word: {
                        word_text: 'jugar'
                    }
                },
                relations: {
                    word: true,
                    language: true,
                },
            });

            if (!jugarVerb) {
                throw new EntityNotFoundError("Verb 'jugar'", { word_text: 'jugar' });
            }

            // Fetch languages
            console.log("Fetching languages...");
            const spanish = await languageRepository.findOneBy({ language_code: LanguageCode.SPANISH });
            const english = await languageRepository.findOneBy({ language_code: LanguageCode.ENGLISH });
            const french = await languageRepository.findOneBy({ language_code: LanguageCode.FRENCH });

            if (!spanish || !english || !french) {
                throw new EntityNotFoundError("Languages", { spanish, english, french });
            }

            // Fetch conjugations for 'jugar'
            console.log("Fetching conjugations for 'jugar'...");
            const conjugations = await conjugationRepository.find({
                where: {
                    verb: { verb_id: jugarVerb.verb_id }
                },
                relations: {
                    verb: true,
                    tense: true,
                    form: true
                },
            });

            if (!conjugations || conjugations.length === 0) {
                throw new EntityNotFoundError("Conjugations for 'jugar'", { verb_id: jugarVerb.verb_id });
            }

            // Translations to insert
            console.log("Preparing translations...");
            const translationsToInsert = [
                // Presente Indicativo
                { conjugationText: "juego", translation: "I play", language: english },
                { conjugationText: "juegas", translation: "you play", language: english },
                { conjugationText: "juega", translation: "he/she/you (formal) play", language: english },
                { conjugationText: "jugamos", translation: "we play", language: english },
                { conjugationText: "jugáis", translation: "you (plural) play", language: english },
                { conjugationText: "juegan", translation: "they/you (plural formal) play", language: english },
                { conjugationText: "juego", translation: "je joue", language: french },
                { conjugationText: "juegas", translation: "tu joues", language: french },
                { conjugationText: "juega", translation: "il/elle/on joue", language: french },
                { conjugationText: "jugamos", translation: "nous jouons", language: french },
                { conjugationText: "jugáis", translation: "vous jouez", language: french },
                { conjugationText: "juegan", translation: "ils/elles jouent", language: french },
                // Presente Subjuntivo
                { conjugationText: "juegue", translation: "I play", language: english },
                { conjugationText: "juegues", translation: "you play", language: english },
                { conjugationText: "juegue", translation: "he/she/you (formal) play", language: english },
                { conjugationText: "juguemos", translation: "we play", language: english },
                { conjugationText: "juguéis", translation: "you (plural) play", language: english },
                { conjugationText: "jueguen", translation: "they/you (plural formal) play", language: english },
                { conjugationText: "juegue", translation: "que je joue", language: french },
                { conjugationText: "juegues", translation: "que tu joues", language: french },
                { conjugationText: "juegue", translation: "qu'il/qu'elle/qu'on joue", language: french },
                { conjugationText: "juguemos", translation: "que nous jouions", language: french },
                { conjugationText: "juguéis", translation: "que vous jouiez", language: french },
                { conjugationText: "jueguen", translation: "qu'ils/qu'elles jouent", language: french },
                // Preterito Indefinido Indicativo
                { conjugationText: "jugué", translation: "I played", language: english },
                { conjugationText: "jugaste", translation: "you played", language: english },
                { conjugationText: "jugó", translation: "he/she/you (formal) played", language: english },
                { conjugationText: "jugamos", translation: "we played", language: english },
                { conjugationText: "jugasteis", translation: "you (plural) played", language: english },
                { conjugationText: "jugaron", translation: "they/you (plural formal) played", language: english },
                { conjugationText: "jugué", translation: "j'ai joué", language: french },
                { conjugationText: "jugaste", translation: "tu as joué", language: french },
                { conjugationText: "jugó", translation: "il/elle/on a joué", language: french },
                { conjugationText: "jugamos", translation: "nous avons joué", language: french },
                { conjugationText: "jugasteis", translation: "vous avez joué", language: french },
                { conjugationText: "jugaron", translation: "ils/elles ont joué", language: french },
            ];

            // Create and save translations
            console.log("Creating and saving translations...");
            const conjugationTranslations = translationsToInsert.map(translationData => {
                const conjugation = conjugations.find(c => c.conjugation === translationData.conjugationText);
                if (!conjugation) {
                    throw new ConjugationNotFoundError(translationData.conjugationText, { translationsToInsert });
                }
                return conjugationTranslationRepository.create({
                    conjugation: conjugation,
                    translation: translationData.translation,
                    language: translationData.language,
                });
            });

            await conjugationTranslationRepository.save(conjugationTranslations).catch((error) => {
                throw new DatabaseError("Error saving conjugation translations", error);
            });

            console.log("Conjugation translations for 'jugar' seeded successfully!");
        } catch (error) {
            console.error("Migration failed:", error);
            if (error instanceof MigrationError) {
                console.error("Error Details:", error.details);
            }
            throw error; 
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        console.log("Starting down migration...");
        try {
            await queryRunner.query("DELETE FROM conjugation_translation").catch((error) => {
                throw new DatabaseError("Error deleting conjugation translations", error);
            });
            console.log("Conjugation translations deleted successfully!");
        } catch (error) {
            console.error("Down migration failed:", error);
            if (error instanceof MigrationError) {
                console.error("Error Details:", error.details);
            }
            throw error;
        }
    }
}
