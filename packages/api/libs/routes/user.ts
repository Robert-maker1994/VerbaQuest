import express from "express";
import { authMiddleware } from "../auth/authMiddleware";
import {
	createUserController,
	deleteUserController,
	getUserController,
	updateUserController,
} from "../controller/user";

const userRouter = express.Router();

userRouter.post("/", authMiddleware, createUserController);
userRouter.get("/:id", authMiddleware, getUserController);
userRouter.put("/:id", authMiddleware, updateUserController);
userRouter.delete("/:id", authMiddleware, deleteUserController);

export default userRouter;
