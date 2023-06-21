
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const recipeRouter = createTRPCRouter({
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.recipe.findMany();
  }),
});
