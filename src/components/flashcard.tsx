import { type Flashcard } from "@prisma/client";
import { useState } from "react";

const FlashCardComponent: React.FC<{
  flashcard?: Flashcard;
}> = ({ flashcard }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <>
      <div
        className={`h-full w-full rounded-xl bg-slate-50 shadow dark:bg-slate-800`}
        onClick={() => setIsFlipped(!isFlipped)}
      >
        {!isFlipped ? <div>Front</div> : <div>Flipped</div>}
      </div>
    </>
  );
};

export default FlashCardComponent;
