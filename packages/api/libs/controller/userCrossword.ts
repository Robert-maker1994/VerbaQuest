import type {  Response, NextFunction } from "express";
import { createUserCrossword, getUserCrossword, updateUserCrossword, deleteUserCrossword } from "../services/userCrossword";
import type { AuthRequest } from "../types/questRequest";

export const createUserCrosswordController = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const userCrossword = await createUserCrossword(req.body);
        res.status(201).json(userCrossword);
    } catch (err) {
        next(err);
    }
};

export const getUserCrosswordController = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const userCrossword = await getUserCrossword(Number(req.params.id));
        res.status(200).json(userCrossword);
    } catch (err) {
        next(err);
    }
};

export const updateUserCrosswordController = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const userCrossword = await updateUserCrossword(Number(req.params.id), req.body);
        res.status(200).json(userCrossword);
    } catch (err) {
        next(err);
    }
};

export const deleteUserCrosswordController = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        await deleteUserCrossword(Number(req.params.id));
        res.status(204).send();
    } catch (err) {
        next(err);
    }
};