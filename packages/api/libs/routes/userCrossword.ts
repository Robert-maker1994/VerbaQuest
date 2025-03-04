import express from "express";
import {
	createUserCrosswordController,
	deleteUserCrosswordController,
	getUserCrosswordController,
	updateUserCrosswordController,
} from "../controller/userCrossword";

const userCrosswordRouter = express.Router();

userCrosswordRouter.post("/", createUserCrosswordController);
userCrosswordRouter.get("/:id", getUserCrosswordController);
userCrosswordRouter.put("/:id", updateUserCrosswordController);
userCrosswordRouter.delete("/:id", deleteUserCrosswordController);

export default userCrosswordRouter;
