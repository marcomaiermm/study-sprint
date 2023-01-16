import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";

import { api } from "../utils/api";

const Home: NextPage = () => {
  const hello = api.flashcard.hello.useQuery({ id: 1 });
  const { data: sessionData } = useSession();

  const greetDayCycle = () => {
    // make it i18n friendly
    const hour = new Date().getHours();
    if (hour < 12) return "Guten Morgen";
    if (hour < 18) return "Guten Mittag";
    return "Guten Abend";
  };

  return (
    <>
      <Head>
        <title>Start - StudySprint</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <nav className="flex w-full justify-between bg-slate-800 py-2 px-4 shadow">
        <div className="flex items-center justify-center gap-4">
          <Link href="/" className="text-xl">
            Start
          </Link>
          <div>
            <Link href="/cards">Cards</Link>
          </div>
        </div>
        {sessionData && (
          <div className="flex items-center justify-end gap-4">
            <span>
              {greetDayCycle()}, {sessionData?.user?.name}
            </span>
            <div className="h-8 w-8">
              <Auth />
            </div>
          </div>
        )}
      </nav>
      <main className="flex min-h-screen flex-col">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 "></div>
      </main>
    </>
  );
};

export default Home;

const Auth: React.FC = () => {
  const { data: sessionData } = useSession();

  const { data: secretMessage } = api.flashcard.getSecretMessage.useQuery(
    undefined, // no input
    { enabled: sessionData?.user !== undefined }
  );

  return (
    <>
      <button
        className="flex-no-wrap flex h-full w-full items-center justify-center overflow-hidden rounded-full bg-teal-400"
        onClick={sessionData ? () => void signOut() : () => void signIn()}
      >
        {sessionData ? (
          <div
            className="h-full w-full bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${sessionData.user?.image ?? ""})` }}
          ></div>
        ) : (
          <div className="h-full w-full">Sign in</div>
        )}
      </button>
    </>
  );
};
