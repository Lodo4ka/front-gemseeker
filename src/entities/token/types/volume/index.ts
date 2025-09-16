import { api } from 'shared/api';
import { infer as types } from 'zod';

export type TokenVolume = types<typeof api.contracts.token.mcapSingle>;
