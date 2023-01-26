import { useState } from "react";

import type { Card } from "@prisma/client";

const FlashCardComponent: React.FC<{
  flashcard?: Pick<Card, "back" | "front">;
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
              {flashcard?.front}
            </div>
          </div>
        ) : (
          <div>{flashcard?.back}</div>
        )}
      </div>
    </>
  );
};

export default FlashCardComponent;
