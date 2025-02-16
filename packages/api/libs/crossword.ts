

class CrosswordGenerator {
    private board: (string | null)[][];
    private wordArr: string[];
    private wordBank: WordObj[];
    private wordsActive: WordObj[];
    private bounds: Bounds;

    constructor() {
        this.board = [];
        this.wordArr = [];
        this.wordBank = [];
        this.wordsActive = [];
        this.bounds = new Bounds();
    }

    public generateCrossword(words: string[]): string[][] | null {
        this.wordArr = words;
        this.cleanVars();

        for (let i = 0; i < 10; i++) { 
            this.cleanVars();
            if (this.populateBoard()) {
                return this.boardToArrays();
            }
        }

        return null;
    }

    private boardToArrays(): string[][] {
        const crossword: string[][] = [];
        for (let i = this.bounds.top - 1; i < this.bounds.bottom + 2; i++) {
            const row: string[] = [];
            for (let j = this.bounds.left - 1; j < this.bounds.right + 2; j++) {
                row.push(this.board[j][i] || "");
            }
            crossword.push(row);
        }
        return crossword;
    }

    private cleanVars(): void {
        this.bounds.clean();
        this.wordBank = [];
        this.wordsActive = [];
        this.board = [];

        for (let i = 0; i < 32; i++) {
            this.board.push([]);
            for (let j = 0; j < 32; j++) {
                this.board[i].push(null);
            }
        }
    }


    private populateBoard(): boolean {
        this.prepareBoard();

        for (let i = 0; i < this.wordBank.length; i++) {
            if (!this.addWordToBoard()) {
                return false;
            }
        }
        return true;
    }

