import { createEffect, createStore, sample, split } from 'effector';

import { createEvent } from 'effector';

import { socketUrl } from 'shared/lib/base-url';
import { api } from 'shared/api';
import { TxReceived } from 'shared/types/token';

const TIMEOUT = 5_000;

const socketConnected = createEvent<WebSocket>();
const socketDisconnected = createEvent();
const socketError = createEvent<Error>();

const messageRawReceived = createEvent<TxReceived>();

const connectSocketFx = createEffect((): Promise<WebSocket> => {
  const ws = new WebSocket(socketUrl('/ws'));

  return new Promise((res, rej) => {
    const timeout = setTimeout(() => {
      const error = new Error('Connection timeout');

      socketError(error);
      rej(error);
      ws.close();
    }, TIMEOUT);

    ws.onopen = () => {
      clearTimeout(timeout);
      socketConnected(ws);
      res(ws);
    };

    ws.addEventListener('message', (event) => {
      try {
        const json = JSON.parse(event.data);

        if (json.type === 'heartbeat') return;

        let parsed: TxReceived = api.contracts.token.txReceived.parse(json);

        if (parsed) messageRawReceived(parsed);
      } catch (err) {
        console.error('Socket parse error:', err);
      }
    });

    ws.onclose = () => {
      socketDisconnected();
    };

    ws.onerror = (err) => {
      clearTimeout(timeout);
      const error = new Error('WebSocket error');
      console.log(err);
      socketDisconnected();
      socketError(error);
      rej(error);
    };
  });
});

const $socket = createStore<WebSocket | null>(null)
  .on(socketConnected, (_, socket) => socket)
  .reset(socketDisconnected);

// Store for error storage
const $error = createStore<Error | null>(null)
  .on(socketError, (_, error) => error)
  .reset(connectSocketFx.done);

const buyTxRawReceived = createEvent<TxReceived>();
const sellTxRawReceived = createEvent<TxReceived>();
const deployTxRawReceived = createEvent<TxReceived>();
const migrationTxRawReceived = createEvent<TxReceived>();
const anyTxRawReceived = createEvent<TxReceived>();

split({
  source: messageRawReceived,
  match: {
    buy: (msg) => msg.type === 'BUY',
    sell: (msg) => msg.type === 'SELL',
    deploy: (msg) => msg.type === 'DEPLOY',
    migration: (msg) => msg.type === 'MIGRATION',
  },
  cases: {
    buy: [buyTxRawReceived, anyTxRawReceived],
    sell: [sellTxRawReceived, anyTxRawReceived],
    deploy: [deployTxRawReceived, anyTxRawReceived],
    migration: [migrationTxRawReceived, anyTxRawReceived],
  },
});

sample({
  clock: socketDisconnected,
  target: connectSocketFx,
});

export const token = {
  socketConnected,
  $socket,
  connectSocketFx,
  socketDisconnected,
  sellTxRawReceived,
  buyTxRawReceived,
  deployTxRawReceived,
  migrationTxRawReceived,
  anyTxRawReceived,
  socketError,
  $error,
};
