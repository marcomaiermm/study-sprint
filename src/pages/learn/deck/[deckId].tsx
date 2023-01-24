import { useSession, getSession } from "next-auth/react";
import { prisma } from "@server/db";
import Link from "next/link";
import FlashCard from "@components/flashcard";

import type {
  GetServerSideProps,
  NextPage,
  InferGetServerSidePropsType,
} from "next";

import type { Deck, Flashcard } from "@prisma/client";

const DeckPage: NextPage<
  InferGetServerSidePropsType<typeof getServerSideProps>
> = ({ deck }) => {
  const { data: sessionData } = useSession();

  if (!sessionData) return <div>Nicht eingeloggt</div>;
  return (
    <>
      <div className="flex justify-center">
        <div className="container">
          <Link
            href={
              deck.flashcards.length
                ? `/deck/${deck.id}/flashcard`
                : `/deck/${deck.id}/flashcard/create`
            }
          >
            <h1>Deck: {deck.name}</h1>
            <p>{deck.id}</p>
          </Link>

          <div className="mt-8">
            <h2>Flashcards</h2>
            <div className="grid grid-cols-4">
              {deck.flashcards.map((card) => (
                <Link
                  href={`/deck/${deck.id}/flashcard/${card.id}`}
                  key={card.id}
                >
                  <div className="h-[12rem]">
                    <FlashCard flashcard={card} blockFlip={true} />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export const getServerSideProps: GetServerSideProps<{
  deck: Deck & { flashcards: Omit<Flashcard, "userId" | "deckId" | "user">[] };
}> = async (ctx) => {
  const session = await getSession(ctx);
  const deckId = ctx.params?.deckId;

  if (!session || !session.user) {
    throw new Error("You must be logged in to view this page");
  }

  if (!deckId || !deckId || typeof deckId !== "string") {
    throw new Error("Deck ID is not valid");
  }

  // make a prisma query to find the deck if it is owned or shared with the user
  const deck = await prisma.deck.findFirst({
    where: {
      id: deckId,
      OR: [
        {
          owner: { id: session.user.id },
        },
        {
          sharedDeck: {
            some: {
              id: session.user.id,
            },
          },
        },
      ],
    },
    include: {
      flashcards: {
        select: {
          question: true,
          answer: true,
          id: true,
        },
      },
    },
  });

  if (!deck) {
    throw new Error("Deck does not exist or is not shared with you");
  }

  return { props: { deck } };
};

export default DeckPage;
