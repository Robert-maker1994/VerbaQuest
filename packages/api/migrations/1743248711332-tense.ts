import { LanguageCode } from "@verbaquest/types";
import type { MigrationInterface, QueryRunner } from "typeorm";
import { Languages, Tense } from "../libs/entity";

export class Tense1743248711332 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const english = await queryRunner.manager.findOne(Languages, {
      where: {
        language_code: LanguageCode.ENGLISH,
      },
    });
    const spanish = await queryRunner.manager.findOne(Languages, {
      where: {
        language_code: LanguageCode.SPANISH,
      },
    });
    if (!english) {
      throw new Error(`Target language with code ${english} not found.`);
    }

    if (!spanish) {
      throw new Error(`Target language with code ${spanish} not found.`);
    }

    const tenses: Omit<Tense, "tense_id">[] = [
      {
        language: english,
        tense: "present simple",
        mood: "indicative",
        description: "Used for habits, routines, general truths, and facts.",
        conjugations: [],
      },
      {
        language: english,
        mood: "indicative",
        conjugations: [],
        tense: "present continuous",
        description: "Used for actions happening now, temporary situations, and future arrangements.",
      },
      {
        language: english,
        mood: "indicative",
        conjugations: [],
        tense: "present perfect",
        description:
          "Used for actions that started in the past and continue to the present or have a result in the present.",
      },
      {
        language: english,
        mood: "indicative",
        conjugations: [],
        tense: "present perfect continuous",
        description:
          "Used for actions that started in the past and have continued up to the present, emphasizing duration.",
      },
      {
        language: english,
        mood: "indicative",
        conjugations: [],
        tense: "past simple",
        description: "Used for completed actions in the past.",
      },
      {
        language: english,
        mood: "indicative",
        conjugations: [],
        tense: "past continuous",
        description: "Used for actions that were in progress at a specific time in the past.",
      },
      {
        language: english,
        mood: "indicative",
        conjugations: [],
        tense: "past perfect",
        description: "Used for actions completed before another action in the past.",
      },
      {
        language: english,
        mood: "indicative",
        conjugations: [],
        tense: "past perfect continuous",
        description: "Used for actions that were in progress before another action in the past, emphasizing duration.",
      },
      {
        language: english,
        mood: "indicative",
        conjugations: [],
        tense: "future simple",
        description: "Used for predictions, spontaneous decisions, and promises.",
      },
      {
        language: english,
        mood: "indicative",
        conjugations: [],
        tense: "future continuous",
        description: "Used for actions that will be in progress at a specific time in the future.",
      },
      {
        language: english,
        mood: "indicative",
        conjugations: [],
        tense: "future perfect",
        description: "Used for actions that will be completed before a specific time in the future.",
      },
      {
        language: english,
        mood: "indicative",
        conjugations: [],
        tense: "future perfect continuous",
        description:
          "Used for actions that will have been in progress for a duration before a specific time in the future.",
      },
      {
        language: english,
        mood: "indicative",
        conjugations: [],
        tense: "conditional simple",
        description: "Used for hypothetical situations and their consequences.",
      },
      {
        language: english,
        mood: "indicative",
        conjugations: [],
        tense: "conditional continuous",
        description: "Used for hypothetical actions that would be in progress.",
      },
      {
        language: english,
        mood: "indicative",
        conjugations: [],
        tense: "conditional perfect",
        description: "Used for hypothetical actions that would have been completed.",
      },
      {
        language: english,
        mood: "indicative",
        conjugations: [],
        tense: "conditional perfect continuous",
        description: "Used for hypothetical actions that would have been in progress for a duration.",
      },
      {
        language: spanish,
        tense: "presente indicativo",
        mood: "indicativo",
        description: "Se usa para acciones habituales, rutinas, verdades generales y hechos.",

        conjugations: [],
      },
      {
        language: spanish,
        tense: "pretérito imperfecto",
        mood: "indicativo",
        description:
          "Se usa para acciones habituales en el pasado, descripciones en el pasado y acciones en progreso en el pasado.",

        conjugations: [],
      },
      {
        language: spanish,
        tense: "pretérito indefinido",
        mood: "indicativo",
        description: "Se usa para acciones completadas en el pasado.",

        conjugations: [],
      },
      {
        language: spanish,
        tense: "futuro simple",
        mood: "indicativo",
        description: "Se usa para predicciones, decisiones espontáneas y promesas.",
        conjugations: [],
      },
      {
        language: spanish,
        tense: "condicional simple",
        mood: "indicativo",
        description: "Se usa para situaciones hipotéticas y sus consecuencias.",
        conjugations: [],
      },
      {
        language: spanish,
        tense: "presente perfecto",
        mood: "indicativo",
        description:
          "Se usa para acciones que comenzaron en el pasado y continúan hasta el presente o tienen un resultado en el presente.",
        conjugations: [],
      },
      {
        language: spanish,
        tense: "pretérito pluscuamperfecto",
        mood: "indicativo",
        description: "Se usa para acciones completadas antes de otra acción en el pasado.",
        conjugations: [],
      },
      {
        language: spanish,
        tense: "futuro perfecto",
        mood: "indicativo",
        description: "Se usa para acciones que se habrán completado antes de un momento específico en el futuro.",
        conjugations: [],
      },
      {
        language: spanish,
        tense: "condicional perfecto",
        mood: "indicativo",
        description: "Se usa para acciones hipotéticas que se habrían completado.",
        conjugations: [],
      },
      {
        language: spanish,
        tense: "presente subjuntivo",
        mood: "subjuntivo",
        description: "Se usa para expresar deseos, dudas, posibilidades, emociones y juicios de valor.",
        conjugations: [],
      },
      {
        language: spanish,
        tense: "pretérito imperfecto",
        mood: "subjuntivo",
        description: "Se usa para expresar deseos, dudas, posibilidades, emociones y juicios de valor en el pasado.",
        conjugations: [],
      },
      {
        language: spanish,
        tense: "pretérito perfecto",
        mood: "subjuntivo",
        description:
          "Se usa para expresar acciones completadas antes de otra acción en el pasado en el contexto de deseos, dudas, posibilidades, emociones y juicios de valor.",
        conjugations: [],
      },
      {
        language: spanish,
        tense: "pretérito pluscuamperfecto",
        mood: "subjuntivo",
        description:
          "Se usa para expresar acciones que se habían completado antes de otra acción en el pasado en el contexto de deseos, dudas, posibilidades, emociones y juicios de valor.",
        conjugations: [],
      },
      {
        language: spanish,
        tense: "futuro simple",
        mood: "subjuntivo",
        description:
          "Se usa para expresar acciones futuras en el contexto de deseos, dudas, posibilidades, emociones y juicios de valor.",
        conjugations: [],
      },
      {
        language: spanish,
        tense: "futuro perfecto",
        mood: "subjuntivo",
        description:
          "Se usa para expresar acciones que se habrán completado antes de un momento específico en el futuro en el contexto de deseos, dudas, posibilidades, emociones y juicios de valor.",
        conjugations: [],
      },
    ];

    // 3. Insert Data in Batches (Transaction)
    await queryRunner.startTransaction();

    try {
      const tenseRecords = tenses.map((tenseData) => {
        const tense = new Tense();
        tense.language = tenseData.language;
        tense.tense = tenseData.tense;
        tense.mood = tenseData.mood;
        tense.description = tenseData.description;
        return tense;
      });
      await queryRunner.manager.save(tenseRecords);

      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      console.error("Error inserting data:", error);
      throw error;
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    queryRunner.dropTable("tense");
  }
}
