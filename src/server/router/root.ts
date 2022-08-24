import { createRouter } from '../createRouter';
import superjson from 'superjson';
import { leaderboardRouter } from './leaderboard';

export const appRouter = createRouter()
  .transformer(superjson)
  .merge('leaderboard.', leaderboardRouter);

export type AppRouter = typeof appRouter;
