import { contracts } from 'shared/client';
import { array } from 'zod';

export const holder = contracts.HolderResponse

export const holders = array(holder);
