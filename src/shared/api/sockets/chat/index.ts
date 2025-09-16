import { createEffect, createStore, sample } from 'effector';

import { createEvent } from 'effector';
import { Message } from 'entities/chat';
import { socketUrl } from 'shared/lib/base-url';

export type SocketMessage =
  | {
      type: string;
    }
  | Message;

function isMessage(obj: any): obj is Message {
  return obj && typeof obj === 'object' && 'id' in obj && 'text' in obj;
}

const TIMEOUT = 5_000;

const socketConnected = createEvent<WebSocket>();
const socketDisconnected = createEvent();
const socketError = createEvent<Error>();
const messageReceived = createEvent<Message>();
const messageSent = createEvent<string>();

export const $socket = createStore<WebSocket | null>(null)
  .on(socketConnected, (_, socket) => socket)
  .reset(socketDisconnected);

const connectSocketFx = createEffect((slug: string): Promise<WebSocket> => {
  const ws = new WebSocket(socketUrl(`/chat/ws/${slug}`));

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

    ws.onclose = () => {
      socketDisconnected();
    };

    ws.onmessage = (event) => {
      const messageData = JSON.parse(event.data).message as SocketMessage;
      if (isMessage(messageData)) {
        messageReceived(messageData);
      }
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

const sendMessageFx = createEffect((params: { socket: WebSocket; message: string }) => {
  params.socket.send(JSON.stringify({ message: params.message }));
});

const $error = createStore<Error | null>(null)
  .on(socketError, (_, error) => error)
  .reset(connectSocketFx.done);

sample({
  clock: messageSent,
  source: $socket,
  filter: Boolean,
  fn: (socket, message) => ({
    socket,
    message,
  }),
  target: sendMessageFx,
});

export const chat = {
  connectSocketFx,
  socketConnected,
  messageSent,
  $socket,
  socketDisconnected,
  messageReceived,
  $error,
  socketError,
};
