import CrosswordGenerator from '../../utils/crossword-generator'; // Adjust path as needed

describe('CrosswordGenerator', () => {
    let generator: CrosswordGenerator;

    beforeEach(() => {
        generator = new CrosswordGenerator();
    });

    it('should generate a crossword with valid words', () => {
        const words = ["JAVASCRIPT", "HTML", "CSS", "REACT", "NODE"];
        const crossword = generator.generateCrossword(words);

        expect(crossword).not.toBeNull();
        expect(Array.isArray(crossword)).toBe(true);
        expect(crossword!.length).toBeGreaterThan(0);

    });


});