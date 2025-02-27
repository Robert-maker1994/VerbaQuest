import express from "express";
import { createUserController, getUserController, updateUserController, deleteUserController } from "../controller/user";
import { authMiddleware } from "../auth/authMiddleware";

const userRouter = express.Router();

userRouter.post("/", authMiddleware, createUserController);
userRouter.get("/:id", authMiddleware, getUserController);
userRouter.put("/:id", authMiddleware, updateUserController);
userRouter.delete("/:id", authMiddleware,deleteUserController);

export default userRouter;