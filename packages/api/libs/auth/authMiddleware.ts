import { Request, Response, NextFunction } from "express";
import admin from "./admin";
import { DecodedIdToken } from "firebase-admin/lib/auth/token-verifier";

interface QuestRequest extends Request {
  user: DecodedIdToken
}

class UnauthorizedError extends Error {
  public statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
  }
}

export async function authMiddleware(req: QuestRequest, res: Response, next: NextFunction) {
  const token = req.headers.authorization?.split("Bearer ")[1];

  if (!token) {
   throw new UnauthorizedError("Unauthorized", 401)
  }

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = decodedToken;

    next();
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      res.status(error.statusCode).send(error.message);
    }  else {

     res.status(500).send("Internal Error")
    }
  }
}