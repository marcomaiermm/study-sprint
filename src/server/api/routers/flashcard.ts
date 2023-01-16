import { z } from "zod";

import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";

export const flashcardRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.id}`,
      };
    }),

  getById: publicProcedure.input(z.number()).query(({ ctx, input }) => {
    return ctx.prisma.flashcard.findFirst({
      where: {
        id: input,
      },
    });
  }),

  getMany: publicProcedure
    .input(z.number().optional())
    .query(({ ctx, input }) => {
      return ctx.prisma.flashcard.findMany({
        take: input,
      });
    }),

  getSecretMessage: protectedProcedure.query(() => {
    return "you can now see this secret message!";
  }),
});
