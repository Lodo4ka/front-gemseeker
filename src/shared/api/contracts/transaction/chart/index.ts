import { array } from 'zod';

import { contracts } from 'shared/client';

export const chart = array(contracts.TxResponse);
