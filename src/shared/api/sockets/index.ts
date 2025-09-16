import { chat } from './chat';
import { stream } from './stream';
import { token } from './token';
export const sockets: {
  chat: typeof chat;
  token: typeof token;
  stream: typeof stream;
} = {
  chat,
  token,
  stream,
};
