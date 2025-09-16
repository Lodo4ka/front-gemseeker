import { authenticate } from './authenticate';
import { follow } from './follow';
import { logout } from './logout';
import { refreshToken } from './refresh-token';
import { update } from './update';
import { unfollow } from './unfollow';
import { claimRefBalance } from './claim-ref-balance';

export const user = {
  authenticate,
  logout,
  follow,
  unfollow,
  refreshToken,
  update,
  claimRefBalance,
};
