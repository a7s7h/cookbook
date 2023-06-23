import { useUser } from "@clerk/nextjs";
import { Prisma } from "@prisma/client";
import Head from "next/head";
import Link from "next/link";
import { useState } from "react";
import { LoadingSpinner } from "~/components/loading";
import { RouterOutputs, api } from "~/utils/api";

type Content = {
  time: string,
  steps: string[],
  difficulty: string,
  ingredients: string[],
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
      <h2 className="text-5xl leading-loose font-normal text-pink-500">
        <Link href={`recipes/${recipe.id}`}>
          {recipe.title}
        </Link>
      </h2>
      <ul className="pl-4 mt-2 list-item">{
        content.ingredients?.map((ingredient:string) => {
          return Ingredient(ingredient);
        })
      }</ul>
      <div className="mt-8">{
        content.steps?.map((step:string,index:number) => {
          return Step(step,index);
        })
      }</div>
    </div>
  );
}

function Ingredient(ingredient:string) {
  return <li className="pl-8">{ingredient}</li>
}

function Step(step:string, index:number) {
  return <p className="mb-1 text-xl font-normal text-yellow-100">
    {index+1}. {step}
  </p>
}
function TopView() {
  const { user } = useUser();
  const [ input, setInput ] = useState("");
  const ctx = api.useContext();
  const { mutate, isLoading: isPosting } = api.recipes.create.useMutation({
    onSuccess: () => {
      setInput("");
      void ctx.recipes.getAll.invalidate();
    }
  });
  const content: Content = { 
    time: "20 min", 
    steps:["Provide necessary steps here..."], 
    difficulty: "easy",
    ingredients: ["Any possible ingredient..."]
  };
  return (
    <div className="flex w-full gap-3">
      <input type="text" placeholder="Type something here..." 
        className="bg-transparent grow outline-none"
        value={input} onChange={(e) => setInput(e.target.value)}
        disabled={isPosting}/>
      <img src={user?.profileImageUrl} className="w-16 h-16 rounded-full"/>
      <button onClick={() => mutate({ title: input, content: content })}>Post</button>
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
        <TopView/>
      </nav>
      <main className="h-full overflow-auto bg-slate-800 p-4">
        <Recipes/>
      </main>
    </>
  );
}
