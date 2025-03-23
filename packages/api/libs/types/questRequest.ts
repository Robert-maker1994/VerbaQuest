import type { Request } from "express";
import type { Difficulty, LanguageCode } from "shared";

export type QuestUser = {
	email: string;
	userId: number;
	preferred_difficulty: Difficulty;
	app_language: LanguageCode;
	preferred_language: LanguageCode
};

export interface AuthRequest extends Request {
	user: QuestUser;
}
