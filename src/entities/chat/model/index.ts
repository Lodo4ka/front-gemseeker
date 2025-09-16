import { createEvent, createStore, sample } from 'effector';
import { MessageObject, MessagesIds } from '../types';

import { invoke } from '@withease/factories';
import { api } from 'shared/api';
import { paginationFactory } from 'shared/lib/pagination-factory';
import { $slug } from 'entities/stream';
import { $viewer } from 'shared/viewer';

export const $messages = createStore<MessageObject>({});

export const $messagesIds = createStore<MessagesIds>(null);
export const receivedOwnMessage = createEvent<void>();
export const $ownMessageCounter = createStore(0).on(receivedOwnMessage, (state) => state + 1);
export const limit = 20;

export const { $currentPage, $isEndReached, dataRanedOut, loadNextPage, onLoadedFirst } = invoke(paginationFactory, {
  limit,
});

sample({
  clock: api.queries.chat.history.finished.success,
  fn: ({ result }) => result.length < limit,
  target: $isEndReached,
});
sample({
  clock: loadNextPage,
  source: {
    offset: $currentPage,
    slug: $slug,
  },
  filter: ({ slug }) => slug !== null,
  fn: ({ offset, slug }) => ({ offset, limit, slug: slug as string }),
  target: api.queries.chat.history.refresh,
});

sample({
  clock: $slug,
  filter: Boolean,
  fn: (slug) => ({ offset: 0, limit, slug }),
  target: api.queries.chat.history.start,
});

api.queries.chat.history.finished.finally.watch(console.log);
sample({
  clock: api.queries.chat.history.finished.success,
  source: $messagesIds,
  fn: (messagesIds, { result }) => {
    const newMessagesIds = Array.from(new Set(result.map((message) => message.id))).reverse();
    if (messagesIds === null) return newMessagesIds;

    return [...newMessagesIds, ...messagesIds];
  },
  target: $messagesIds,
});

sample({
  clock: api.queries.chat.history.finished.success,
  source: $messages,
  fn: (messages, { result, params }) => ({
    ...messages,
    [params.slug]: {
      ...messages[params.slug],
      ...Object.fromEntries(result.map((message) => [message.id, message])),
    },
  }),
  target: $messages,
});

sample({
  clock: api.sockets.chat.messageReceived,
  source: {
    messages: $messages,
    slug: $slug,
  },
  filter: ({ slug }) => slug !== null,
  fn: ({ messages, slug }, message) => {
    return {
      ...messages,
      [slug!]: {
        ...Object.fromEntries([[message.id, message]]),
        ...messages[slug!],
      },
    };
  },
  target: $messages,
});

sample({
  clock: api.sockets.stream.donationRawReceived,
  source: {
    messages: $messages,
    slug: $slug,
  },
  filter: ({ slug }, message) => slug === message.info.slug,
  fn: ({ messages, slug }, message) => {
    return {
      ...messages,
      [slug!]: {
        ...Object.fromEntries([
          [
            message.donation.signature,
            {
              type: 'donation',
              amount: message.donation.amount,
              id: message.donation.signature,
              user_info: {
                user_id: message.donation.user.user_id,
                user_nickname: message.donation.user.user_nickname,
                user_photo_hash: message.donation.user.user_photo_hash,
              },
              text: message.donation.text,
              timestamp: message.donation.timestamp,
            },
          ],
        ]),
        ...messages[slug!],
      },
    };
  },
  target: $messages,
});

sample({
  clock: api.sockets.chat.messageReceived,
  source: $messagesIds,
  fn: (messagesIds, message) => {
    if (messagesIds === null) return [message.id];
    return Array.from(new Set([...messagesIds, message.id]));
  },
  target: $messagesIds,
});

sample({
  clock: api.sockets.stream.donationRawReceived,
  source: $messagesIds,
  fn: (messagesIds, message) => {
    if (messagesIds === null) return [message.donation.signature];
    return Array.from(new Set([...messagesIds, message.donation.signature]));
  },
  target: $messagesIds,
});

sample({
  clock: api.queries.chat.history.finished.success,
  filter: ({ params }) => params.offset === 0,
  fn: ({ params }) => params.slug,
  target: api.sockets.chat.connectSocketFx,
});

sample({
  clock: api.sockets.chat.socketError,
  source: $slug,
  filter: (slug, error) => error && slug !== null,
  fn: (slug) => slug as string,
  target: api.sockets.chat.connectSocketFx,
});

sample({
  clock: api.sockets.chat.messageReceived,
  source: $currentPage,
  fn: (currentPage) => currentPage + 1,
  target: $currentPage,
});

sample({
  clock: api.sockets.chat.messageReceived,
  source: $viewer,
  filter: (viewer, message) => viewer?.user_id === message.user_info.user_id,
  fn: () => undefined,
  target: receivedOwnMessage,
});
