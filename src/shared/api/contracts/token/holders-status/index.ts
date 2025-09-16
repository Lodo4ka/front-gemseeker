import { contracts } from 'shared/client';
import { array } from 'zod';

export const holdersStatus = array(contracts.HolderStatusResponse)

