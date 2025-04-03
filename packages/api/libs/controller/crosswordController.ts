import type { CrosswordDetailsResponse } from "@verbaquest/types";
import type { NextFunction, Response } from "express";
import { generateCrossword } from "../../utils/generateCrossword";
import matchCrosswordsForMetadata from "../../utils/matchCrosswordForMetadata";
import { CrosswordError } from "../errors";
import crosswordService from "../services/crosswordService";
import type { AuthRequest } from "../types/authRequest";

const crosswordController = {
  /**
   * @async
   * @function getById
   * @description Retrieves a crossword by its ID.
   * @param {AuthRequest} req - The authenticated request object.
   * @param {Response} res - The response object.
   * @param {NextFunction} next - The next middleware function.
   * @returns {Promise<void>} - A promise that resolves when the response is sent.
   * @throws {CrosswordError} - Throws an error if the crossword is not found or if there are invalid parameters.
   * @returns {CrosswordResponse} - The crossword response.
   */
  async getById(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (!req.params.id) {
        console.info("No id provided for getCrosswordById crossword");
        throw new CrosswordError("INVALID_PARAMS", 404);
      }

      const crossword = await crosswordService.getCrosswordById(Number.parseInt(req.params.id));

      if (!crossword) {
        throw new CrosswordError("No crosswords found", 404);
      }

      const words = crossword.crosswordWords.map((v) => v.words.word_text);

      if (!words.length) {
        res.send(204);
        return;
      }

      const [grid, metadata] = generateCrossword(words);

      const response = await matchCrosswordsForMetadata(crossword, metadata, grid, req.user.app_language);

      res.send(response);
    } catch (err) {
      next(err);
    }
  },

  /**
   * @async
   * @function getDetails
   * @description Retrieves details of multiple crosswords with optional search and pagination.
   * @returns {Promise<void>} - A promise that resolves when the response is sent.
   * @throws {CrosswordError} - Throws an error if there are issues with the crossword data.
   * @returns {CrosswordDetailsResponse} {200} - The crossword details response.
   * @response {500} {object} - Internal server error.
   */
  async getDetails(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { userId, preferred_language } = req.user;

      const search = req?.query.search as string | undefined;
      const page = req?.query.page as string | undefined;
      const [crosswords, totalCount] = await crosswordService.getCrosswordDetails(
        userId,
        preferred_language,
        search,
        page ? Number.parseInt(page) : undefined,
      );

      const response: CrosswordDetailsResponse = {
        crosswords,
        totalCount,
        currentPage: page ? Number.parseInt(page) : 1,
        pageSize: 10,
        totalPages: Math.ceil(totalCount / 10),
      };

      res.send(response);
    } catch (err) {
      next(err);
    }
  },

  /**
   * @async
   * @function deleteUserCrossword
   * @description Deletes a crossword by its ID or name.
   * @param {AuthRequest} req - The authenticated request object.
   * @param {Response} res - The response object.
   * @param {NextFunction} next - The next middleware function.
   * @returns {Promise<void>} - A promise that resolves when the response is sent.
   * @throws {CrosswordError} - Throws an error if the crossword is not found or if there are invalid parameters.
   * @response {200} {string} - The crossword has been deleted.
   * @response {404} {object} - The crossword was not found.
   * @response {500} {object} - Internal server error.
   */
  async deleteUserCrossword(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const name = req.query?.name && { name: String(req.query?.name) };
      const id = req.query?.id && { id: String(req.query?.id) };

      const params = {
        ...id,
        ...name,
      };

      await crosswordService.deleteCrossword(params);

      res.status(200).send("Crossword has been delete");
    } catch (err) {
      next(err);
    }
  },
};

export default crosswordController;
