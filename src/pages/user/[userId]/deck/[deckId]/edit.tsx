import { type NextPage } from "next";
import { useSession } from "next-auth/react";

import FlashcardComponent from "@components/flashcard";
import { useState } from "react";

const EditFlashCard: NextPage = () => {
  const { data: sessionData } = useSession();

  return (
    <>
      <div>
        <h1>My Cards</h1>
        <p>{sessionData?.user?.name}</p>
        <div className="h-[50vh] p-4">
          <FlashcardComponent />
        </div>
      </div>
    </>
  );
};

export default EditFlashCard;
