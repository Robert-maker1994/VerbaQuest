import { LanguageCode } from "@verbaquest/types";
import type { MigrationInterface, QueryRunner } from "typeorm";
import { Conjugation, Form, Languages, Tense, Verb, Word } from "../libs/entity";

export class Conjugations1743278126814 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        try {
            const languageRepository = queryRunner.manager.getRepository(Languages);
            const wordRepository = queryRunner.manager.getRepository(Word);
            const verbRepository = queryRunner.manager.getRepository(Verb);
            const tenseRepository = queryRunner.manager.getRepository(Tense);
            const formRepository = queryRunner.manager.getRepository(Form);
            const conjugationRepository = queryRunner.manager.getRepository(Conjugation);

            const spanish = await languageRepository.findOneBy({ language_code: LanguageCode.SPANISH });
            const english = await languageRepository.findOneBy({ language_code: LanguageCode.ENGLISH });

            if (spanish && english) {
                // Fetch necessary entities
                const jugarWord = await wordRepository.findOne({ where: { word_text: 'jugar', language: spanish } });
                const listenWord = await wordRepository.findOne({ where: { word_text: 'listen', language: english } });

                const presenteIndicativeSpanish = await tenseRepository.findOne({ where: { tense: 'presente', mood: 'indicativo', language: spanish } });
                const presenteSubjunctiveSpanish = await tenseRepository.findOne({ where: { tense: 'presente', mood: 'subjuntivo', language: spanish } });
                const preteritoIndefinidoIndicativeSpanish = await tenseRepository.findOne({ where: { tense: 'pretérito indefinido', mood: 'indicativo', language: spanish } });
                const presentSimpleIndicativeEnglish = await tenseRepository.findOne({ where: { tense: 'present simple', mood: 'indicative', language: english } });
                const pastSimpleIndicativeEnglish = await tenseRepository.findOne({ where: { tense: 'past simple', mood: 'indicative', language: english } });

                const formYo = await formRepository.findOne({ where: { form: 'yo', language: spanish } });
                const formTu = await formRepository.findOne({ where: { form: 'tú', language: spanish } });
                const formElEllaUsted = await formRepository.findOne({ where: { form: 'él/ella/usted', language: spanish } });
                const formNosotros = await formRepository.findOne({ where: { form: 'nosotros/nosotras', language: spanish } });
                const formVosotros = await formRepository.findOne({ where: { form: 'vosotros/vosotras', language: spanish } });
                const formEllosEllasUstedes = await formRepository.findOne({ where: { form: 'ellos/ellas/ustedes', language: spanish } });

                const formI = await formRepository.findOne({ where: { form: 'I', language: english } });
                const formYouEn = await formRepository.findOne({ where: { form: 'you', language: english } });
                const formHeSheIt = await formRepository.findOne({ where: { form: 'he/she/it', language: english } });
                const formWeEn = await formRepository.findOne({ where: { form: 'we', language: english } });
                const formYouPlural = await formRepository.findOne({ where: { form: 'you (plural)', language: english } });
                const formTheyEn = await formRepository.findOne({ where: { form: 'they', language: english } });



                if(!jugarWord && !listenWord) {
                    throw new Error("There is no word");
                }

                if(!presenteIndicativeSpanish && !presenteSubjunctiveSpanish && !preteritoIndefinidoIndicativeSpanish && !presentSimpleIndicativeEnglish && !pastSimpleIndicativeEnglish) {
                    throw new Error("There is no tense");
                }


                if (!formYo && !formTu && !formElEllaUsted && !formNosotros && !formVosotros && !formEllosEllasUstedes && !formI && !formYouEn && !formHeSheIt && !formWeEn && !formYouPlural && !formTheyEn) {
                    throw new Error("There is no form");
                }

                const jugarVerb = await verbRepository.findOneBy({ word: jugarWord })

                                    await conjugationRepository.insert([
                        { verb: jugarVerb, tense: presenteIndicativeSpanish, form: formYo, conjugation: 'juego', is_irregular: true },
                        { verb: jugarVerb, tense: presenteIndicativeSpanish, form: formTu, conjugation: 'juegas', is_irregular: false },
                        { verb: jugarVerb, tense: presenteIndicativeSpanish, form: formElEllaUsted, conjugation: 'juega', is_irregular: true },
                        { verb: jugarVerb, tense: presenteIndicativeSpanish, form: formNosotros, conjugation: 'jugamos', is_irregular: false },
                        { verb: jugarVerb, tense: presenteIndicativeSpanish, form: formVosotros, conjugation: 'jugáis', is_irregular: false },
                        { verb: jugarVerb, tense: presenteIndicativeSpanish, form: formEllosEllasUstedes, conjugation: 'juegan', is_irregular: true },

                        { verb: jugarVerb, tense: presenteSubjunctiveSpanish, form: formYo, conjugation: 'juegue', is_irregular: true },
                        { verb: jugarVerb, tense: presenteSubjunctiveSpanish, form: formTu, conjugation: 'juegues', is_irregular: true },
                        { verb: jugarVerb, tense: presenteSubjunctiveSpanish, form: formElEllaUsted, conjugation: 'juegue', is_irregular: true },
                        { verb: jugarVerb, tense: presenteSubjunctiveSpanish, form: formNosotros, conjugation: 'juguemos', is_irregular: true },
                        { verb: jugarVerb, tense: presenteSubjunctiveSpanish, form: formVosotros, conjugation: 'juguéis', is_irregular: true },
                        { verb: jugarVerb, tense: presenteSubjunctiveSpanish, form: formEllosEllasUstedes, conjugation: 'jueguen', is_irregular: true },

                        { verb: jugarVerb, tense: preteritoIndefinidoIndicativeSpanish, form: formYo, conjugation: 'jugué', is_irregular: true },
                        { verb: jugarVerb, tense: preteritoIndefinidoIndicativeSpanish, form: formTu, conjugation: 'jugaste', is_irregular: false },
                        { verb: jugarVerb, tense: preteritoIndefinidoIndicativeSpanish, form: formElEllaUsted, conjugation: 'jugó', is_irregular: true },
                        { verb: jugarVerb, tense: preteritoIndefinidoIndicativeSpanish, form: formNosotros, conjugation: 'jugamos', is_irregular: false },
                        { verb: jugarVerb, tense: preteritoIndefinidoIndicativeSpanish, form: formVosotros, conjugation: 'jugasteis', is_irregular: false },
                        { verb: jugarVerb, tense: preteritoIndefinidoIndicativeSpanish, form: formEllosEllasUstedes, conjugation: 'jugaron', is_irregular: true },
                    ]);

                    // English "listen" conjugations
                    await conjugationRepository.insert([
                        { verb: (await verbRepository.findOneBy({ word: listenWord })), tense: presentSimpleIndicativeEnglish, form: formI, conjugation: 'listen', is_irregular: false },
                        { verb: (await verbRepository.findOneBy({ word: listenWord })), tense: presentSimpleIndicativeEnglish, form: formYouEn, conjugation: 'listen', is_irregular: false },
                        { verb: (await verbRepository.findOneBy({ word: listenWord })), tense: presentSimpleIndicativeEnglish, form: formHeSheIt, conjugation: 'listens', is_irregular: false },
                        { verb: (await verbRepository.findOneBy({ word: listenWord })), tense: presentSimpleIndicativeEnglish, form: formWeEn, conjugation: 'listen', is_irregular: false },
                        { verb: (await verbRepository.findOneBy({ word: listenWord })), tense: presentSimpleIndicativeEnglish, form: formYouPlural, conjugation: 'listen', is_irregular: false },
                        { verb: (await verbRepository.findOneBy({ word: listenWord })), tense: presentSimpleIndicativeEnglish, form: formTheyEn, conjugation: 'listen', is_irregular: false },
                        { verb: (await verbRepository.findOneBy({ word: listenWord })), tense: pastSimpleIndicativeEnglish, form: formI, conjugation: 'listened', is_irregular: false },
                        { verb: (await verbRepository.findOneBy({ word: listenWord })), tense: pastSimpleIndicativeEnglish, form: formYouEn, conjugation: 'listened', is_irregular: false },
                        { verb: (await verbRepository.findOneBy({ word: listenWord })), tense: pastSimpleIndicativeEnglish, form: formHeSheIt, conjugation: 'listened', is_irregular: false },
                        { verb: (await verbRepository.findOneBy({ word: listenWord })), tense: pastSimpleIndicativeEnglish, form: formWeEn, conjugation: 'listened', is_irregular: false },
                        { verb: (await verbRepository.findOneBy({ word: listenWord })), tense: pastSimpleIndicativeEnglish, form: formYouPlural, conjugation: 'listened', is_irregular: false },
                        { verb: (await verbRepository.findOneBy({ word: listenWord })), tense: pastSimpleIndicativeEnglish, form: formTheyEn, conjugation: 'listened', is_irregular: false },
                    ]);

                    console.log("Conjugations seeded successfully!");
                
            }
        } catch (error) {
            console.error("Error seeding conjugations:", error);
            throw error;
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DROP INDEX "idx_conjugation_tense_id";
        `);
        await queryRunner.query(`
            DROP INDEX "idx_conjugation_form_id";
        `);

        await queryRunner.query(`
            DROP INDEX "idx_conjugation_verb_id";
        `);
        await queryRunner.query(`
            DROP TABLE "conjugation";
        `);
    }
}
