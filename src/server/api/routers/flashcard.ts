import { z } from "zod";

import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";

export const flashcardRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.id}`,
      };
    }),

  getById: publicProcedure.input(z.string()).query(async ({ ctx, input }) => {
    return await ctx.prisma.card.findFirst({
      where: {
        id: input,
      },
    });
  }),

  getMany: publicProcedure
    .input(z.number().optional())
    .query(async ({ ctx, input }) => {
      return await ctx.prisma.card.findMany({
        take: input,
      });
    }),

  getSecretMessage: protectedProcedure.query(() => {
    return "you can now see this secret message!";
  }),

  submit: protectedProcedure
    .input(
      z.object({
        question: z.string(),
        answer: z.string(),
        deck: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const deck = await ctx.prisma.card.create({
        data: {
          front: input.question,
          back: input.answer,
          user: {
            connect: {
              id: ctx.session.user.id,
            },
          },
          deck: {
            connect: {
              id: input.deck,
            },
          },
        },
      });
      return deck;
    }),
});
