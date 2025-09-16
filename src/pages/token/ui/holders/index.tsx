import { Typography } from 'shared/ui/typography';
import { Column, Table } from 'shared/ui/table';

import { Icon } from 'shared/ui/icon';
import { Holder } from '../../types/holders';
import { formatter } from 'shared/lib/formatter';
import { useUnit } from 'effector-react';
import { $holders, $isEndReached, dataRanedOut, onLoadedFirst } from '../../model/holders';
import { Maker, UserProfileTable } from 'shared/ui/maker';
import { $token } from 'entities/token';
import { $rate } from 'features/exchange-rate';

const Amount = ({ amount }: { amount: number }) => {
  const [token, rate] = useUnit([$token, $rate]);

  return (
    <Typography weight="regular">${formatter.number.formatSmallNumber(amount * (token?.rate || 0) * rate)}</Typography>
  );
};

export const columns: Column<Holder>[] = [
  {
    key: 'Holders',
    title: 'Holders',
    className: 'w-[30%]',
    render: ({ user, type, address }) => <Maker type={type as string} user_id={user.user_id ?? 0} maker={address} />,
  },
  {
    key: 'Profile',
    title: 'Profile',
    className: 'w-[30%]',
    render: ({ user, address }) => (
      <UserProfileTable
        user_id={user.user_id}
        user_nickname={user.user_nickname}
        user_photo_hash={user.user_photo_hash}
        address={address}
      />
    ),
  },
  {
    key: '%Owned',
    title: '%Owned',
    className: 'w-[30%]',
    render: ({ percentage }) => (
      <Typography weight="regular">{formatter.number.formatSmallNumber(percentage)}%</Typography>
    ),
  },
  {
    key: 'Amount',
    title: 'Amount',
    className: 'w-[30%]',
    render: ({ amount }) => <Typography weight="regular">{formatter.number.formatSmallNumber(amount)}</Typography>,
  },
  {
    key: 'Value',
    title: 'Value',
    className: 'w-[20%]',
    render: ({ amount }) => <Amount amount={amount} />,
  },
];

export const Holders = () => {
  const holders = useUnit($holders);

  if (history !== null && history.length === 0)
    return (
      <div className="bg-darkGray-1 flex h-[412px] w-full flex-col items-center justify-center rounded-xl">
        <Icon name="no_transactions" size={55} />
        <Typography size="subheadline2" className="text-center" weight="regular" color="secondary">
          There are currently <br /> no holders yet.
        </Typography>
      </div>
    );
  return (
    <Table
      columns={columns}
      onLoaded={onLoadedFirst}
      isOnce={true}
      reachedEndOfList={dataRanedOut}
      $isDataRanedOut={$isEndReached}
      rowsCount={10}
      data={holders}
    />
  );
};
