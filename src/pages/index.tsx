import { useUser } from "@clerk/nextjs";
import Head from "next/head";
import { LoadingSpinner } from "~/components/loading";
import { RouterOutputs, api } from "~/utils/api";

type Recipe = RouterOutputs["recipes"]["getAll"][number];
function RecipeView(props: Recipe) {
  const recipe = props;
  return (
    <div key={recipe.id}>{recipe.content}</div>
  );
}

function CreateRecipeWizard() {
  const { isSignedIn, user } = useUser();
  if (!isSignedIn) {
    return null;
  }

  return (
    <div className="flex w-full gap-3">
      <img src={user.profileImageUrl} className="w-16 h-16 rounded-full"/>
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
      <aside className="bg-orange-700 p-2.5 mr-2 w-3/12 rounded-xl">
         {CreateRecipeWizard()}
      </aside>
      <main className="bg-slate-700 p-2.5 w-9/12 rounded-xl"> 
        {data?.map((recipe) => RecipeView(recipe))}
      </main>
    </>
  );
}
