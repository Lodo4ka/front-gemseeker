import { Typography } from 'shared/ui/typography';
import { Column, Table } from 'shared/ui/table';
import { Maker, UserProfileTable } from 'shared/ui/maker';
import { useUnit } from 'effector-react';
import { $isEndReached, $trades, dataRanedOut, onLoadedFirst } from '../../model/trades';
import { formatter } from 'shared/lib/formatter';
import { $rate } from 'features/exchange-rate';
import { getFullUrlTx } from 'shared/lib/full-url-tx';
import { Timestamp } from 'shared/ui/timestamp';
import { $tokenPreview, $tokenTicket } from 'entities/token/model';
import { ImageHover } from 'shared/ui/image';
import { getFullUrlImg } from 'shared/lib/full-url-img';
import { $isAnimationsEnabled } from 'features/toggle-animations';
import { animations } from 'shared/config/animations';
import { Icon } from 'shared/ui/icon';
import { contracts } from 'shared/client';
import { infer as types } from 'zod';

const AmountTitle = () => {
  const [tokenTicket, tokenPreview] = useUnit([$tokenTicket, $tokenPreview]);
  return (
    <div className="flex items-center gap-[4px]">
      <ImageHover preview={getFullUrlImg(tokenPreview, tokenTicket)} className="h-4 w-4 rounded-full" />
      {tokenTicket} Amount
    </div>
  );
};

const getColor = (type: string) => {
  if (type === 'BUY') return 'green';
  if (type === 'SELL') return 'red';
  if (type === 'MIGRATION') return 'yellow';
  return 'blue';
};

const getBackground = (type: string) => {
  if (type === 'BUY') return 'var(--color-darkGreen)';
  if (type === 'SELL') return 'var(--color-darkRed)';
  if (type === 'MIGRATION') return 'var(--color-darkYellow)';
  return '#1e3a8a80';
};

export const columns: Column<types<typeof contracts.TxResponse>>[] = [
  {
    key: 'Data',
    title: 'Data',
    render: ({ timestamp }) => <Timestamp timestamp={timestamp} />,
  },
  {
    key: 'Type',
    title: 'Type',
    className: '',
    render: ({ type }) => {
      return (
        <Typography
          size="captain1"
          color={getColor(type)}
          className="w-fit rounded-sm px-2 py-[2.5px] capitalize"
          style={{
            background: getBackground(type),
          }}>
          <span className="md:hidden">
            {type === 'BUY' && 'B'}
            {type === 'SELL' && 'S'}
            {type === 'MIGRATION' && 'M'}
            {type === 'DEPLOY' && 'D'}
          </span>
          <span className="hidden md:inline">
            {type === 'BUY' && 'Buy'}
            {type === 'SELL' && 'Sell'}
            {type === 'MIGRATION' && 'Migration'}
            {type === 'DEPLOY' && 'Deploy'}
          </span>
        </Typography>
      );
    },
  },
  {
    key: 'Price',
    className: 'min-w-[200px]',
    title: (
      <Typography className="flex items-center !gap-1" weight="regular" color="secondary">
        Price
        <Typography weight="regular" color="green">
          SOL /
        </Typography>{' '}
        <Typography weight="regular" color="green">
          USD
        </Typography>
      </Typography>
    ),
    render: ({ type, rate }, additionalInfo) => (
      <Typography color={getColor(type)} weight="regular">
        {`${formatter.number.formatSmallNumber(rate)} `}/ $
        {formatter.number.formatSmallNumber(rate * additionalInfo?.rate)}
      </Typography>
    ),
  },
  {
    key: 'Amount',
    title: <AmountTitle />,
    className: 'min-w-[150px]',
    render: ({ token_amount, type }) => (
      <Typography color={getColor(type)} weight="regular">
        {formatter.number.formatSmallNumber(token_amount)}
      </Typography>
    ),
  },
  {
    key: 'Pnl',
    title: 'Pnl',
    render: ({ pnl, type }, additionalInfo) => (
      <Typography color={getColor(type)} weight="regular">
        {type === 'BUY' ? (
          '-'
        ) : (
          <>
            {pnl && pnl > 0 ? '+' : '-'}${formatter.number.formatSmallNumber((pnl ?? 0) * (additionalInfo?.rate ?? 0))}
          </>
        )}
      </Typography>
    ),
  },
  {
    key: 'Total',
    className: 'min-w-[200px]',
    title: (
      <Typography className="flex items-center !gap-1" weight="regular" color="secondary">
        Total
        <Typography weight="regular" color="green">
          Sol
        </Typography>
      </Typography>
    ),
    render: ({ sol_amount, type }, additionalInfo) => (
      <Typography
        icon={{ name: 'solana', position: 'left', size: 16 }}
        className="!gap-2"
        color={getColor(type)}
        weight="regular">
        {`${formatter.number.formatSmallNumber(sol_amount)} `}/ $
        {formatter.number.formatSmallNumber(sol_amount * (additionalInfo?.rate ?? 0))}
      </Typography>
    ),
  },
  {
    key: 'Maker',
    title: 'Maker',
    isNotOnClick: true,
    render: ({ user_info, type, maker }) => <Maker user_id={user_info.user_id ?? 0} type={type} maker={maker ?? ''} />,
  },
  {
    key: 'Profile',
    title: 'Profile',
    className: 'min-w-[150px]',
    isNotOnClick: true,
    render: ({ user_info }) => <UserProfileTable {...user_info} address={''} />,
  },
];

export const Trades = () => {
  const [trades, rate, isAnimationEnabled] = useUnit([$trades, $rate, $isAnimationsEnabled]);

  return (
    <Table
      onRowClick={({ hash }) => window.open(getFullUrlTx(hash), '_blank')}
      columns={columns}
      animation={{
        first: animations.table.flashAndShake,
      }}
      onLoaded={onLoadedFirst}
      isAnimationsEnabled={isAnimationEnabled}
      rowsCount={7}
      className={{
        row: 'cursor-pointer',
      }}
      data={trades}
      uniqueKey={({ hash }) => hash}
      reachedEndOfList={dataRanedOut}
      $isDataRanedOut={$isEndReached}
      additionalInfo={{ rate }}
      noData={
        <div className="mt-[136px] flex h-full w-full flex-col items-center justify-center">
          <Icon name="no_transactions" size={55} />
          <Typography size="subheadline2" className="text-center" weight="regular" color="secondary">
            There are currently <br /> no transactions.
          </Typography>
        </div>
      }
    />
  );
};
