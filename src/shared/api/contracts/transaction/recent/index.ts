import { array } from 'zod';

import {contracts} from 'shared/client'

export const recent = array(contracts.RecentTxResponse);