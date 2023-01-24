import { useState } from "react";

import type { Flashcard } from "@prisma/client";

const FlashCardComponent: React.FC<{
  flashcard?: Omit<Flashcard, "userId" | "deckId" | "user">;
  blockFlip?: boolean;
}> = ({ flashcard, blockFlip }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <>
      <div
        className="h-full w-full cursor-pointer rounded-xl bg-slate-50 shadow ring ring-rose-500 dark:bg-slate-800"
        onClick={() => !blockFlip && setIsFlipped(!isFlipped)}
      >
        {!isFlipped ? (
          <div className="flex h-full w-full items-center justify-center">
            <div className="relative text-2xl after:absolute after:-bottom-2 after:left-0 after:h-1 after:w-full after:bg-white">
              {flashcard?.question}
            </div>
          </div>
        ) : (
          <div>{flashcard?.answer}</div>
        )}
      </div>
    </>
  );
};

export default FlashCardComponent;
