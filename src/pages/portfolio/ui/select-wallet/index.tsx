import { SelectWallet as SelectWalletUI } from 'entities/wallet';
import { togglesAllWallets, $selectAllWallets } from '../../model/all-wallets';

export const SelectWallet = () => {
  return (
    <div className="flex w-full gap-3">
      <SelectWalletUI
        className={{
          container: 'z-[10]',
        }}
        isVisibleAllWallets
        stateManagmentAllWallets={{
          toggled: togglesAllWallets,
          $store: $selectAllWallets,
        }}
      />
    </div>
  );
};
