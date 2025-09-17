import { QuickBuyButton } from 'features/quick-buy';
import { Typography } from 'shared/ui/typography';
import { HashTableColumn } from 'shared/ui/table';
import { timeAgo } from 'shared/lib/formatter/date/time-ago';
import { formatter } from 'shared/lib/formatter';
import { ColumnToken } from 'shared/ui/column-token';
import { LoadedData } from 'shared/ui/loaded-data';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';
import { $tokensDopInfo, loadedToken, Token } from 'entities/token';
import { useUnit } from 'effector-react';
import { $sortingFilter, $sortingOrder, changedSortingFilter, changedSortingOrder } from '../../model';
import type { SortingFilter } from 'shared/api/queries/token/tokens-factory';

const TopHolders = ({ address }: { address: string }) => {
  const dopInfo = useUnit($tokensDopInfo);
  return (
    <Typography size="subheadline2" weight="regular">
      {formatter.number.round(dopInfo[address]?.topHolders)}%
    </Typography>
  );
};

export const useColumns = (): HashTableColumn<Token>[] => {
  const [sortingFilter, setSortingFilter, sortingOrder, setSortingOrder] = useUnit([
    $sortingFilter,
    changedSortingFilter,
    $sortingOrder,
    changedSortingOrder,
  ]);

  const handleSort = (filter: SortingFilter) => () => {
    if (sortingFilter !== filter) {
      setSortingFilter(filter);
      setSortingOrder('desc');
    } else {
      setSortingOrder(sortingOrder === 'desc' ? 'asc' : 'desc');
    }
  };

  return [
    {
      key: 'Pair info',
      title: 'Pair info',
      className: 'min-w-[240px]',
      render: ({ photo_hash, name, symbol, address, twitter, website, telegram, bounding_curve, is_streaming }) => (
        <ColumnToken
          photo_hash={photo_hash}
          name={name}
          symbol={symbol}
          address={address}
          twitter={twitter}
          website={website}
          telegram={telegram}
          bounding_curve={bounding_curve}
          isPlay={is_streaming}
        />
      ),
    },

    {
      key: 'created',
      title: 'Created',
      isSortable: true,
      sortDirection: sortingFilter === 'new' ? sortingOrder : null,
      onSort: handleSort('new'),
      className: 'min-w-[100px]',
      render: ({ creation_date, address, deployer_wallet }) => (
        <Typography className="relative" color="green" weight="regular" size="subheadline2">
          {timeAgo(creation_date).replace('ago', '')}
          <LoadedData
            loadedData={loadedToken}
            isOnce
            params={{
              address: address,
              creator: deployer_wallet as string,
            }}
            isFullSize
          />
        </Typography>
      ),
    },

    {
      key: 'Liquidity',
      title: 'Liquidity',
      className: 'min-w-[80px]',
      render: ({ virtual_sol }, _, dopInfo) => (
        <div className="flex flex-col gap-1">
          <Typography weight="regular" size="subheadline2">
            {formatter.number.formatSmallNumber((virtual_sol * 2) / LAMPORTS_PER_SOL)}
            {/* 701.9K */}
          </Typography>
          <Typography color={'green'} weight="regular" size="captain1">
            ${formatter.number.formatSmallNumber(((virtual_sol * 2) / LAMPORTS_PER_SOL) * (dopInfo?.rateUsd ?? 0))}
            {/* $1.3M */}
          </Typography>
        </div>
      ),
    },
    {
      key: 'B.Curve',
      title: 'B.Curve',
      className: 'min-w-[80px]',
      render: ({ bounding_curve }) => (
        <Typography
          icon={{ name: 'speed', position: 'left', className: 'text-green' }}
          color="secondary"
          className="!items-center !gap-2"
          weight="regular"
          size="subheadline2">
          {formatter.number.formatSmallNumber(+bounding_curve.toFixed(2))}
        </Typography>
      ),
    },

    {
      key: 'Market cap',
      title: 'Market cap',
      isSortable: true,
      sortDirection: sortingFilter === 'mcap' ? sortingOrder : null,
      onSort: handleSort('mcap'),
      className: 'min-w-[80px]',
      render: ({ mcap }, _, dopInfo) => (
        <Typography color="secondary" weight="regular" size="subheadline2">
          {formatter.number.uiDefault(mcap * dopInfo?.rateUsd)}/
          {formatter.number.uiDefault(+__MAX_MCAP__ * dopInfo?.rateUsd)}
        </Typography>
      ),
    },
    {
      key: 'Transactions',
      title: 'Transactions',
      className: 'min-w-[80px]',
      render: ({ alltime_buy_txes, alltime_sell_txes }) => (
        <div className="flex flex-col gap-1">
          <Typography weight="regular" size="subheadline2">
            {formatter.number.uiDefault(alltime_buy_txes + alltime_sell_txes)}
          </Typography>
          <div className="flex items-center gap-1">
            <Typography color="green" size="captain1" weight="regular">
              {formatter.number.uiDefault(alltime_buy_txes)} /
            </Typography>
            <Typography color="red" size="captain1" weight="regular">
              {formatter.number.uiDefault(alltime_sell_txes)}
            </Typography>
          </div>
        </div>
      ),
    },
    {
      key: 'Volume',
      title: 'Volume',
      className: 'min-w-[80px]',
      render: ({ volume_24h }, _, dopInfo) => (
        <Typography color="secondary" size="subheadline2" weight="regular">
          ${formatter.number.uiDefault(volume_24h * (dopInfo?.rateUsd ?? 0))}
        </Typography>
      ),
    },
    {
      key: 'Mint Authority',
      title: 'Mint Authority',
      className: 'min-w-[60px]',
      render: () => (
        <Typography color="green" size="subheadline2" weight="regular">
          Disabled
        </Typography>
      ),
    },
    {
      key: 'Freeze Authority',
      title: 'Freeze Authority',
      className: 'min-w-[60px]',
      render: () => (
        <Typography color="green" size="subheadline2" weight="regular">
          Disabled
        </Typography>
      ),
    },
    {
      key: 'LP Burned',
      title: 'LP Burned',
      className: 'min-w-[60px]',
      render: ({ trade_finished }) => (
        <Typography size="subheadline2" weight="regular">
          {trade_finished ? '0' : '0'}%
        </Typography>
      ),
    },
    {
      key: 'Pooled token',
      title: 'Pooled token',
      className: 'min-w-[60px]',
      render: ({ virtual_tokens, rate }, _, dopInfo) => (
        <Typography size="subheadline2" weight="regular">
          {formatter.number.uiDefault((virtual_tokens / LAMPORTS_PER_SOL) * (rate ?? 0) * (dopInfo?.rateUsd ?? 0))}
        </Typography>
      ),
    },
    {
      key: 'Pooled SOL',
      title: 'Pooled SOL',
      className: 'min-w-[60px]',
      render: ({ virtual_sol }, _, dopInfo) => (
        <Typography size="subheadline2" weight="regular">
          {formatter.number.uiDefault((virtual_sol / LAMPORTS_PER_SOL) * (dopInfo?.rateUsd ?? 0))}
        </Typography>
      ),
    },
    {
      key: 'Top 10 Holders',
      title: 'Top 10 Holders',
      className: 'min-w-[60px]',
      render: ({ address }) => <TopHolders address={address} />,
    },
    {
      key: 'Deployer',
      title: 'Deployer',
      className: 'min-w-[60px]',
      render: ({ address }) => <Typography>{formatter.address(address)}</Typography>,
    },
    {
      key: 'Open Trading',
      title: 'Open Trading',
      className: 'min-w-[60px]',
      render: ({ trade_started }) => (
        <Typography color={trade_started ? 'green' : 'red'}>{trade_started ? '+' : '-'}</Typography>
      ),
    },
    {
      key: 'Quick Buy',
      title: 'Quick Buy',
      className: 'min-w-[199px]',
      isNotOnClick: true,
      render: (token) => <QuickBuyButton token={token} />,
    },
  ];
};
