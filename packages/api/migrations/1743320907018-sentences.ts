import { LanguageCode } from "@verbaquest/types";
import type { MigrationInterface, QueryRunner } from "typeorm";
import { Conjugation, Sentence, Languages, Word, Verb, Tense, Form } from "../libs/entity";

export class Sentences1743320907018 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.startTransaction();

        const conjugationRepository = queryRunner.manager.getRepository(Conjugation);
        const sentenceRepository = queryRunner.manager.getRepository(Sentence);
        const languageRepository = queryRunner.manager.getRepository(Languages);
        const wordRepository = queryRunner.manager.getRepository(Word);
        const verbRepository = queryRunner.manager.getRepository(Verb);
        const tenseRepository = queryRunner.manager.getRepository(Tense);
        const formRepository = queryRunner.manager.getRepository(Form);

        try {
            const spanish = await languageRepository.findOneBy({ language_code: LanguageCode.SPANISH });
            if (!spanish) {
                console.error("Spanish language not found.");
                return;
            }

            const jugarWord = await wordRepository.findOneBy({ word_text: "jugar", language: spanish });
            if (!jugarWord) {
                console.error("Word 'jugar' not found.");
                return;
            }

            const jugarVerb = await verbRepository.findOneBy({ word: jugarWord, language: spanish });
            if (!jugarVerb) {
                console.error("Verb 'jugar' not found.");
                return;
            }

            const presenteIndicative = await tenseRepository.findOne({ where: { tense: 'presente', mood: 'indicativo', language: spanish } });
            const presenteSubjunctive = await tenseRepository.findOneBy({ tense: "presente", mood: "subjuntivo", language: spanish });
            const preteritoIndicative = await tenseRepository.findOne({ where: { tense: 'pretérito indefinido', mood: 'indicativo', language: spanish } });

            if (!presenteIndicative || !presenteSubjunctive || !preteritoIndicative) {
                console.error("Required tenses not found.");
                throw Error("Required tenses not found.");
            }

            const yoForm = await formRepository.findOneBy({ form: "yo", language: spanish });
            const tuForm = await formRepository.findOneBy({ form: "tú", language: spanish });
            const elEllaUstedForm = await formRepository.findOneBy({ form: "él/ella/usted", language: spanish });
            const nosotrosForm = await formRepository.findOneBy({ form: "nosotros/nosotras", language: spanish });
            const vosotrosForm = await formRepository.findOneBy({ form: "vosotros/vosotras", language: spanish });
            const ellosEllasUstedesForm = await formRepository.findOneBy({ form: "ellos/ellas/ustedes", language: spanish });

            if (!yoForm || !tuForm || !elEllaUstedForm || !nosotrosForm || !vosotrosForm || !ellosEllasUstedesForm) {
                console.error("Required forms not found.");
                return;
            }

            // Fetch Conjugations
            const yoPresenteIndicativo = await conjugationRepository.findOneBy({ verb: jugarVerb, tense: presenteIndicative, form: yoForm });
            
            const tuPresenteIndicativo = await conjugationRepository.findOneBy({ verb: jugarVerb, tense: presenteIndicative, form: tuForm });

            const elPresenteIndicativo = await conjugationRepository.findOneBy({ verb: jugarVerb, tense: presenteIndicative, form: elEllaUstedForm });

            const nosotrosPresenteIndicativo = await conjugationRepository.findOneBy({ verb: jugarVerb, tense: presenteIndicative, form: nosotrosForm });

            const vosotrosPresenteIndicativo = await conjugationRepository.findOneBy({ verb: jugarVerb, tense: presenteIndicative, form: vosotrosForm });

            const ellosPresenteIndicativo = await conjugationRepository.findOneBy({ verb: jugarVerb, tense: presenteIndicative, form: ellosEllasUstedesForm });

            const yoPresenteSubjuntivo = await conjugationRepository.findOneBy({ verb: jugarVerb, tense: presenteSubjunctive, form: yoForm });

            const tuPresenteSubjuntivo = await conjugationRepository.findOneBy({ verb: jugarVerb, tense: presenteSubjunctive, form: tuForm });

            const elPresenteSubjuntivo = await conjugationRepository.findOneBy({ verb: jugarVerb, tense: presenteSubjunctive, form: elEllaUstedForm });

            const nosotrosPresenteSubjuntivo = await conjugationRepository.findOneBy({ verb: jugarVerb, tense: presenteSubjunctive, form: nosotrosForm });

            const vosotrosPresenteSubjuntivo = await conjugationRepository.findOneBy({ verb: jugarVerb, tense: presenteSubjunctive, form: vosotrosForm });

            const ellosPresenteSubjuntivo = await conjugationRepository.findOneBy({ verb: jugarVerb, tense: presenteSubjunctive, form: ellosEllasUstedesForm });

            const yoPreteritoIndicativo = await conjugationRepository.findOneBy({ verb: jugarVerb, tense: preteritoIndicative, form: yoForm });
            const tuPreteritoIndicativo = await conjugationRepository.findOneBy({ verb: jugarVerb, tense: preteritoIndicative, form: tuForm });
            const elPreteritoIndicativo = await conjugationRepository.findOneBy({ verb: jugarVerb, tense: preteritoIndicative, form: elEllaUstedForm });
            const nosotrosPreteritoIndicativo = await conjugationRepository.findOneBy({ verb: jugarVerb, tense: preteritoIndicative, form: nosotrosForm });
            const vosotrosPreteritoIndicativo = await conjugationRepository.findOneBy({ verb: jugarVerb, tense: preteritoIndicative, form: vosotrosForm });
            const ellosPreteritoIndicativo = await conjugationRepository.findOneBy({ verb: jugarVerb, tense: preteritoIndicative, form: ellosEllasUstedesForm });

            if (yoPresenteIndicativo && tuPresenteIndicativo && elPresenteIndicativo && nosotrosPresenteIndicativo && vosotrosPresenteIndicativo && ellosPresenteIndicativo &&
                yoPresenteSubjuntivo && tuPresenteSubjuntivo && elPresenteSubjuntivo && nosotrosPresenteSubjuntivo && vosotrosPresenteSubjuntivo && ellosPresenteSubjuntivo &&
                yoPreteritoIndicativo && tuPreteritoIndicativo && elPreteritoIndicativo && nosotrosPreteritoIndicativo && vosotrosPreteritoIndicativo && ellosPreteritoIndicativo) {

                // Seed Sentences for "jugar"
                await sentenceRepository.insert([
                    { conjugation: yoPresenteIndicativo, sentence: "Yo juego al fútbol.", translation: "I play soccer." },
                    { conjugation: tuPresenteIndicativo, sentence: "Tú juegas videojuegos.", translation: "You play video games." },
                    { conjugation: elPresenteIndicativo, sentence: "Él juega con su perro.", translation: "He plays with his dog." },
                    { conjugation: nosotrosPresenteIndicativo, sentence: "Nosotros jugamos en el parque.", translation: "We play in the park." },
                    { conjugation: vosotrosPresenteIndicativo, sentence: "Vosotros jugáis a las cartas.", translation: "You (plural) play cards." },
                    { conjugation: ellosPresenteIndicativo, sentence: "Ellos juegan baloncesto.", translation: "They play basketball." },
                    { conjugation: yoPresenteSubjuntivo, sentence: "Espero que yo juegue bien.", translation: "I hope that I play well." },
                    { conjugation: tuPresenteSubjuntivo, sentence: "Dudo que tú juegues hoy.", translation: "I doubt that you play today." },
                    { conjugation: elPresenteSubjuntivo, sentence: "Ojalá que él juegue mañana.", translation: "I hope that he plays tomorrow." },
                    { conjugation: nosotrosPresenteSubjuntivo, sentence: "Quizás nosotros juguemos juntos.", translation: "Maybe we play together." },
                    { conjugation: vosotrosPresenteSubjuntivo, sentence: "Es importante que vosotros juguéis limpio.", translation: "It's important that you (plural) play fair." },
                    { conjugation: ellosPresenteSubjuntivo, sentence: "Es posible que ellos jueguen mañana.", translation: "It's possible that they play tomorrow." },
                    { conjugation: yoPreteritoIndicativo, sentence: "Yo jugué ayer al tenis.", translation: "I played tennis yesterday." },
                    { conjugation: tuPreteritoIndicativo, sentence: "Tú jugaste muy bien.", translation: "You played very well." },
                    { conjugation: elPreteritoIndicativo, sentence: "Él jugó al ajedrez.", translation: "He played chess." },
                    { conjugation: nosotrosPreteritoIndicativo, sentence: "Nosotros jugamos a las escondidas.", translation: "We played hide-and-seek." },
                    { conjugation: vosotrosPreteritoIndicativo, sentence: "Vosotros jugasteis al fútbol.", translation: "You (plural) played soccer." },
                    { conjugation: ellosPreteritoIndicativo, sentence: "Ellos jugaron a las damas.", translation: "They played checkers." },
                ]);

                console.log("Sentences for 'jugar' seeded successfully!");
            } else {
                
                console.error("Could not find all required entities to create sentences for 'jugar'.");
            }
        } catch (error ) {
            await queryRunner.rollbackTransaction();
            console.error("Error seeding sentences for 'jugar':", error);
            throw new Error("Error seeding sentences for 'jugar'");
        } finally {
            await queryRunner.commitTransaction();
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DROP INDEX "idx_sentence_conjugation_id";
        `);
        await queryRunner.query(`
            DROP TABLE "sentence";
        `);
    }

}
