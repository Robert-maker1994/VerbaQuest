import { describe, expect, it } from "vitest";
import { CellState } from "../pages/crossword/interface";
import { pickCellColor } from "./cellColourPicker";

describe("pickCellColor", () => {
  it("should return green for Correct cell state", () => {
    expect(pickCellColor(CellState.Correct, false)).toBe("lightgreen");
    expect(pickCellColor(CellState.Correct, true)).toBe("lightgreen");
  });

  it("should return red for Incorrect cell state", () => {
    expect(pickCellColor(CellState.Incorrect, false)).toBe("red");
    expect(pickCellColor(CellState.Incorrect, true)).toBe("red");
  });

  it("should return yellow for Partial cell state", () => {
    expect(pickCellColor(CellState.Partial, false)).toBe("yellow");
    expect(pickCellColor(CellState.Partial, true)).toBe("yellow");
  });

  it("should return lightyellow for default cell state when selected", () => {
    expect(pickCellColor(CellState.Empty, true)).toBe("lightyellow");
  });

  it("should return gradient for default cell state when not selected", () => {
    expect(pickCellColor(CellState.Empty, false)).toBe("linear-gradient(to bottom, #80deea, #4dd0e1)");
  });
});
