import { useUser } from "@clerk/nextjs";
import Head from "next/head";
import Link from "next/link";
import { LoadingSpinner } from "~/components/loading";
import { RouterOutputs, api } from "~/utils/api";

type Recipe = RouterOutputs["recipes"]["getAll"][number];
function RecipeView(props: Recipe) {
  const recipe = props;
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const content: any = recipe.content;
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
function CreateRecipeWizard() {
  const { isSignedIn, user } = useUser();
  if (!isSignedIn) {
    return null;
  }

  return (
    <div className="flex w-full gap-3">
      <img src={user.profileImageUrl} className="w-16 h-16 rounded-2xl"/>
      <input placeholder="Title" className="bg-transparent grow outline-none"/>
    </div>
  );
}

export default function Home() {
  const { isSignedIn } = useUser();
  if (!isSignedIn) {
    return null;
  }

  const { data, isLoading } = api.recipes.getAll.useQuery();

  if (isLoading) {
    return LoadingSpinner();
  }

  return (
    <>
      <Head>
        <title>Cookbook</title>
        <meta name="description" content="Ash's best recipes" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="flex">
        <aside className="text-gray-700 bg-orange-500 p-4 mr-2 w-3/12 rounded-xl">
          {CreateRecipeWizard()}
        </aside>
        <main className="bg-slate-700 p-4 w-9/12 rounded-xl">
          {data?.map((recipe) => RecipeView(recipe))}
        </main>
      </div>
    </>
  );
}
