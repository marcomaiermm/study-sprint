import { type NextPage } from "next";
import { useSession } from "next-auth/react";

import { api } from "@utils/api";
import { useEffect, useMemo, useState } from "react";

import { HiTrash } from "react-icons/hi2";
import Link from "next/link";
import DeckComponent from "@components/deck";
import type { Deck } from "@prisma/client";

const DeckDisplay: React.FC<{ deck: Deck }> = ({ deck }) => {
  const flashcards = api.flashcard.getManyByDeck.useQuery(deck.id);

  const flashcardsDeck = useMemo(() => {
    if (!flashcards.data) return { ...deck, cards: [] };
    return { ...deck, cards: flashcards.data };
  }, [flashcards.data, deck]);

  return <DeckComponent deck={flashcardsDeck} />;
};

const DeckPage: NextPage = () => {
  const { data: sessionData } = useSession();
  const [deckName, setDeckName] = useState("");

  const mutation = api.deck.submit.useMutation();
  const deleteMutation = api.deck.delete.useMutation();

  const {
    data: decksQueryData,
    error: decksQueryError,
    isLoading: isDecksQueryLoading,
    refetch: refetchManyDecks,
  } = api.deck.getMany.useQuery();

  const onSubmitDeck = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!sessionData) return;
    if (!deckName) return;
    mutation.mutate(deckName);
    setDeckName("");
  };

  const onDeleteDeck = (deckId: string) => {
    if (!sessionData) return;
    deleteMutation.mutate(deckId);
    setDeckName("");
  };

  // REFETCH DECKS ON SUCCESSFUL MUTATION
  useEffect(() => {
    refetchManyDecks().catch((err) => console.error(err));
  }, [mutation.isSuccess, deleteMutation.isSuccess, refetchManyDecks]);

  return (
    <>
      <div>
        <h1>My Decks</h1>
        <div>
          <form onSubmit={onSubmitDeck}>
            <label htmlFor="deckName">Deck Name</label>
            <input
              className="text-black"
              type="text"
              id="deckName"
              value={deckName}
              onChange={(e) => setDeckName(e.target.value)}
            />

            <button type="submit">Create Deck</button>
          </form>

          {mutation.isSuccess && <p>Deck {mutation.data?.name} created!</p>}

          {mutation.error && (
            <p>Something went wrong! {mutation.error.message}</p>
          )}
        </div>

        <div className="bg-slate-800 py-8">
          <div>My cards</div>
          {isDecksQueryLoading && <p>Loading...</p>}
          {decksQueryError && <p>Something went wrong!</p>}
          <div className="flex flex-col gap-4">
            {decksQueryData?.map((deck) => (
              <div
                className="flex gap-4 rounded px-4 py-2 shadow duration-75 hover:bg-slate-700 hover:shadow-xl"
                key={deck.id}
              >
                <button onClick={() => onDeleteDeck(deck.id)}>
                  <HiTrash />
                </button>
                <Link href={`/deck/${deck.id}`}>
                  <DeckDisplay deck={deck} />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default DeckPage;
