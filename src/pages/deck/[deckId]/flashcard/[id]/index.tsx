import { useSession, getSession } from "next-auth/react";
import { prisma } from "@server/db";

import FlashCard from "@components/flashcard";

import type {
  GetServerSideProps,
  InferGetServerSidePropsType,
  NextPage,
} from "next";
import type { Card } from "@prisma/client";

const UserDecks: NextPage<
  InferGetServerSidePropsType<typeof getServerSideProps>
> = ({ card }) => {
  const { data: sessionData } = useSession();

  if (!sessionData) return <div>Nicht eingeloggt</div>;
  return (
    <div className="flex flex-1 flex-col items-center justify-center">
      <div className="container h-[50vh] max-w-5xl">
        <FlashCard flashcard={card} />
      </div>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps<{
  card: Card;
}> = async (ctx) => {
  const session = await getSession(ctx);
  const deckId = ctx.params?.deckId;
  const cardId = ctx.params?.id;

  if (!session || !session.user) {
    throw new Error("You must be logged in to view this page");
  }

  if (!deckId || !deckId || typeof deckId !== "string") {
    throw new Error("Deck ID is not valid");
  }

  if (!cardId || !cardId || typeof cardId !== "string") {
    throw new Error("Card ID is not valid");
  }

  const card = await prisma.card.findFirst({
    where: {
      id: cardId,
      deckId: deckId,
    },
  });

  if (!card) {
    throw new Error("Card does not exist");
  }

  return {
    props: {
      card,
    },
  };
};

export default UserDecks;
