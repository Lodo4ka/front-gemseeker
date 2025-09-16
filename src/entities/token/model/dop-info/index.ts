import { createEvent, createStore, sample } from 'effector';
import { debounce } from 'patronum';
import type { BatchItem, TokenDopInfoObject } from '../../types/dop-info';
import { api } from 'shared/api';

const MAX_BATCH_SIZE = 10;
const DEBOUNCE_TIMEOUT = 1000;

export const $tokensDopInfo = createStore<TokenDopInfoObject>({});
export const loadedToken = createEvent<{ address: string; creator: string }>();

const sendBatch = createEvent();
const $batchBuffer = createStore<BatchItem[]>([]);

sample({
  clock: loadedToken,
  source: $batchBuffer,
  fn: (buffer, { address, creator }) => [
    ...buffer,
    { type: 'address' as const, value: address },
    { type: 'creator' as const, value: creator },
  ],
  target: $batchBuffer,
});

sample({
  clock: loadedToken,
  fn: ({ address }) => address,
  target: [api.queries.token.dopInfo.insiders.start, api.queries.token.dopInfo.snipers.start],
});

sample({
  clock: $batchBuffer,
  filter: (buffer) => buffer.length >= MAX_BATCH_SIZE,
  fn: (buffer) => buffer.slice(0, MAX_BATCH_SIZE),
  target: api.queries.token.dopInfo.batch.start,
});

debounce({
  source: loadedToken,
  timeout: DEBOUNCE_TIMEOUT,
  target: sendBatch,
});

sample({
  clock: sendBatch,
  source: $batchBuffer,
  filter: (buffer) => buffer.length > 0,
  fn: (buffer) => buffer.slice(0, MAX_BATCH_SIZE),
  target: api.queries.token.dopInfo.batch.start,
});

sample({
  clock: api.queries.token.dopInfo.batch.started,
  source: $batchBuffer,
  fn: (buffer, { params }) => buffer.slice(params.length),
  target: $batchBuffer,
});

sample({
  clock: api.queries.token.dopInfo.batch.finished.success,
  source: $tokensDopInfo,
  fn: (currentInfo, { result }) => {
    const updated = { ...currentInfo };

    for (const [mint, data] of Object.entries(result)) {
      if (!updated[mint]) {
        updated[mint] = { topHolders: null, creator: null, insiders: null, snipers: null };
      }

      updated[mint] = { ...updated[mint], ...data };
    }

    return updated;
  },
  target: $tokensDopInfo,
});

sample({
  clock: api.queries.token.dopInfo.insiders.finished.success,
  source: $tokensDopInfo,
  fn: (info, { result, params }) => ({
    ...info,
    [params]: {
      ...(info[params] || { topHolders: null, creator: null, insiders: null, snipers: null }),
      insiders: result,
    },
  }),
  target: $tokensDopInfo,
});

sample({
  clock: api.queries.token.dopInfo.snipers.finished.success,
  source: $tokensDopInfo,
  fn: (info, { result, params }) => ({
    ...info,
    [params]: {
      ...(info[params] || { topHolders: null, creator: null, insiders: null, snipers: null }),
      snipers: result,
    },
  }),
  target: $tokensDopInfo,
});

sample({
  clock: api.sockets.token.anyTxRawReceived,
  fn: ({ token_info }) => ({ address: token_info.address, creator: token_info.deployer_wallet as string }),
  target: loadedToken,
});
