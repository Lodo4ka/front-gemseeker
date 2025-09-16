import { Typography } from 'shared/ui/typography';
import { Table } from 'shared/ui/table';
import { useUnit } from 'effector-react';
import { $isEndReached, dataRanedOut, onLoadedFirst } from '../../model/tokens-created';
import { pinataUrl } from 'shared/lib/base-url';
import { formatter } from 'shared/lib/formatter';
import { Icon } from 'shared/ui/icon';

import { routes } from 'shared/config/router';
import { Price } from './price';
import { $tokensCreated, TokenCreatedCol } from 'entities/user';
import { ImageHover } from 'shared/ui/image';

export const columns: TokenCreatedCol[] = [
  {
    key: 'Coin',
    title: 'Coin',
    className: 'min-w-[100px]',
    render: ({ photo_hash, symbol }) => (
      <div className="flex items-center gap-2">
        <ImageHover preview={pinataUrl(photo_hash)} alt="token" className="h-8 w-8 rounded-full" />
        <Typography size="subheadline2">{symbol}</Typography>
      </div>
    ),
  },
  {
    key: 'Type',
    title: 'Price',
    className: 'min-w-[100px]',
    render: ({ rate }) => <Price price={rate} />,
  },
  {
    key: 'Price',
    title: 'MCap',
    className: 'min-w-[160px]',
    render: ({ mcap, mcap_diff }) => (
      <div className="flex items-center gap-4">
        <Typography size="subheadline2" color="green" weight="regular">
          {formatter.number.uiDefault(mcap)}
        </Typography>
        <Typography size="subheadline2" color={mcap_diff >= 0 ? 'green' : 'red'} weight="regular">
          {formatter.number.uiDefault(mcap_diff)}%
        </Typography>
      </div>
    ),
  },
  {
    key: 'Amount',
    title: 'B.Curve',
    className: 'min-w-[100px]',
    render: ({ bounding_curve }) => (
      <Typography size="subheadline2" color="green" weight="regular">
        {formatter.number.uiDefault(bounding_curve)}%
      </Typography>
    ),
  },
  {
    key: 'Total',
    title: 'Created',
    className: 'min-w-[120px]',
    render: ({ created_at }) => (
      <Typography size="subheadline2" weight="regular">
        {formatter.date.timeAgo(created_at)}
      </Typography>
    ),
  },
];

export const TokensCreated = () => {
  const tokensCreated = useUnit($tokensCreated);
  const navigate = useUnit(routes.token.open);

  return (
    <Table
      columns={columns}
      isOnce={false}
      onRowClick={({ address }) => navigate({ address })}
      onLoaded={onLoadedFirst}
      reachedEndOfList={dataRanedOut}
      $isDataRanedOut={$isEndReached}
      className={{
        wrapper: 'bg-darkGray-3 max-2lg:bg-darkGray-1',
        container: 'h-[430px] overflow-y-auto',
        row: 'md:hover:!bg-darkGray-2 cursor-pointer',
      }}
      rowsCount={5}
      noData={
        <div className="flex h-[400px] w-full flex-col items-center justify-center">
          <Icon name="no_transactions" size={55} />
          <Typography size="subheadline2" className="text-center" weight="regular" color="secondary">
            There are currently <br /> no created tokens yet.
          </Typography>
        </div>
      }
      data={tokensCreated}
    />
  );
};
