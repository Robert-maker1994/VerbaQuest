import express from 'express';
require("dotenv").config();


const app = express();
const port = process.env.PORT || 3000;


app.listen(port, () => {

  console.log(`Server listening on port ${port}`);
});


const words = ["apple", "banana", "orange", "grape", "melon", "kiwi", "mango", "peach", "pear", "plum",
  "red", "blue", "green", "yellow", "purple", "pink", "black", "white", "gray", "brown",
  "cat", "dog", "bird", "fish", "horse", "cow", "sheep", "pig", "chicken", "duck",
  "house", "car", "tree", "flower", "sun", "moon", "star", "water", "fire", "earth"];

function generateCrossword(words: string[]) {

}



expect(generateCrossword(words)).toBe([[""], [""], [""],[""]])