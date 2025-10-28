import prisma from '@/lib/db';
import { createTRPCRouter, protectedProcedure } from '../init';

export const appRouter = createTRPCRouter({
  getUsers: protectedProcedure.query(({ ctx }) => {
    return prisma.user.findMany({
      where: {
        id: ctx.auth.user.id,
      },
    });
  }),
});

// Export the type definition of the API
export type AppRouter = typeof appRouter;
