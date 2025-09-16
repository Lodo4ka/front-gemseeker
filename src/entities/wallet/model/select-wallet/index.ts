import { invoke } from '@withease/factories';
import { combine, createEvent, createStore, sample } from 'effector';
import { checkboxFactory } from 'shared/lib/checkbox';
import { selectFactory } from 'shared/lib/select';
import { copyFactory } from 'shared/lib/copy';
import { $wallets } from '../wallets';
import { infer as types } from 'zod';
import { api } from 'shared/api';
import { persist } from 'effector-storage/local';

export const { $isChecked, toggled } = invoke(checkboxFactory, {});

const selectWalletMutation = api.mutations.wallets.setActive;

const $firstWallet = combine($wallets, (wallets) =>
  wallets.length > 0
    ? (wallets.find(({ is_active }) => is_active === true) as types<typeof api.contracts.wallets.wallet>)
    : null,
);
export const { $value, selected } = invoke(() => selectFactory({ 
  defaultValue: $firstWallet,
  // filterSelected: (store, props) => {
  //   console.log(store?.id !== props?.option?.id)
  //   return store?.id !== props?.option?.id
  // }
}));
export const { copied } = invoke(() => copyFactory('Address copied to clipboard'));

sample({
  clock: selected,
  source: $value,
  // filter: (selectWallet, props) => {
  //   console.log( selectWallet?.id, props?.option?.id, selectWallet?.id !== props?.option?.id)
  //   return true
  // },
  fn: (_, props) => ({
    id: props?.option?.id ?? 0,
  }),
  target: selectWalletMutation.start,
});

persist({
  store: $value,
  key: 'selectedWallet',
});

export { $isChecked as $isAllWallets, $value as $selectedWallet };
