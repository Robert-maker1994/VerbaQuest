import express, { type NextFunction, type Response } from "express";
import { CustomError } from "../errors/customError";
import { userVerbService } from "../services";
import type { AuthRequest } from "../types/authRequest";

const userVerbRouter = express.Router();

/**
 * @swagger
 * tags:
 *   name: User Verb Groups
 *   description: API endpoints for managing User Verb Groups
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     VerbGroup:
 *       type: object
 *       properties:
 *         group_id:
 *           type: integer
 *           description: The unique identifier for the verb group.
 *         group_name:
 *           type: string
 *           description: The name of the verb group.
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: The date and time the verb group was created.
 *         userVerbGroups:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               user_verb_group_id:
 *                 type: integer
 *                 description: The unique identifier for the user verb group.
 *               verb:
 *                 type: object
 *                 properties:
 *                   verb_id:
 *                     type: integer
 *                     description: The unique identifier for the verb.
 *                   word:
 *                     type: object
 *                     properties:
 *                       word_text:
 *                         type: string
 *                         description: The text of the word.
 *     PostUserVerbGroup:
 *       type: object
 *       required:
 *         - title
 *         - verbsIds
 *       properties:
 *         title:
 *           type: string
 *           description: The name of the verb group.
 *         verbsIds:
 *           type: array
 *           items:
 *             type: integer
 *           description: An array of verb IDs to add to the group.
 */

/**
 * @swagger
 * /user-verb:
 *   get:
 *     summary: Get all user verb groups
 *     description: Retrieve all verb groups for the authenticated user.
 *     tags: [User Verb Groups]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Verb groups retrieved successfully.
 *       500:
 *         description: Internal server error.
 */
userVerbRouter.get("/", async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user.userId;
    const userVerbs = await userVerbService.getAll(userId);
    res.status(200).json(userVerbs);
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /user-verb:
 *   post:
 *     summary: Create a new user verb group
 *     description: Create a new verb group for the authenticated user.
 *     tags: [User Verb Groups]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PostUserVerbGroup'
 *     responses:
 *       201:
 *         description: Verb group created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/VerbGroup'
 *       400:
 *         description: Invalid request body.
 *       409:
 *         description: A group with the same name already exists.
 *       500:
 *         description: Internal server error.
 */
userVerbRouter.post("/", async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user.userId;
    const { verbsIds, title } = req.body;
    if (!verbsIds.length || !title) {
      throw new CustomError("INVALID_PARAMS", 400);
    }

    for (let i = 0; i < verbsIds.length; i++) {
      const newVerbs = []
      if (newVerbs.includes(verbsIds[i])) {
        console.info("Cannot add the same verb twice to the group")
        throw new CustomError("INVALID_PARAMS", 405);
      }
      newVerbs.push(verbsIds[i])

    }

    const userVerb = await userVerbService.create(userId, verbsIds, title);
    res.status(201).json(userVerb);
  } catch (error) {
    next(error);
  }
});

userVerbRouter.patch("/", async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user.userId;
    const { verbsIds, title, groupId } = req.body;
    if (!verbsIds.length || !title) {
      throw new CustomError("INVALID_PARAMS", 400);
    }

    for (let i = 0; i < verbsIds.length; i++) {
      const newVerbs = []
      if (newVerbs.includes(verbsIds[i])) {
        console.info("Cannot add the same verb twice to the group")
        throw new CustomError("INVALID_PARAMS", 405);
      }
      newVerbs.push(verbsIds[i])

    }

    const userVerb = await userVerbService.update(userId, verbsIds, groupId, title);

    res.status(200).json(userVerb);
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /user-verb/{userVerbId}:
 *   delete:
 *     summary: Delete a user verb group
 *     description: Delete a verb group by its ID for the authenticated user.
 *     tags: [User Verb Groups]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userVerbId
 *         required: true
 *         description: The ID of the verb group to delete.
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Verb group deleted successfully.
 *       400:
 *         description: Invalid userVerbId.
 *       404:
 *         description: Verb group not found.
 *       500:
 *         description: Internal server error.
 */
userVerbRouter.delete("/:userVerbId", async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { userVerbId } = req.params;
    if (!userVerbId) {
      throw new CustomError("INVALID_PARAMS", 400);
    }
    await userVerbService.delete(req.user.userId, Number(userVerbId));

    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

export default userVerbRouter;
