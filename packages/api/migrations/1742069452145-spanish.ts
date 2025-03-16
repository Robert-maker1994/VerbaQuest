import fs from "node:fs";
import path from "node:path";
import { LanguageCode } from "@verbaquest/shared";
import csv from "csv-parser";
import type { MigrationInterface, QueryRunner } from "typeorm";
import {
	Crossword,
	CrosswordWord,
	Languages,
	Topic,
	Words,
} from "../libs/entity";

interface CSVRow {
	title: string;
	topics: string;
	difficulty: string;
	[key: string]: string;
}

export class Spanish1742069452145 implements MigrationInterface {
	public async up(queryRunner: QueryRunner): Promise<void> {
		const csvFilePath = path.join(__dirname, "../seeder/a2-spanish.csv");
		const targetLanguageCode: LanguageCode = LanguageCode.SPANISH;

		// Helper Functions
		const getWordFromRow = (row: CSVRow, index: number) => {
			return row[`word${index}`];
		};
		const getDefinitionFromRow = (row: CSVRow, index: number) => {
			return row[`definition${index}`];
		};

		// Data Structures to Hold Unique Entities
		const topicsMap: Map<string, Topic> = new Map();
		const wordsMap: Map<string, Words> = new Map();
		const crosswords: Crossword[] = [];

		// Fetch the target language entity or create it
		const targetLanguage = await queryRunner.manager.findOne(Languages, {
			where: { language_code: targetLanguageCode },
		});

		if (!targetLanguage) {
			throw new Error(
				`Target language with code ${targetLanguageCode} not found.`,
			);
		}

		// 1. Read and Parse CSV File
		const csvData: CSVRow[] = await new Promise((resolve, reject) => {
			const rows: CSVRow[] = [];
			fs.createReadStream(csvFilePath)
				.pipe(csv())
				.on("data", (row: CSVRow) => {
					rows.push(row);
				})
				.on("end", () => resolve(rows))
				.on("error", reject);
		});

		// 2. Process Data from CSV
		for (const row of csvData) {
			const { title, topics, difficulty } = row;
			if (!title || !topics) continue;

			// 2.1 Handle Topics
			const topicNames = topics.split(",").map((t) => t.trim());
			const crosswordTopics: Topic[] = [];
			for (const topicName of topicNames) {
				const topicKey = `${targetLanguage.language_code}-${topicName}`;
				if (!topicsMap.has(topicKey)) {
					const topicEntity = new Topic();
					topicEntity.topic_name = topicName;
					topicEntity.language = targetLanguage;
					topicsMap.set(topicKey, topicEntity);
				}
				crosswordTopics.push(topicsMap.get(topicKey));
			}
			console.log({ difficulty });
			// 2.3 Handle Crosswords
			const crossword = new Crossword();
			crossword.title = title;
			crossword.language = targetLanguage;
			crossword.is_Public = true;
			crossword.difficulty = difficulty;
			crossword.topics = crosswordTopics;

			crosswords.push(crossword);

			// 2.2 Handle Words and CrosswordWords
			for (let i = 1; i <= 12; i++) {
				const wordText = getWordFromRow(row, i);
				const definition = getDefinitionFromRow(row, i);
				if (!definition || definition.trim().length === 0) {
					break;
				}
				if (wordText && definition) {
					const wordKey = `${targetLanguage.language_code}-${wordText}`; // Composite key

					if (!wordsMap.has(wordKey)) {
						// Check if the word already exists in the database
						let word = await queryRunner.manager.findOne(Words, {
							where: {
								word_text: wordText,
								language: targetLanguage,
							},
						});

						if (!word) {
							// Create a new word entity
							const wordEntity = new Words();
							wordEntity.word_text = wordText;
							wordEntity.language = targetLanguage;
							wordEntity.definition = definition;
							wordsMap.set(wordKey, wordEntity);
							word = await queryRunner.manager.save(wordEntity);
						}
						wordsMap.set(wordKey, word);
					}
				}
			}
		}
		// 3. Insert Data in Batches (Transaction)
		await queryRunner.startTransaction();
		try {
			const savedTopics = await queryRunner.manager.save(
				Array.from(topicsMap.values()),
			);
			// 3.1 Insert Topics

			try {
				// 3.2 Insert Words
				const savedWords = await queryRunner.manager.save(
					Array.from(wordsMap.values()),
				);
			} catch (error) {
				console.error("Error inserting topics:", error);
				throw error;
			}

			// 3.3 Insert Crosswords
			const savedCrosswords = await queryRunner.manager.save(crosswords);

			// 3.4 Create the words linking them to the crossword.
			const crosswordWords: CrosswordWord[] = [];
			for (const row of csvData) {
				const { title } = row;
				const crossword = await queryRunner.manager.findOne(Crossword, {
					where: { title },
				});

				for (let i = 1; i <= 12; i++) {
					const wordText = getWordFromRow(row, i);
					const definition = getDefinitionFromRow(row, i);
					if (wordText && definition) {
						const wordKey = `${targetLanguage.language_code}-${wordText}`; // Composite key
						const word = wordsMap.get(wordKey); // Get the word from the map

						if (word) {
							crosswordWords.push(
								queryRunner.manager.create(CrosswordWord, {
									words: word,
									crossword: crossword,
									clue: definition,
								}),
							);
						}
					}
				}
			}
			try {
				await queryRunner.manager.save(CrosswordWord, crosswordWords);
			} catch (error) {
				console.error("Error inserting crossword words:", error);
				throw error;
			}
			await queryRunner.commitTransaction();
		} catch (error) {
			await queryRunner.rollbackTransaction();
			console.error("Error inserting data:", error);
			throw error;
		}
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query("DELETE FROM crossword_word");
		await queryRunner.query("DELETE FROM crossword_topics");
		await queryRunner.query("DELETE FROM crossword");
		await queryRunner.query("DELETE FROM topic");
		await queryRunner.query("DELETE FROM words");
	}
}
