import { z } from 'zod';
import { createRouter } from '../createRouter';

export const leaderboardRouter = createRouter()
  .query('check-if-made-leader-board', {
    input: z.number().min(1).max(1000),
    async resolve({ input: cpm, ctx }) {
      const [lastPositionOnLeaderBoard] = await ctx.prisma.leaderBoard.findMany(
        {
          orderBy: {
            cpm: 'desc',
          },
          take: 10,
          skip: 9,
        }
      );

      if (!lastPositionOnLeaderBoard) {
        return true;
      }

      if (lastPositionOnLeaderBoard) {
        if (cpm > lastPositionOnLeaderBoard.cpm) {
          return true;
        }
      }

      return false;
    },
  })
  .query('get-leader-board', {
    async resolve({ ctx }) {
      return await ctx.prisma.leaderBoard.findMany({
        orderBy: {
          cpm: 'desc',
        },
        take: 10,
      });
    },
  })
  .mutation('add-to-leader-board', {
    input: z.object({
      name: z.string().min(3).max(50),
      cpm: z.number().min(0),
      accuracy: z.string().min(0),
      mistakes: z.number().min(0).max(1000),
    }),
    async resolve({ input, ctx }) {
      await ctx.prisma.leaderBoard.create({
        data: input,
      });

      return { success: true };
    },
  });
