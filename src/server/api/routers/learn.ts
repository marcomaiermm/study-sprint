import { z } from "zod";
import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";

import { type Deck } from "@prisma/client";

// export const learnRouter = createTRPCRouter({
//   getByExam: protectedProcedure.input(z.string()).query(async ({ ctx, input }) => {

//   }),
// });
