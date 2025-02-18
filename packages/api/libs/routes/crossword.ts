import { getCrosswordByFilter as getCrossword } from "../controller/crossword";

const express = require('express');
const crosswordRouter = express.Router();

crosswordRouter.get('/', getCrossword);


export default crosswordRouter;
