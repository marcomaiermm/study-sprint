import { z } from "zod";
import { observable } from "@trpc/server/observable";
import { EventEmitter } from "events";
import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";

import { type Deck } from "@prisma/client";

// create a global event emitter (could be replaced by redis, etc)
const ee = new EventEmitter();

export const deckRouter = createTRPCRouter({
  onSubmit: protectedProcedure.subscription(() => {
    // `resolve()` is triggered for each client when they start subscribing `onAdd`
    // return an `observable` with a callback which is triggered immediately
    return observable<Deck>((emit) => {
      const onSubmit = (data: Deck) => {
        // emit data to client
        emit.next(data);
      };
      // trigger `onAdd()` when `add` is triggered in our event emitter
      ee.on("submit-deck", onSubmit);
      // unsubscribe function when client disconnects or stops subscribing
      return () => {
        ee.off("submit-deck", onSubmit);
      };
    });
  }),
  getById: publicProcedure.input(z.string()).query(async ({ ctx, input }) => {
    return await ctx.prisma.flashcard.findFirst({
      where: {
        id: input,
      },
    });
  }),

  getMany: publicProcedure
    .input(z.number().optional())
    .query(async ({ ctx, input }) => {
      return await ctx.prisma.deck.findMany({
        take: input,
      });
    }),

  submit: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      const deck = await ctx.prisma.deck.create({
        data: {
          name: input,
          owner: {
            connect: {
              id: ctx.session.user.id,
            },
          },
        },
      });

      ee.emit("submit-deck", deck);

      return deck;
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().optional(),
        flashcards: z.array(z.string()).optional(),
        exam: z.array(z.string()).optional(),
        sharedDeck: z.array(z.string()).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id, flashcards, exam, sharedDeck, ...rest } = input;

      const deck = ctx.prisma.deck.update({
        where: {
          id,
        },
        data: {
          ...rest,
          flashcards: {
            connect: flashcards?.map((flashcardId) => {
              return { id: flashcardId };
            }),
          },
          exam: {
            connect: exam?.map((flashcardId) => {
              return { id: flashcardId };
            }),
          },
          sharedDeck: {
            connect: sharedDeck?.map((userId) => {
              return { id: userId };
            }),
          },
        },
      });

      return deck;
    }),

  delete: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.deck.delete({
        where: {
          id: input,
        },
      });
    }),
});
