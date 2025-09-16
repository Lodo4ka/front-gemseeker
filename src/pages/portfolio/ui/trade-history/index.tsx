import { Typography } from 'shared/ui/typography';
import { Table } from 'shared/ui/table';

import { Icon } from 'shared/ui/icon';
import { useUnit } from 'effector-react';
import { $isEndReached, dataRanedOut, onLoadedFirst } from '../../model/trade-history';
import clsx from 'clsx';
import { formatter } from 'shared/lib/formatter';
import { $tradesHistory, TradesHistoryCol } from 'entities/user';
import { routes } from 'shared/config/router';
import { ImageHover } from 'shared/ui/image';
import { getFullUrlImg } from 'shared/lib/full-url-img';
import { $isChecked } from 'pages/portfolio/model/checkbox';
type AmountProps = {
  amount: number;
  amount_sol: number;
  type: string;
};
const Amount = ({ amount, amount_sol, type }: AmountProps) => {
  const isSolana = useUnit($isChecked);
  return !isSolana ? (
    <Typography size="subheadline2" weight="regular" color={type === 'SELL' ? 'red' : 'green'}>
      {formatter.number.uiDefaultWithDollar(amount)}
    </Typography>
  ) : (
    <Typography
      color={type === 'SELL' ? 'red' : 'green'}
      size="subheadline2"
      icon={{ name: 'solana', size: 18, position: 'left' }}
      weight="regular">
      {formatter.number.uiDefault(amount_sol)}
    </Typography>
  );
};

export const columns: TradesHistoryCol[] = [
  {
    key: 'Data',
    title: 'Data',
    className: 'min-w-[150px]',
    render: ({ timestamp }) => (
      <Typography size="subheadline2" weight="regular" color="secondary">
        {formatter.date.timeAgo(timestamp)}
      </Typography>
    ),
  },
  {
    key: 'Coin',
    title: 'Coin',
    className: 'min-w-[275px]',
    render: ({ type, token_photo_hash, token_name }) => (
      <div className="flex items-center gap-4">
        <Typography
          size="captain1"
          color={type === 'BUY' ? 'green' : 'red'}
          className={clsx('w-fit rounded-sm px-2 py-[2.5px] capitalize', {
            'bg-darkGreen': type === 'BUY',
            'bg-darkRed': type === 'SELL',
          })}>
          <span className="md:hidden">{type[0]}</span>
          <span className="hidden md:inline">{type.toLowerCase()}</span>
        </Typography>
        <div className="flex items-center gap-2">
          <ImageHover
            preview={getFullUrlImg(token_photo_hash, token_name)}
            className="h-[30px] w-[30px] rounded-full"
            alt="name"
          />
          <Typography size="subheadline2">{token_name}</Typography>
        </div>
      </div>
    ),
  },
  {
    key: 'Price',
    title: 'Price',
    className: 'min-w-[75px]',
    render: ({ price, price_sol, type }) => <Amount amount={price} amount_sol={price_sol} type={type} />,
  },
  {
    key: 'Amount',
    title: 'Amount',
    className: 'min-w-[100px]',
    render: ({ amount, type }) => (
      <Typography size="subheadline2" weight="regular" color={type === 'SELL' ? 'red' : 'green'}>
        {type === 'SELL' && '-'}
        {formatter.number.uiDefault(amount)}
      </Typography>
    ),
  },
  {
    key: 'Total',
    title: 'Total',
    className: 'min-w-[100px]',
    render: ({ total, type, total_sol }) => <Amount amount={total} amount_sol={total_sol} type={type} />,
  },
  {
    key: 'Maker',
    title: 'Maker',
    className: 'min-w-[100px]',
    render: ({ maker }) => (
      <Typography size="subheadline2" weight="regular" color={maker ? 'green' : 'red'}>
        {maker ? 'Yes' : 'No'}
      </Typography>
    ),
  },
];

export const TradesHistory = () => {
  const history = useUnit($tradesHistory);
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
      columns={columns}
      noData={
        <div className="mt-[136px] flex h-full w-full flex-col items-center justify-center">
          <Icon name="no_transactions" size={55} />
          <Typography size="subheadline2" className="text-center" weight="regular" color="secondary">
            There are currently <br /> no trades yet.
          </Typography>
        </div>
      }
      rowsCount={6}
      data={history}
    />
  );
};
