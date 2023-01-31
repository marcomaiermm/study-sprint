import type { SuperMemoItem } from "@prisma/client";

type Grade = 0 | 1 | 2 | 3 | 4 | 5;

/**
 * Implements SM-18 algorithm
 */
// export const supermemo = (item: SuperMemoItem, grade: Grade) => {
//   const { easiness, repetitions, interval } = item;

//   const newRepetitions = grade < 3 ? 0 : repetitions + 1;
// };
