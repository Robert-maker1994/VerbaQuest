import Crossword from "./crossword";


describe("crossword", () => {
    const words = ["apple", "banana", "orange", "grape", "melon", "kiwi", "mango", "peach", "pear", "plum",
        "red", "blue", "green", "yellow", "purple", "pink", "black", "white", "gray", "brown",
        "cat", "dog", "bird", "fish", "horse", "cow", "sheep", "pig", "chicken", "duck",
        "house", "car", "tree", "flower", "sun", "moon", "star", "water", "fire", "earth"];

    const crossword = new Crossword(words);

    describe("place word", () => {
        test("Return true if the word can be placed", () => {
            expect(crossword.placeWord("beef", 4, 9)).toBe(true)
        });

        test("Return false if the word can be placed", () => {
            expect(crossword.placeWord("beef", 14, 14)).toBe(false)
        });
    })


    describe("Boundary check", () => {
        test("Horizontal - A word that extends beyond the right edge of the board.", () => {
            expect(crossword.canPlaceHorizontal("chicken", 10, 5)).toBe(false)
        });



        test("Horizontal - check if cell is occupied by a different letter.", () => {
            const cwd = new Crossword(words);
            expect(cwd.canPlaceHorizontal("beef", 10, 9)).toBe(true)

            cwd.placeWord("beef", 4, 9)
            expect(cwd.canPlaceHorizontal("chicken", 6, 9)).toBe(false)

        });


        test("Vertical - check if cell is occupied by a different letter.", () => {
            const cwd = new Crossword(words);
            expect(cwd.placeWord("chicken", 2, 5)).toBe(true)

            expect(cwd.canPlaceVertical("beef", 7, 4)).toBe(true);
            expect(cwd.placeWord("beef", 7, 4)).toBe(true)
            cwd.display()

        });

    });
});