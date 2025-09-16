import { array } from 'zod';

import { contracts } from 'shared/client';

export const refRewardHistory = array(contracts.ReferralRewardResponse)
