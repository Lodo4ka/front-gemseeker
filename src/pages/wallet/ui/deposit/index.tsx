import { useUnit } from 'effector-react';
import { Column, Table } from 'shared/ui/table';
import { api } from 'shared/api';
import { infer as types } from 'zod';
import { Input } from 'shared/ui/input';
import { Balance, WalletHead, $wallets } from 'entities/wallet';
import { DepositButton, DepositInput, TotalAmount } from './components';
import { paginationWallet } from 'entities/wallet/model/wallets';

export const columns: Column<types<typeof api.contracts.wallets.wallet>>[] = [
  {
    key: 'Wallets',
    title: 'Wallets',
    className: 'w-[50%] min-w-[175px]',
    render: (props) => <WalletHead active {...props} />,
    last: TotalAmount,
  },
  {
    key: 'Balance',
    title: 'Balance',
    className: 'w-full min-w-[125px]',
    render: ({ public_key }) => <Balance public_key={public_key} />,
    last: () => (
      <Input
        label="Priority fee"
        classNames={{
          label: '!text-secondary !text-nowrap',
          container:
            'w-[200px] max-sm:w-[140px] !flex !items-center !flex-row !gap-4 max-sm:!flex-col max-sm:!items-start max-sm:!gap-1',
          flex: 'bg-darkGray-3 !px-3',
          input: 'leading-[20px] h-5 text-[14px]',
        }}
        placeholder="0.00001"
      />
    ),
  },
  {
    key: 'Deposit',
    title: 'Deposit',
    render: ({ id }) => <DepositInput wallet_id={id} />,
    last: () => <DepositButton />,
  },
];

export const Deposit = () => {
  const wallets = useUnit($wallets);
  return (
    <Table
      className={{
        row: 'hover:!bg-darkGray-1',
      }}
      columns={columns}
      rowsCount={5}
      data={wallets}
      reachedEndOfList={paginationWallet.dataRanedOut}
      $isDataRanedOut={paginationWallet.$isEndReached}
    />
  );
};
