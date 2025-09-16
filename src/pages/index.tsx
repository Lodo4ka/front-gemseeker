import { JSX, memo } from 'react';

import { createRoutesView } from 'atomic-router-react';

import { MemepadRoute } from './memepad';
import { WalletRoute } from './wallet';
import { Header } from 'widgets/header';
import { Sidebar } from 'widgets/sidebar';
import { ProfileRoute } from './profile';
import { CreateTokenRoute } from './create-token';
import { ReferRoute } from './refer';
import { PortfolioRoute } from './portfolio';
import { LeaderboardRoute } from './leaderboard';
import { LivestreamRoute } from './livestream';
import { TokenRoute } from './token';
import { MemescopeRoute } from './memescope';
import { PostsRoute } from './posts';
import { StreamRoute } from './stream';
import { $isHaveFavourites, Favourites } from 'widgets/favourites';
import { useUnit } from 'effector-react';
import { NotFoundPage } from './not-found';
import { NewPairsRoute } from './new-pairs';
import { TrendingRoute } from './trending';
import { PostRoute } from './post';
export const Pages = createRoutesView({
  routes: [
    MemepadRoute,
    WalletRoute,
    LivestreamRoute,
    ProfileRoute,
    CreateTokenRoute,
    ReferRoute,
    LeaderboardRoute,
    PortfolioRoute,
    StreamRoute,
    TokenRoute,
    PostsRoute,
    PostRoute,
    MemescopeRoute,
    NewPairsRoute,
    TrendingRoute,
  ],
  otherwise: NotFoundPage,
});

const MarginFavourites = () => {
  const isHaveFavourites = useUnit($isHaveFavourites);

  if (!isHaveFavourites) return null;

  return <div className="mt-[44px]" />;
};

const MainContent = memo(function MainContent() {
  return (
    <main className="w-full flex-1 px-4 py-4 pt-2 sm:pt-4 lg:pr-5 lg:pl-[90px]">
      <MarginFavourites />
      <Pages />
    </main>
  );
});

export const Routing = (): JSX.Element => {
  return (
    <div className="color-primary bg-bg flex min-h-screen flex-col overflow-hidden">
      <Header />
      <Favourites />
      <Sidebar />
      <div className="flex flex-1 pt-[64px]">
        <MainContent />
      </div>
    </div>
  );
};
