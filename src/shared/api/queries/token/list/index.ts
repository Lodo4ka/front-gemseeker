import { invoke } from '@withease/factories';
import { tokensFactory } from '../tokens-factory';

export const list = invoke(tokensFactory);
