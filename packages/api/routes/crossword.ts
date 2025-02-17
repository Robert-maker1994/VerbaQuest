import { getCrosswordByFilter } from "../controller/crossword";

const express = require('express');
const crosswordRouter = express.Router();

crosswordRouter.get('/', getCrosswordByFilter);


export default crosswordRouter;
