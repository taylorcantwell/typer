import { z } from 'zod';
import { createRouter } from '../createRouter';

export const leaderboardRouter = createRouter()
  .query('check-if-made-leader-board', {
    input: z.number().min(1).max(1000),
    async resolve({ input, ctx }) {
      const leaderBoard = await ctx.prisma.leaderBoard.findMany({
        orderBy: {
          cpm: 'desc',
        },
        take: 10,
        skip: 9,
      });

      if (leaderBoard?.length === 0) {
        return true;
      }

      if (leaderBoard?.[0]) {
        if (input > leaderBoard[0].cpm) {
          return true;
        }
      }

      return false;
    },
  })
  .query('get-leader-board', {
    async resolve({ ctx }) {
      const leaderBoard = await ctx.prisma.leaderBoard.findMany({
        orderBy: {
          cpm: 'desc',
        },
        take: 10,
      });

      return leaderBoard;
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
      const { name, cpm, accuracy, mistakes } = input;

      await ctx.prisma.leaderBoard.create({
        data: {
          name,
          cpm,
          accuracy,
          mistakes,
        },
      });

      return { success: true };
    },
  });
