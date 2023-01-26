import { faker } from "@faker-js/faker";

export const generateFlashCards = (count: number) => {
  const flashcards = Array.from({ length: count }, () => {
    // create random date between today, 2 weeks ago and 2 weeks in the future
    const randomDate = faker.date.between(
      new Date(new Date().getTime() - 14 * 24 * 60 * 60 * 1000),
      new Date(new Date().getTime() + 14 * 24 * 60 * 60 * 1000)
    );

    return {
      id: faker.datatype.uuid(),
      question: faker.lorem.sentence(),
      answer: faker.lorem.sentence(),
      userId: faker.datatype.uuid(),
      deckId: faker.datatype.uuid(),
      schedule: {
        dueDate: randomDate,
      },
    };
  });
  return flashcards;
};