    private prepareBoard(): void {
        this.wordBank = this.wordArr.map(word => new WordObj(word));

        for (const wA of this.wordBank) {
            for (const cA of wA.char) {
                for (const wB of this.wordBank) {
                    if (wA !== wB) {
                        for (const cB of wB.char) {
                            if (cA === cB) {
                                wA.totalMatches++;
                            }
                        }
                    }
                }
            }
        }
    }
    private addWordToBoard(): boolean {
        let i: number, len: number, curIndex: number, curWord: WordObj, curChar: string, curMatch: number, testWord: WordObj, testChar: string,
            minMatchDiff: number = 9999, curMatchDiff: number;

        if (this.wordsActive.length < 1) {
            curIndex = 0;
            for (i = 0, len = this.wordBank.length; i < len; i++) {
                if (this.wordBank[i].totalMatches < this.wordBank[curIndex].totalMatches) {
                    curIndex = i;
                }
            }
            this.wordBank[curIndex].successfulMatches = [{ x: 12, y: 12, dir: 0 }];
        } else {
            curIndex = -1;

            for (i = 0, len = this.wordBank.length; i < len; i++) {
                curWord = this.wordBank[i];
                curWord.effectiveMatches = 0;
                curWord.successfulMatches = [];
                for (let j = 0, lenJ = curWord.char.length; j < lenJ; j++) {
                    curChar = curWord.char[j];
                    for (let k = 0, lenK = this.wordsActive.length; k < lenK; k++) {
                        testWord = this.wordsActive[k];
                        for (let l = 0, lenL = testWord.char.length; l < lenL; l++) {
                            testChar = testWord.char[l];

                            if (curChar === testChar) {
                                curWord.effectiveMatches++;

                                const curCross = { x: testWord.x, y: testWord.y, dir: 0 };
                                if (testWord.dir === 0) {
                                    curCross.dir = 1;
                                    curCross.x += l;
                                    curCross.y -= j;
                                } else {
                                    curCross.dir = 0;
                                    curCross.y += l;
                                    curCross.x -= j;
                                }

                                let isMatch = true;

                                for (let m = -1, lenM = curWord.char.length + 1; m < lenM; m++) {
                                    const crossVal: (string | null)[] = [];
                                    if (m !== j) {
                                        if (curCross.dir === 0) {
                                            const xIndex = curCross.x + m;

                                            if (xIndex < 0 || xIndex > this.board.length) {
                                                isMatch = false;
                                                break;
                                            }

                                            crossVal.push(this.board[xIndex][curCross.y]);
                                            crossVal.push(this.board[xIndex][curCross.y + 1]);
                                            crossVal.push(this.board[xIndex][curCross.y - 1]);
                                        } else {
                                            const yIndex = curCross.y + m;

                                            if (yIndex < 0 || yIndex > this.board[curCross.x].length) {
                                                isMatch = false;
                                                break;
                                            }

                                            crossVal.push(this.board[curCross.x][yIndex]);
                                            crossVal.push(this.board[curCross.x + 1][yIndex]);
                                            crossVal.push(this.board[curCross.x - 1][yIndex]);
                                        }

                                        if (m > -1 && m < lenM - 1) {
                                            if (crossVal[0] !== curWord.char[m]) {
                                                if (crossVal[0] !== null) {
                                                    isMatch = false;
                                                    break;
                                                } else if (crossVal[1] !== null) {
                                                    isMatch = false;
                                                    break;
                                                } else if (crossVal[2] !== null) {
                                                    isMatch = false;
                                                    break;
                                                }
                                            }
                                        } else if (crossVal[0] !== null) {
                                            isMatch = false;
                                            break;
                                        }
                                    }
                                }

                                if (isMatch) {
                                    curWord.successfulMatches.push(curCross);
                                }
                            }
                        }
                    }
                }

                curMatchDiff = curWord.totalMatches - curWord.effectiveMatches;

                if (curMatchDiff < minMatchDiff && curWord.successfulMatches.length > 0) {
                    minMatchDiff = curMatchDiff;
                    curIndex = i;
                } else if (curMatchDiff <= 0) {
                    return false;
                }
            }
        }

        if (curIndex === -1) {
            return false;
        }

        const spliced = this.wordBank.splice(curIndex, 1);
        this.wordsActive.push(spliced[0]);

        const pushIndex = this.wordsActive.length - 1;
        const rand = Math.random();
        const matchArr = this.wordsActive[pushIndex].successfulMatches;
        const matchIndex = Math.floor(rand * matchArr.length);
        const matchData = matchArr[matchIndex];

        this.wordsActive[pushIndex].x = matchData.x;
        this.wordsActive[pushIndex].y = matchData.y;
        this.wordsActive[pushIndex].dir = matchData.dir;

        for (i = 0, len = this.wordsActive[pushIndex].char.length; i < len; i++) {
            let xIndex = matchData.x;
            let yIndex = matchData.y;

            if (matchData.dir === 0) {
                xIndex += i;
                this.board[xIndex][yIndex] = this.wordsActive[pushIndex].char[i];
            } else {
                yIndex += i;
                this.board[xIndex][yIndex] = this.wordsActive[pushIndex].char[i];
            }

            this.bounds.update(xIndex, yIndex);
        }

        return true;
    }
}


class Bounds {
    top: number;
    right: number;
    bottom: number;
    left: number;

    constructor() {
        this.top = 0;
        this.right = 0;
        this.bottom = 0;
        this.left = 0;
    }

    update(x: number, y: number): void {
        this.top = Math.min(y, this.top);
        this.right = Math.max(x, this.right);
        this.bottom = Math.max(y, this.bottom);
        this.left = Math.min(x, this.left);
    }

    clean(): void {
        this.top = 999;
        this.right = 0;
        this.bottom = 0;
        this.left = 999;
    }
}

class WordObj {
    string: string;
    char: string[];
    totalMatches: number;
    effectiveMatches: number;
    successfulMatches: { x: number; y: number; dir: number }[];
    x: number;
    y: number;
    dir: number;

    constructor(stringValue: string) {
        this.string = stringValue;
        this.char = stringValue.split("");
        this.totalMatches = 0;
        this.effectiveMatches = 0;
        this.successfulMatches = [];
        this.x = 0;
        this.y = 0;
        this.dir = 0;
    }
}





export default CrosswordGenerator;