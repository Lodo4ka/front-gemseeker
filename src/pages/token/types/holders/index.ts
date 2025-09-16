import { infer as types } from 'zod';
import { api } from 'shared/api';

export type Holder = types<typeof api.contracts.token.holder>;
