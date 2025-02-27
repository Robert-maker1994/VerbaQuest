import type { Request } from "express";

type QuestUser = {
	email: string;
	userId: number;
};

export interface AuthRequest extends Request {
	user: QuestUser;
}
