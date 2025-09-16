import { array } from 'zod';
import { contracts } from 'shared/client';

export const tradingActivity = array(contracts.VolumeDailyResponse);
