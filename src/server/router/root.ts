import superjson from 'superjson';

import { createRouter } from '../createRouter';
import { leaderboardRouter } from './leaderboard';

export const appRouter = createRouter()
  .transformer(superjson)
  .merge('leaderboard.', leaderboardRouter);

export type AppRouter = typeof appRouter;
