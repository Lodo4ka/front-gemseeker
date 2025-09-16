import { api } from 'shared/api';
import { infer as types } from 'zod';

export type TxReceived = types<typeof api.contracts.token.txReceived>;
