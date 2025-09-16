import { Connection } from '@solana/web3.js';
import { createStore } from 'effector';
import { baseUrl } from 'shared/lib/base-url';

const connection = new Connection(baseUrl('/rpc'), 'confirmed');
export const $connection = createStore(connection);
