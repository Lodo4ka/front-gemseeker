import { createEffect, createEvent, createStore, sample, split } from 'effector';
import { socketUrl } from 'shared/lib/base-url';
import { api } from 'shared/api';

import {
  DonationMessage,
  ViewerChangeMessage,
  StreamCreatedMessage,
  StreamFinishedMessage,
  StreamMessage,
} from 'shared/types/stream';

const TIMEOUT = 5_000;

const socketConnected = createEvent<WebSocket>();
const socketDisconnected = createEvent();
const socketError = createEvent<Error>();

const messageRawReceived = createEvent<StreamMessage>();

const connectSocketFx = createEffect((): Promise<WebSocket> => {
  const ws = new WebSocket(socketUrl('/streams/ws'));

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

        let parsed: StreamMessage | null = null;

        switch (json.type) {
          case 'STREAM_CREATED':
            parsed = api.contracts.stream.created.parse(json);
            break;
          case 'STREAM_FINISHED':
            parsed = api.contracts.stream.finished.parse(json);
            break;
          case 'DONATION':
            parsed = api.contracts.stream.donation.parse(json);
            break;
          case 'VIEWER_CHANGE':
            parsed = api.contracts.stream.viewer.parse(json);
            break;
        }
        if (parsed) messageRawReceived(parsed);
      } catch (err) {
        console.error('Socket parse error:', err);
      }
    });

    ws.onclose = () => {
      socketDisconnected();
    };

    ws.onerror = () => {
      clearTimeout(timeout);
      const error = new Error('WebSocket error');
      socketDisconnected();
      socketError(error);
      rej(error);
    };
  });
});

const $socket = createStore<WebSocket | null>(null)
  .on(socketConnected, (_, socket) => socket)
  .reset(socketDisconnected);

const $error = createStore<Error | null>(null)
  .on(socketError, (_, error) => error)
  .reset(connectSocketFx.done);

sample({
  clock: socketDisconnected,
  target: connectSocketFx,
});

const createdRawReceived = createEvent<StreamCreatedMessage>();
const finishedRawReceived = createEvent<StreamFinishedMessage>();
const donationRawReceived = createEvent<DonationMessage>();
const viewerChangedRawReceived = createEvent<ViewerChangeMessage>();

split({
  source: messageRawReceived,
  match: {
    streamCreated: (msg) => msg.type === 'STREAM_CREATED',
    streamFinished: (msg) => msg.type === 'STREAM_FINISHED',
    donationReceived: (msg) => msg.type === 'DONATION',
    viewerChanged: (msg) => msg.type === 'VIEWER_CHANGE',
  },
  cases: {
    streamCreated: createdRawReceived,
    streamFinished: finishedRawReceived,
    donationReceived: donationRawReceived,
    viewerChanged: viewerChangedRawReceived,
  },
});

export const stream = {
  $socket,
  $error,
  connectSocketFx,
  socketDisconnected,
  socketError,
  createdRawReceived,
  finishedRawReceived,
  viewerChangedRawReceived,
  donationRawReceived,
  socketConnected,
};
