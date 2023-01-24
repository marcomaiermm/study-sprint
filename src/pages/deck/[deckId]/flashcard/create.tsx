import { useSession, getSession } from "next-auth/react";
import { prisma } from "@server/db";
import { api } from "@utils/api";
import { useEffect, useState } from "react";

import FlashcardComponent from "@components/flashcard";

import type { GetServerSideProps, NextPage } from "next";
import { useRouter } from "next/router";

const CreateFlashCard: NextPage<{
  deck: string;
}> = ({ deck }) => {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const router = useRouter();

  const { data: sessionData } = useSession();

  const mutate = api.flashcard.submit.useMutation();

  const onSubmitFlashcard = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!sessionData) return;
    if (!question) return;
    if (!answer) return;
    mutate.mutate({
      question: question,
      answer: answer,
      deck,
    });
  };

  useEffect(() => {
    if (mutate.isSuccess) {
      router
        .push(`/deck/${deck}/flashcard/${mutate.data.id}`)
        .catch((err) => console.error(err));
    }
  }, [mutate.isSuccess, mutate?.data?.id, router, deck]);

  if (!sessionData) return <div>Nicht eingeloggt</div>;
  return (
    <>
      <div>
        <h1>My Card</h1>
        <div className="h-[50vh] p-4">
          <form onSubmit={onSubmitFlashcard}>
            <label htmlFor="question">Question</label>
            <input
              type="text"
              id="question"
              value={question}
              className="text-black"
              onChange={(e) => setQuestion(e.target.value)}
            />

            <label htmlFor="answer">Answer</label>
            <input
              type="text"
              id="answer"
              className="text-black"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
            />

            <button type="submit">Create Card</button>
          </form>
        </div>
      </div>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getSession(ctx);
  const deckId = ctx.params?.deckId;

  if (!session || !session.user) {
    throw new Error("You must be logged in to view this page");
  }

  if (!deckId || !deckId || typeof deckId !== "string") {
    throw new Error("Deck ID is not valid");
  }

  const deck = await prisma.deck.findFirst({
    where: {
      id: deckId,
    },
  });

  if (!deck) {
    throw new Error("Deck does not exist or is not shared with you");
  }

  return { props: { deck: deck.id } };
};

export default CreateFlashCard;
