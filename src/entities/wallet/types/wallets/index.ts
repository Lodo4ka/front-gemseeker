import { contracts } from 'shared/api/contracts';
import { Column } from 'shared/ui/table';
import { infer as types } from 'zod';

export type Wallets = types<typeof contracts.wallets.all>;
export type Wallet = types<typeof contracts.wallets.wallet>;
export type WalletCol = Column<Wallet>;
