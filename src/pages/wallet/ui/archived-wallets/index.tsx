import { useUnit } from 'effector-react';
import { Typography } from 'shared/ui/typography';
import { Icon } from 'shared/ui/icon';
import { Table } from 'shared/ui/table';
import { WalletHead, ArchivedActions, WalletCol, $archivedWallets } from 'entities/wallet';
import { paginationWallet } from 'entities/wallet/model/wallets';

export const columns: WalletCol[] = [
  {
    key: 'Wallets',
    title: 'Wallets',
    className: 'w-full',
    render: (props) => <WalletHead active={false} {...props} />,
  },

  {
    key: 'Actions',
    title: 'Actions',
    render: ({ id }) => <ArchivedActions id={id} />,
  },
];

export const ArchivedWallets = () => {
  const archivedWallets = useUnit($archivedWallets);

  return (
    <Table
      noData={
        <div className="my-20 flex flex-col items-center">
          <Icon name="archive2" size={54} />
          <Typography size="subheadline2" color="secondary" weight="regular">
            No archived wallets
          </Typography>
        </div>
      }
      className={{ row: 'hover:!bg-darkGray-1' }}
      columns={columns}
      rowsCount={5}
      data={archivedWallets}
      reachedEndOfList={paginationWallet.dataRanedOut}
      $isDataRanedOut={paginationWallet.$isEndReached}
    />
  );
};
