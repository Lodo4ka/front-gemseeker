import { invoke } from '@withease/factories';
import { copyFactory } from 'shared/lib/copy';

export const { copied } = invoke(copyFactory, 'Address copied to clipboard');

export {
  $signMessage,
  initPublicKey,
  resetPublicKey,
  authenticated,
  generateNonceFailed,
  $publicKey,
  disconnected,
  initDisconnect,
  $isAuthenticating,
} from './auth';
export { $balance, getBalanceFx, $balanceCastodial, $walletsBalances, $totalBalance } from './balance';
export {selected as selectedWallet, $value as $selectWallet} from './select-wallet'