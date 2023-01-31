import { type Deck, type Card } from "@prisma/client";

const Deck: React.FC<{
  deck: Deck & { cards: Pick<Card, "id">[] };
}> = ({ deck }) => {
  return (
    <div className="relative flex h-40 max-w-lg flex-col gap-4 p-4 before:top-0 before:left-0 before:h-1 before:w-full before:bg-teal-500">
      <div>{deck.name}</div>
      <div className="h-[1px] w-full bg-slate-800 dark:bg-slate-100"></div>
      <div>{deck.cards.length} Karteikarten</div>
    </div>
  );
};

export default Deck;
