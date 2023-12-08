import { z } from 'zod';
import { createRouter } from '../createRouter';

export const leaderboardRouter = createRouter()
  .query('check-if-made-leader-board', {
    input: z.number().min(1).max(1000),
    async resolve({ input: cpm, ctx }) {
      const [lastPositionOnLeaderBoard] = await ctx.prisma.leaderBoard.findMany(
        {
          orderBy: {
            charactersPerMinute: 'desc',
          },
          take: 10,
          skip: 9,
        }
      );

      if (!lastPositionOnLeaderBoard) return true;

      if (lastPositionOnLeaderBoard) {
        if (cpm > lastPositionOnLeaderBoard.charactersPerMinute) {
          return true;
        }
      }

      return false;
    },
  })
  .query('get', {
    async resolve({ ctx }) {
      return await ctx.prisma.leaderBoard.findMany({
        orderBy: {
          charactersPerMinute: 'desc',
        },
        take: 10,
      });
    },
  })
  .mutation('add', {
    input: z.object({
      name: z.string().min(3).max(50),
      charactersPerMinute: z.number().min(0),
      accuracyPercent: z.number().min(0),
      mistakeCount: z.number().min(0).max(1000),
    }),
    async resolve({ input, ctx }) {
      await ctx.prisma.leaderBoard.create({
        data: input,
      });

      return { success: true };
    },
  });
