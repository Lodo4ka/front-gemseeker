import { Typography } from 'shared/ui/typography';
import { Table } from 'shared/ui/table';

import { Icon } from 'shared/ui/icon';
import { useUnit } from 'effector-react';
import { $isEndReached, onLoadedFirst, dataRanedOut } from '../../model/active-positions';

import { formatter } from 'shared/lib/formatter';
import { $activePositions, ActivePositionCol } from 'entities/user';
import { routes } from 'shared/config/router';
import { getFullUrlImg } from 'shared/lib/full-url-img';
import { ImageHover } from 'shared/ui/image';
import { $isChecked } from 'pages/portfolio/model/checkbox';
import clsx from 'clsx';

export const columns: ActivePositionCol[] = [
  {
    key: 'Coin',
    title: 'Coin',
    className: 'min-w-[200px]',
    render: ({ photo_hash, name }) => (
      <div className="flex items-center gap-2">
        <ImageHover preview={getFullUrlImg(photo_hash, name)} className="h-[30px] w-[30px] rounded-full" alt="name" />
        <Typography size="subheadline2">{name}</Typography>
      </div>
    ),
  },
  {
    key: 'Amount USD',
    title: 'Amount USD',
    className: 'min-w-[80px]',
    render: ({ amount }) => (
      <Typography size="subheadline2" weight="regular">
        {formatter.number.uiDefaultWithDollar(amount)}
      </Typography>
    ),
  },
  {
    key: 'Amount SOL',
    title: 'Amount SOL',
    className: 'min-w-[80px]',
    render: ({ amount_sol }) => (
      <Typography icon={{ name: 'solana', size: 18, position: 'left' }} size="subheadline2" weight="regular">
        {formatter.number.uiDefault(amount_sol)}
      </Typography>
    ),
  },
  {
    key: 'Liquidity',
    title: 'Liquidity',
    className: 'min-w-[80px]',
    render: ({ liquidity }) => (
      <Typography size="subheadline2" weight="regular">
        {formatter.number.uiDefaultWithDollar(liquidity)}
      </Typography>
    ),
  },
  {
    key: 'PnL',
    title: 'PnL',
    className: 'min-w-[75px]',
    render: ({ pnl, pnl_sol }, additionalInfo) => (
      <Typography
        size="subheadline2"
        icon={{
          name: 'solana',
          size: 18,
          position: 'left',
          className: clsx({ '!hidden': !additionalInfo?.isSolana }),
        }}
        weight="regular"
        color={pnl >= 0 ? 'green' : 'red'}>
        {!additionalInfo?.isSolana ? formatter.number.uiDefaultWithDollar(pnl) : formatter.number.uiDefault(pnl_sol)}
      </Typography>
    ),
  },
];

export const ActivePositions = () => {
  const [activePositions, isSolana] = useUnit([$activePositions, $isChecked]);
  const openToken = useUnit(routes.token.open);

  return (
    <Table
      onRowClick={({ address }) => openToken({ address: address ?? '' })}
      onLoaded={onLoadedFirst}
      reachedEndOfList={dataRanedOut}
      $isDataRanedOut={$isEndReached}
      className={{
        row: 'h-[62px] cursor-pointer',
      }}
      noData={
        <div className="mt-[136px] flex h-full w-full flex-col items-center justify-center">
          <Icon name="no_transactions" size={55} />
          <Typography size="subheadline2" className="text-center" weight="regular" color="secondary">
            There are currently <br /> no active positions.
          </Typography>
        </div>
      }
      additionalInfo={{
        isSolana,
      }}
      columns={columns}
      rowsCount={4}
      data={activePositions}
    />
  );
};
