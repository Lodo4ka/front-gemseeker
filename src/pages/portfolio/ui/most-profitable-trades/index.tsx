import { Typography } from 'shared/ui/typography';
import { Table } from 'shared/ui/table';

import { Icon } from 'shared/ui/icon';
import { $mostProfitableTrades, MostProfitableCol } from 'entities/user';
import { formatter } from 'shared/lib/formatter';
import { useUnit } from 'effector-react';
import { $isEndReached, dataRanedOut, onLoadedFirst } from '../../model/most-profitable-trades';
import { routes } from 'shared/config/router';
import { ImageHover } from 'shared/ui/image';
import { getFullUrlImg } from 'shared/lib/full-url-img';
import { $isChecked } from '../../model/checkbox';

type PnlProps = {
  pnl: number;
  pnl_sol: number;
};

const Pnl = ({ pnl, pnl_sol }: PnlProps) => {
  const isSolana = useUnit($isChecked);
  return !isSolana ? (
    <Typography size="subheadline2" weight="regular">
      {formatter.number.uiDefaultWithDollar(pnl)}
    </Typography>
  ) : (
    <Typography size="subheadline2" icon={{ name: 'solana', size: 18, position: 'left' }} weight="regular">
      {formatter.number.uiDefault(pnl_sol)}
    </Typography>
  );
};

export const columns: MostProfitableCol[] = [
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
    key: 'PnL',
    title: 'PnL',
    className: 'min-w-[200px]',
    render: ({ pnl, pnl_sol }) => <Pnl pnl={pnl} pnl_sol={pnl_sol} />,
  },
  {
    key: 'PnL(%)',
    title: 'PnL(%)',
    className: 'min-w-[100px]',
    render: ({ pnl_percentage }) => (
      <Typography size="subheadline2" weight="regular" color={pnl_percentage < 0 ? 'red' : 'green'}>
        {formatter.number.uiDefault(pnl_percentage)}%
      </Typography>
    ),
  },
];

export const MostProfitableTrades = () => {
  const history = useUnit($mostProfitableTrades);
  const openToken = useUnit(routes.token.open);

  return (
    <Table
      onRowClick={({ address }) => openToken({ address: address ?? '' })}
      columns={columns}
      onLoaded={onLoadedFirst}
      reachedEndOfList={dataRanedOut}
      $isDataRanedOut={$isEndReached}
      rowsCount={3}
      className={{
        container: 'overflow-y-auto',
        row: 'cursor-pointer',
      }}
      noData={
        <div className="mt-[136px] flex h-full w-full flex-col items-center justify-center">
          <Icon name="no_transactions" size={55} />
          <Typography size="subheadline2" className="text-center" weight="regular" color="secondary">
            There are currently <br /> no profitable trades yet.
          </Typography>
        </div>
      }
      data={history}
    />
  );
};
