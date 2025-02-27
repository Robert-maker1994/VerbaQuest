import express from "express";
import { getCrossword, createNewCrossword, deleteUserCrossword, updateUserCrossword } from "../controller/crossword";
import { authMiddleware } from "../auth/authMiddleware";

const crosswordRouter = express.Router();

crosswordRouter.get("/", getCrossword);
crosswordRouter.get("/:id", getCrossword);
crosswordRouter.get("/search", getCrossword);
crosswordRouter.post("/", authMiddleware, createNewCrossword);
crosswordRouter.put("/", authMiddleware, updateUserCrossword);
crosswordRouter.delete("/", authMiddleware, deleteUserCrossword);


export default crosswordRouter;
