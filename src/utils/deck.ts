import { prisma } from "@server/db";

export const sharedOrOwnedDeck = async (deckId: string, userId: string) => {
  const deck = await prisma.deck.findFirst({
    where: {
      id: deckId,
      OR: [
        {
          owner: {
            id: userId,
          },
        },
        {
          sharedDeck: {
            some: {
              id: userId,
            },
          },
        },
      ],
    },
  });

  return !!deck;
};
