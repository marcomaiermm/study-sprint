import { describe, it, expect } from "vitest";
import { generateFlashCards } from "../../__mocks__/data";
import { calculateInterval, getNextFlashcard } from "../../../utils/learn";

/**
 * The flashcard is new and has never been seen before
 * The flashcard has been answered correctly multiple times
 * The flashcard has been answered incorrectly multiple times
 * And also the maximum and minimum intervals
 */
describe("calculateInterval", () => {
  it("should return correct interval for a new flashcard", () => {
    expect(calculateInterval(0, 0)).toEqual(1);
  });

  it("should return correct interval for a flashcard with previous correct answers", () => {
    expect(calculateInterval(1, 3)).toEqual(6);
    expect(calculateInterval(2, 4)).toEqual(24);
  });

  it("should return correct interval for a flashcard with previous incorrect answers", () => {
    expect(calculateInterval(1, 2)).toEqual(1);
    expect(calculateInterval(2, 3)).toEqual(2);
  });

  it("should return the minimum interval of 1 for a flashcard that has been answered incorrectly multiple times", () => {
    expect(calculateInterval(4, 6)).toEqual(1);
  });

  it("should return the maximum interval of 1440 for a flashcard that has been answered correctly many times", () => {
    expect(calculateInterval(10, 14)).toEqual(1440);
  });
});
