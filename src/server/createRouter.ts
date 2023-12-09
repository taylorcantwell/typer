import * as trpc from '@trpc/server';

import { Context } from './createContext';

export function createRouter() {
  return trpc.router<Context>();
}
