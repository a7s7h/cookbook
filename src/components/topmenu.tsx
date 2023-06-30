import { useUser } from "@clerk/nextjs";
import { useState } from "react";
import { api } from "~/utils/api";
import { LoadingSpinner } from "./loading";

export function TopMenu() {
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
  const recipeDB = {
    title: input,
    difficulty: 1.5,
    time: "15 min",
    image: "samples/breakfast.jpg",
    content: "",
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
          onKeyDown={(e) => {
            if (e.key == "Enter" && input != "") {
              e.preventDefault();
              mutate(recipeDB);
            }
          }}
          disabled={isPosting}
        />
        <button
          className="bg-transparent hover:bg-pink-500 text-pink-700 font-semibold hover:text-white py-2 px-4 border border-pink-500 hover:border-transparent rounded"
          onClick={() => {
            if (input != "") {
              mutate(recipeDB);
            }
          }}
          disabled={isPosting}
        >
          Post
        </button>
        <img src={user?.profileImageUrl} className="w-12 h-12 rounded-full" />
      </div>
    </div>
  );
}
