import { useUser } from "@clerk/nextjs";
import Head from "next/head";
import Link from "next/link";
import { api } from "~/utils/api";

export default function Home() {
  const { isSignedIn, user } = useUser();
  if (!isSignedIn) {
    return null;
  }
  const { data } = api.recipe.getAll.useQuery();

  return (
    <>
      <Head>
        <title>Cookbook</title>
        <meta name="description" content="Ash's best recipes" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="bg-lime-100 p-2.5 rounded-xl">
        <div>Hello { user.firstName }</div>
        {data?.map((recipe) => <div key={recipe.id}>{recipe.content}</div>)}
      </main>
    </>
  );
}
