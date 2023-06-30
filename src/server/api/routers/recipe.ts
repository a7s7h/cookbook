import { z } from "zod";
import {
  createTRPCRouter,
  privateProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const recipeRouter = createTRPCRouter({
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.recipe.findMany({
      include: {
        ingredients: { include: { ingredient: { include: { unit: true } } } },
      },
      orderBy: [
        { createdAt: "desc" },
      ],
    });
  }),

  create: privateProcedure.input(z.object({
    title: z.string(),
    difficulty: z.number(),
    time: z.string(),
    image: z.string(),
    content: z.string(),
  }))
    .mutation(async ({ ctx, input }) => {
      if (input.title != "Pasta") {
        return null;
      }
      const recipe = await ctx.prisma.recipe.create({
        data: {
          title: input.title,
          difficulty: input.difficulty,
          time: input.time,
          image: input.image,
          content: input.content,
        },
      });
      return recipe;
    }),
});
