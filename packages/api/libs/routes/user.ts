import { type Request, type Response, Router } from "express";
import userService from "../services/user";
import { UserError } from "../errors";
import type { AuthRequest } from "../types/questRequest";

const userRouter = Router();

userRouter.get("/", async (req: AuthRequest, res: Response) => {
	const user = await userService.getUserById(req.user.userId);
	if (!user) {
		throw new UserError("User not found", 404);
	}
	res.json(user);
});


userRouter.post("/", async (req: AuthRequest, res: Response) => {
	const user = await userService.createUser(req.body)
	if (!user) {
		throw new UserError("Error creating a user", 500);
	}
	res.json(user);
});

userRouter.patch("/:id/settings", async (req: AuthRequest, res: Response) => {

	const user = await userService.updateUserSettings(req.user.userId, req.body)
	if (!user) {
		throw new UserError("Error creating a user", 500);
	}
	res.json(user);
});








export default userRouter;
