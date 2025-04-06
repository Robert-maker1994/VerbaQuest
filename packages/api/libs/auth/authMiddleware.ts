import type { NextFunction, Response } from "express";
import config from "../config";
import type { User } from "../entity";
import { UnauthorizedError, UserError } from "../errors";
import userService from "../services/userService";
import type { AuthRequest } from "../types/authRequest";
import admin from "./firebaseAdmin";

export enum AuthMode {
  FIREBASE = "FIREBASE",
  LOCAL = "LOCAL",
}

export async function authMiddleware(req: AuthRequest, _res: Response, next: NextFunction) {
  try {
    const token = req.headers.authorization?.split("Bearer ")[1];
    let userRepo: User;
    if (!token) {
      throw new UnauthorizedError("Not token provided", 401);
    }
    if (config.authMode === AuthMode.FIREBASE) {
      const decodedToken = await admin.auth().verifyIdToken(token);

      if (!decodedToken.email) {
        throw new UserError("USER_NOT_FOUND", 500);
      }

      userRepo = await userService.getUserByEmail(decodedToken.email);
    }

    if (config.authMode === AuthMode.LOCAL) {
      if (config.authDefaultToken !== token) {
        throw new UnauthorizedError("DEFAULT_TOKEN_NOT_VALID", 401);
      }

      userRepo = await userService.getUserByEmail(config.authDefaultEmail);
    }
    req.user = {
      email: userRepo.email,
      userId: userRepo.user_id,
      preferred_language: userRepo.preferred_learning_language,
      preferred_difficulty: userRepo.preferred_difficulty,
      app_language: userRepo.app_language,
    };

    next();
  } catch (error) {
    next(error);
  }
}
