import type { Flashcard } from "@prisma/client";

export type FlashCardWithSchedule = Flashcard & {
  schedule: {
    dueDate: Date;
  };
};

export const calculateInterval = (previousInterval: number, rating: number) => {
  // leitner system interval calculation
  // https://en.wikipedia.org/wiki/Leitner_system

  // rating should not be negative or greater than 4
  //const cleanedRating = Math.max(0, Math.min(rating, 4));

  switch (rating) {
    case 4:
      return previousInterval * 2;
    case 3:
      return previousInterval;
    default:
      return previousInterval / 2;
  }
};

export const getNextFlashcard = (flashcards: FlashCardWithSchedule[]) => {
  // sort flashcards by schedule due date
  const sortedFlashcards = flashcards.sort((a, b) => {
    return a.schedule.dueDate.getTime() - b.schedule.dueDate.getTime();
  });

  const now = new Date();

  // get the first flashcard that is due
  const nextFlashcard = sortedFlashcards.find((flashcard) => {
    return flashcard.schedule.dueDate.getTime() <= now.getTime();
  });

  return nextFlashcard || null;
};

// export const spacedRepetition = (
//   lastInterval: number,
//   lastFactor: number,
//   quality: number
// ) => {
//   const interval = lastInterval * lastFactor;
//   const factor =
//     lastFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
//   return {
//     interval,
//     factor,
//   };
// };
