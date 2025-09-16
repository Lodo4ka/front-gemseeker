import { SortingFilter } from 'shared/api/queries/token/tokens-factory';
import { IconName } from 'shared/ui/icon';

export type Market = {
  name: string;
  icon?: IconName;
  symbol: SortingFilter;
};

export const markets: Market[] = [
  {
    name: 'All tokens',
    symbol: 'last_order',
  },
  {
    name: 'Live stream',
    icon: 'dot',
    symbol: 'live_stream',
  },
  {
    name: 'Top gain',
    symbol: 'gain',
  },
  {
    name: 'MCAP',
    symbol: 'mcap',
  },
  {
    name: 'Dex',
    symbol: 'raydium',
  },
  {
    name: 'My tokens',
    symbol: 'user',
  },
];
