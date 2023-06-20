import { useUser } from "@clerk/nextjs";
import Head from "next/head";
import Link from "next/link";
import { api } from "~/utils/api";

export default function Home() {
  const hello = api.example.hello.useQuery({ text: "from tRPC" });
  const { isSignedIn, user } = useUser();
  if (!isSignedIn) {
    return null;
  }
  return (
    <>
      <Head>
        <title>Cookbook</title>
        <meta name="description" content="Ash's best recipes" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="bg-lime-100 p-2.5 rounded-xl">
        Hello { user.firstName }
      </main>
    </>
  );
}
