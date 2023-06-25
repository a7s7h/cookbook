import { useUser } from "@clerk/nextjs";
import { Prisma } from "@prisma/client";
import Head from "next/head";
import Link from "next/link";
import { useState } from "react";
import { LoadingSpinner } from "~/components/loading";
import { api, RouterOutputs } from "~/utils/api";
import { CldImage } from "next-cloudinary";
import { number } from "zod";

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
    <div key={recipe.id} className="pl-4 pr-4">
      <h2 className="text-2xl md:text-4xl mb-4 mt-6 leading-loose font-normal text-pink-500">
        <Link href={`recipes/${recipe.id}`}>
          {recipe.title}
        </Link>
      </h2>
      <div className="flex md:flex-row flex-col">
        <div className="shrink-0">
          <CldImage
            className="rounded-xl"
            width={300}
            height={300}
            alt=""
            src={recipe.image}
          />
        </div>
        <ul className="md:pl-4 mt-4 md:mt-0 list-item">
          {content.ingredients?.map((ingredient: string, index: number) => {
            return Ingredient(ingredient, index);
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

function Ingredient(ingredient: string, index: number) {
  return <li key={index} className="md:pl-8">{ingredient}</li>;
}

function Step(step: string, index: number) {
  return (
    <p key={index} className="mb-1 font-normal text-yellow-100">
      {index + 1}. {step}
    </p>
  );
}

function TopView() {
  const { user, isSignedIn } = useUser();
  const ctx = api.useContext();
  const [input, setInput] = useState("");
  const { mutate, isLoading: isPosting } = api.recipes.create.useMutation({
    onSuccess: () => {
      setInput("");
      void ctx.recipes.getAll.invalidate();
    },
  });
  if (!isSignedIn) {
    return <LoadingSpinner />;
  }
  const content: Content = {
    time: "20 min",
    steps: ["Provide necessary steps here..."],
    difficulty: "easy",
    ingredients: ["Any possible ingredients..."],
  };
  return (
    <div className="text-gray-800 bg-slate-200 pr-4 pl-4 pt-2 pb-2 w-full sticky top-0">
      <div className="flex gap-3">
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
          onClick={() =>
            mutate({
              title: input,
              image: "samples/breakfast.jpg",
              content: content,
            })}
          disabled={isPosting}
        >
          Post
        </button>
        <img src={user?.profileImageUrl} className="w-12 h-12 rounded-full" />
      </div>
    </div>
  );
}

function Recipes() {
  const { isSignedIn } = useUser();
  const { data, isLoading } = api.recipes.getAll.useQuery();
  if (!isSignedIn) {
    return null;
  }
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
      <TopView />
      <main className="bg-slate-900 p-4">
        <Recipes />
      </main>
    </>
  );
}
