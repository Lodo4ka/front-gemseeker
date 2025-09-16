import { api } from 'shared/api';
import { infer as types } from 'zod';

export type Token = types<typeof api.contracts.token.single>;

export type TokensObject = Record<string, Token>;

export type TokenAdresses = string[] | null;
