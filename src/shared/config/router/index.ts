import { createHistoryRouter, createRoute, createRouterControls } from 'atomic-router';
import { sample } from 'effector';
import { createBrowserHistory } from 'history';

import { appStarted } from '../init';

export enum AppRoutes {
  MEMEPAD = 'memepad',
  LIVESTREAM = 'livestream',
  PAIRS = 'pairs',
  TRENDING = 'trending',
  LEADERBOARD = 'leaderboard',
  WALLET = 'wallet',
  PROFILE = 'profile',
  CREATE_TOKEN = 'create_token',
  POSTS = 'posts',
  PORTFOLIO = 'portfolio',
  REFER = 'refer',
  TOKEN = 'token',
  MEMESCOPE = 'memescope',
  STREAM = 'stream',
  POST = 'post',
}

export const RoutePath: Record<AppRoutes, string> = {
  [AppRoutes.MEMEPAD]: '/',
  [AppRoutes.LIVESTREAM]: '/livestream',
  [AppRoutes.CREATE_TOKEN]: '/create-token',
  [AppRoutes.PAIRS]: '/pairs',
  [AppRoutes.WALLET]: '/wallet',
  [AppRoutes.TRENDING]: '/trending',
  [AppRoutes.LEADERBOARD]: '/leaderboard',
  [AppRoutes.POSTS]: '/posts',
  [AppRoutes.PORTFOLIO]: '/portfolio',
  [AppRoutes.PROFILE]: '/profile/:id',
  [AppRoutes.REFER]: '/refer',
  [AppRoutes.TOKEN]: '/token/:address',
  [AppRoutes.MEMESCOPE]: '/memescope',
  [AppRoutes.STREAM]: '/stream/:slug',
  [AppRoutes.POST]: '/post/:id',
};

export const routes = {
  memepad: createRoute(),
  livestream: createRoute(),
  post: createRoute<{ id: string }>(),
  refer: createRoute(),
  stream: createRoute<{ slug: string }>(),
  create_token: createRoute(),
  profile: createRoute<{ id: string }>(),
  token: createRoute<{ address: string }>(),
  leaderboard: createRoute(),
  posts: createRoute(),
  portfolio: createRoute(),
  wallet: createRoute(),
  pairs: createRoute(),
  memescope: createRoute(),
  trending: createRoute(),
};

export const controls = createRouterControls();

export const router = createHistoryRouter({
  routes: [
    {
      path: RoutePath.memepad,
      route: routes.memepad,
    },
    {
      path: RoutePath.post,
      route: routes.post,
    },
    {
      path: RoutePath.stream,
      route: routes.stream,
    },
    {
      path: RoutePath.livestream,
      route: routes.livestream,
    },
    {
      path: RoutePath.create_token,
      route: routes.create_token,
    },
    {
      path: RoutePath.refer,
      route: routes.refer,
    },
    {
      path: RoutePath.profile,
      route: routes.profile,
    },
    {
      path: RoutePath.trending,
      route: routes.trending,
    },
    {
      path: RoutePath.pairs,
      route: routes.pairs,
    },
    {
      path: RoutePath.wallet,
      route: routes.wallet,
    },
    {
      path: RoutePath.leaderboard,
      route: routes.leaderboard,
    },
    {
      path: RoutePath.posts,
      route: routes.posts,
    },
    {
      path: RoutePath.portfolio,
      route: routes.portfolio,
    },
    {
      path: RoutePath.token,
      route: routes.token,
    },
    {
      path: RoutePath.memescope,
      route: routes.memescope,
    },
  ],
  controls,
});

sample({
  clock: appStarted,
  fn: () => createBrowserHistory(),
  target: router.setHistory,
});
