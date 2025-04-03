import type { Difficulty, LanguageCode } from "@verbaquest/types";
import type { Request } from "express";

export interface AuthRequest extends Request {
  user: {
    email: string;
    userId: number;
    preferred_difficulty: Difficulty;
    app_language: LanguageCode;
    preferred_language: LanguageCode;
  };
}
