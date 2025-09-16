import { routes } from 'shared/config/router';
import { Navbar } from '../ui';

export const navbar: Navbar[] = [
  {
    title: 'Memepad',
    routes: [
      {
        title: 'Memepad',
        icon: 'memepad',
        route: routes.memepad,
      },
      {
        title: 'Live Stream',
        icon: 'livestream',
        route: routes.livestream,
      },
    ],
  },
  {
    title: 'Terminal',
    routes: [
      {
        title: 'Memescope',
        icon: 'gemescope',
        route: routes.memescope,
      },
      {
        title: 'New Pairs',
        icon: 'newPairs',
        route: routes.pairs,
      },
      {
        title: 'Trending',
        icon: 'trending',
        route: routes.trending,
      },
    ],
  },
  {
    title: 'Other',
    routes: [
      {
        title: 'Leaderboard',
        icon: 'leaderboard',
        route: routes.leaderboard,
      },
      {
        title: 'Portfolio',
        icon: 'portfolio',
        route: routes.portfolio,
        isNeedAuth: true
      },
      {
        title: 'Wallet Management',
        icon: 'wallet',
        route: routes.wallet,
        isNeedAuth: true
      },
      {
        title: 'Gem post',
        icon: 'posts',
        route: routes.posts,
      },
    ],
  },
];
