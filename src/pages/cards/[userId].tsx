import { type NextPage } from "next";
import { useSession } from "next-auth/react";

const UserCards: NextPage = () => {
  const { data: sessionData } = useSession();
  return (
    <>
      <div>
        <h1>My Cards</h1>
        <p>{sessionData?.user?.name}</p>
      </div>
    </>
  );
};

export default UserCards;
