import { type NextPage } from "next";
import Head from "next/head";
import { api } from "../utils/api";

const Home: NextPage = () => {
  const hello = api.flashcard.hello.useQuery({ id: 1 });

  return (
    <>
      <Head>
        <title>Start - StudySprint</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div> test </div>
    </>
  );
};

export default Home;
