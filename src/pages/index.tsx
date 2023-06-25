import { useUser } from "@clerk/nextjs";
import { Prisma } from "@prisma/client";
import Head from "next/head";
import Link from "next/link";
import { useState } from "react";
import { LoadingSpinner } from "~/components/loading";
import { api, RouterOutputs } from "~/utils/api";
import { CldImage } from "next-cloudinary";

type Content = {
  time: string;
  steps: string[];
  difficulty: string;
  ingredients: string[];
};

function parsePrisma(json: Prisma.JsonValue) {
  return JSON.parse(JSON.stringify(json)) as Content;
}

type Recipe = RouterOutputs["recipes"]["getAll"][number];
function RecipeView(props: Recipe) {
  const recipe = props;
  const content: Content = parsePrisma(recipe.content);
  return (
    <div className="pl-4 pr-4">
      <h2 className="text-2xl md:text-4xl mb-4 mt-4 leading-loose font-normal text-pink-500">
        <Link href={`recipes/${recipe.id}`}>
          {recipe.title}
        </Link>
      </h2>
      <div className="flex md:flex-row flex-col">
        <div className="shrink-0">
          <CldImage
            className="rounded-xl"
            width="300"
            height="300"
            alt=""
            src="samples/breakfast.jpg"
          />
        </div>
        <ul className="md:pl-4 mt-4 md:mt-0 list-item">
          {content.ingredients?.map((ingredient: string) => {
            return Ingredient(ingredient);
          })}
        </ul>
      </div>
      <div className="mt-8">
        {content.steps?.map((step: string, index: number) => {
          return Step(step, index);
        })}
      </div>
    </div>
  );
}

function Ingredient(ingredient: string) {
  return <li className="md:pl-8">{ingredient}</li>;
}

function Step(step: string, index: number) {
  return (
    <p className="mb-1 font-normal text-yellow-100">
      {index + 1}. {step}
    </p>
  );
}
function TopView() {
  const { user } = useUser();
  const [input, setInput] = useState("");
  const ctx = api.useContext();
  const { mutate, isLoading: isPosting } = api.recipes.create.useMutation({
    onSuccess: () => {
      setInput("");
      void ctx.recipes.getAll.invalidate();
    },
  });
  const content: Content = {
    time: "20 min",
    steps: ["Provide necessary steps here..."],
    difficulty: "easy",
    ingredients: ["Any possible ingredients..."],
  };
  return (
    <div className="flex w-full gap-3">
      <input
        type="text"
        placeholder="Type something here..."
        className="bg-transparent grow outline-none"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        disabled={isPosting}
      />
      <button
        className="bg-transparent hover:bg-pink-500 text-pink-700 font-semibold hover:text-white py-2 px-4 border border-pink-500 hover:border-transparent rounded"
        onClick={() => mutate({ title: input, content: content })}
      >
        Post
      </button>
      <img src={user?.profileImageUrl} className="w-16 h-16 rounded-full" />
    </div>
  );
}

function Recipes() {
  const { isSignedIn } = useUser();
  if (!isSignedIn) {
    return null;
  }
  const { data, isLoading } = api.recipes.getAll.useQuery();
  if (isLoading) {
    return LoadingSpinner();
  }
  return data?.map((recipe) => RecipeView(recipe));
}

export default function Home() {
  return (
    <>
      <Head>
        <title>Cookbook</title>
        <meta name="description" content="Ash's best recipes" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <nav className="text-gray-800 border-b-2 border-slate-500 bg-stone-200 p-4 sticky top-0">
        <TopView />
      </nav>
      <main className="bg-slate-800 p-4">
        <Recipes />
      </main>
    </>
  );
}
