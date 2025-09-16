import { create } from './create';
import { archive } from './archive';
import { setActive } from './set-active';
import { unarchive } from './unarchive';
import { rename } from './rename';
import { withdraw } from './withdraw';
import { deposit } from './deposit';
import { addDepositTransaction } from './add-deposit-transaction';

export const wallets = {
  create,
  archive,
  withdraw,
  unarchive,
  setActive,
  rename,
  addDepositTransaction,
  deposit,
};
