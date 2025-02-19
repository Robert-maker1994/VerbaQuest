import "reflect-metadata"
import express from 'express';
import crosswordRouter from './libs/routes/crossword';
require("dotenv").config();


const app = express();
const port = process.env.PORT || 3000;

app.use('/crossword', crosswordRouter);

app.listen(port, () => {

  console.log(`Server listening on port https://localhost:${port}`);
});

