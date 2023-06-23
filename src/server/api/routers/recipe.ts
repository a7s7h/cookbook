
import { z } from "zod";
import { createTRPCRouter, privateProcedure, publicProcedure } from "~/server/api/trpc";

export const recipeRouter = createTRPCRouter({
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.recipe.findMany({
      orderBy: [
        {createdAt: "desc"}
      ]
    });
  }),

  create: privateProcedure.input(z.object({
       title: z.string(),
       content: z.string(),
    }))
    .mutation(async ({ ctx, input }) => {
       const authorId = ctx.userId;

       const recipe = await ctx.prisma.recipe.create({
         data: {
           title: input.title,
           content: input.content??'{}',
         }
       });
       return recipe;
    }),
});
