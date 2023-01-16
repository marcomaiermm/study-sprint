import { createTRPCRouter } from "./trpc";
import { flashcardRouter } from "./routers/flashcard";
/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here
 */
export const appRouter = createTRPCRouter({
  flashcard: flashcardRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
