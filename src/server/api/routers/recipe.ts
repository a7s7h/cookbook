import { z } from "zod";
import {
  createTRPCRouter,
  privateProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const recipeRouter = createTRPCRouter({
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.recipe.findMany({
      orderBy: [
        { createdAt: "desc" },
      ],
    });
  }),

  create: privateProcedure.input(z.object({
    title: z.string(),
    content: z.object({
      time: z.string(),
      steps: z.array(z.string()),
      difficulty: z.string(),
      ingredients: z.array(z.string()),
    }),
  }))
    .mutation(async ({ ctx, input }) => {
      if (input.title != "Pasta") {
        return null;
      }
      const recipe = await ctx.prisma.recipe.create({
        data: {
          title: input.title,
          content: input.content,
        },
      });
      return recipe;
    }),
});
