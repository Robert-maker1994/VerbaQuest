import express from "express";
import { authMiddleware } from "../auth/authMiddleware";
import crosswordController from "../controller/crosswordController";

const crosswordRouter = express.Router();

/**
 * @swagger
 * tags:
 *   name: Crossword
 *   description: API endpoints for managing crosswords
 */

/**
 * @swagger
 * /crossword/details:
 *   get:
 *     summary: Get details
 *     description: Retrieve details of multiple crosswords, with optional search and pagination.
 *     tags: [Crossword]
 *     security:
 *       - bearerAuth: []
 *     interface:
 *       - CrosswordResponse
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Optional search term to filter crosswords by title.
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Optional page number for pagination.
 *     responses:
 *       200:
 *         description: Crossword details retrieved successfully.
 *       500:
 *         description: Internal server error.
 */
crosswordRouter.get("/details", authMiddleware, crosswordController.getDetails);

/**
 * @swagger
 * /crossword/{id}:
 *   get:
 *     summary: Get a crossword by ID
 *     description: Retrieve a crossword by its unique identifier.
 *     tags: [Crossword]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the crossword to retrieve.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Crossword retrieved successfully.
 *       401:
 *          Unauthorized
 *       404:
 *         description: Crossword not found.
 *       500:
 *         description: Internal server error.
 */
crosswordRouter.get("/:id", authMiddleware, crosswordController.getById);

/**
 * @swagger
 * /crossword:
 *   delete:
 *     summary: Delete a crossword
 *     description: Delete a crossword by its ID or name.
 *     tags: [Crossword]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: id
 *         required: false
 *         description: ID of the crossword to delete.
 *         schema:
 *           type: string
 *       - in: query
 *         name: name
 *         required: false
 *         description: Name of the crossword to delete.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Crossword deleted successfully.
 *       401:
 *         description: Cannot delete a public crossword.
 *       404:
 *         description: Crossword not found.
 *       500:
 *         description: Internal server error.
 */
crosswordRouter.delete("/", authMiddleware, crosswordController.deleteUserCrossword);

export default crosswordRouter;
