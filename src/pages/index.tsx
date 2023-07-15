import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import { LoadingSpinner } from "~/components/loading";
import { api, type RouterOutputs } from "~/utils/api";
import { CldImage } from "next-cloudinary";

type Recipe = RouterOutputs["recipes"]["getAll"][number];
type Ingredient =
  RouterOutputs["recipes"]["getAll"][number]["ingredients"][number];
type Method = RouterOutputs["recipes"]["getAll"][number]["methods"][number];

function RecipeView(props: Recipe) {
  const recipe = props;
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
            className="rounded-xl h-auto"
            width={300}
            height={300}
            alt=""
            src={recipe.image ?? "samples/breakfast.jpg"}
          />
        </div>
        <ul className="md:pl-4 mt-4 md:mt-0 list-item">
          {recipe.ingredients?.map((ingredient: Ingredient, index: number) => {
            return Ingredient(ingredient, index);
          })}
        </ul>
      </div>
      <div className="mt-4 text-yellow-500">
        {recipe.methods?.map((method: Method) => {
          return Method(method);
        })}
      </div>
    </div>
  );
}

function Method(method: Method) {
  return <p className="py-2">{method.number}. {method.content}</p>;
}

function Ingredient(ingredient: Ingredient, index: number) {
  return (
    <li key={index} className="md:pl-8">
      {ingredient.quantity != 0 && (
        <span className="mr-1">{ingredient.quantity}</span>
      )}
      {ingredient.ingredient.unit != null &&
        ingredient.ingredient.unit.name != "" && (
        <span className="mr-1">{ingredient.ingredient.unit.name}</span>
      )}
      <span>
        {(ingredient.quantity <= 1 ||
          ingredient.ingredient.namePlural == null) &&
          ingredient.ingredient.name}
        {ingredient.quantity > 1 && ingredient.ingredient.namePlural}
      </span>
    </li>
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
  return <Recipes />;
}
