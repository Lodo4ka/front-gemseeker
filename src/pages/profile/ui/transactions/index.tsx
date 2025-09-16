import { Typography } from 'shared/ui/typography';
import { Table } from 'shared/ui/table';
import { useUnit } from 'effector-react';
import { $isEndReached, dataRanedOut, onLoadedFirst } from '../../model/transactions';
import { formatter } from 'shared/lib/formatter';
import clsx from 'clsx';
import { Icon } from 'shared/ui/icon';
import { pinataUrl } from 'shared/lib/base-url';

import { Amount } from './amount';
import { TransactionByUserCol } from 'entities/user/types';
import { $transactions } from 'entities/user';
import { ImageHover } from 'shared/ui/image';

export const columns: TransactionByUserCol[] = [
  {
    key: 'Data',
    title: 'Data',
    className: 'min-w-[120px]',
    render: ({ timestamp }) => (
      <Typography weight="regular" size="subheadline2" color="secondary">
        {formatter.date.timeAgo(timestamp)}
      </Typography>
    ),
  },
  {
    key: 'Type',
    title: 'Type',
    className: 'md:min-w-[230px] min-w-[210px]',
    render: ({ type, token_photo_hash, token_name }) => (
      <div className="flex items-center gap-4">
        <Typography
          size="captain1"
          color={type === 'DEPLOY' ? 'blue' : type === 'BUY' ? 'green' : 'red'}
          className={clsx('w-fit min-w-[56px] justify-center rounded-sm px-2 py-[2.5px] capitalize', {
            'bg-darkGreen': type === 'BUY',
            'bg-darkRed': type === 'SELL',
            'bg-darkGray-2': type === 'DEPLOY',
          })}>
          <span className="md:hidden">{type[0]}</span>
          <span className="hidden md:inline">{type.toLowerCase()}</span>
        </Typography>
        <div className="flex items-center gap-2">
          <ImageHover preview={pinataUrl(token_photo_hash)} className="h-[30px] w-[30px] rounded-full" alt="logo" />
          <Typography size="subheadline2">{token_name}</Typography>
        </div>
      </div>
    ),
  },
  {
    key: 'Price',
    title: 'Price',
    className: 'min-w-[120px]',
    render: ({ type, sol_amount }) => <Amount type={type} sol_amount={sol_amount} />,
  },
  {
    key: 'Amount',
    title: 'Amount',
    className: 'min-w-[120px]',
    render: ({ token_amount, type, token_symbol }) => (
      <Typography size="subheadline2" color={type === 'BUY' ? 'green' : 'red'} weight="regular">
        {type === 'SELL' && '-'}
        {formatter.number.formatSmallNumber(token_amount)} {token_symbol}
      </Typography>
    ),
  },
  {
    key: 'Total',
    title: 'Amount (SOL)',
    className: 'min-w-[120px]',
    render: ({ sol_amount, type }) => (
      <Typography size="subheadline2" color={type === 'BUY' ? 'green' : 'red'} weight="regular">
        {type === 'SELL' && '-'}
        {formatter.number.formatSmallNumber(sol_amount)} SOL
      </Typography>
    ),
  },
];

export const Transactions = () => {
  const transactions = useUnit($transactions);

  return (
    <Table
      isOnce={false}
      columns={columns}
      reachedEndOfList={dataRanedOut}
      $isDataRanedOut={$isEndReached}
      className={{
        wrapper: 'bg-darkGray-3 max-2lg:bg-darkGray-1',
        container: 'h-[430px] overflow-y-auto',
        row: 'md:hover:!bg-darkGray-2',
      }}
      rowsCount={5}
      onLoaded={onLoadedFirst}
      data={transactions}
      noData={
        <div className="flex h-[400px] w-full flex-col items-center justify-center">
          <Icon name="no_transactions" size={55} />
          <Typography size="subheadline2" className="text-center" weight="regular" color="secondary">
            There are currently <br /> no transactions yet.
          </Typography>
        </div>
      }
    />
  );
};
