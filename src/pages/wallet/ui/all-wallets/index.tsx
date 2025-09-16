import { useUnit } from 'effector-react';

import { Column, Table } from 'shared/ui/table';
import { $wallets, AllActions, Holdings, WalletHead, Balance, type Wallet } from 'entities/wallet';
import { changedActiveTab } from '../../model';
import { paginationWallet } from 'entities/wallet/model/wallets';

export const columns: Column<Wallet>[] = [
  {
    key: 'Wallets',
    title: 'Wallets',
    render: (props) => <WalletHead active {...props} />,
    className: 'min-w-[180px] w-[40%]',
  },
  {
    key: 'Balance',
    title: 'Balance',
    className: 'w-[30%] min-w-[175px]',
    render: ({ public_key }) => <Balance public_key={public_key} />,
  },
  {
    key: 'Holdings',
    title: 'Holdings',
    className: 'w-full min-w-[175px]',
    render: ({ holdings }) => <Holdings holdings={holdings} />,
  },
  {
    key: 'Actions',
    title: 'Actions',
    render: ({ id }) => <AllActions changedActiveTab={changedActiveTab} id={id} />,
  },
];

export const AllWallets = () => {
  const wallets = useUnit($wallets);

  return (
    <Table 
      className={{ row: 'hover:!bg-darkGray-1' }} 
      columns={columns} 
      rowsCount={5} 
      data={wallets} 
      reachedEndOfList={paginationWallet.dataRanedOut}
      $isDataRanedOut={paginationWallet.$isEndReached}
    />
  )
};
