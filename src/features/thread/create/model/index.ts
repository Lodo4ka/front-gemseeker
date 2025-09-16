import { combine, createEvent, createStore, sample } from 'effector';
import { $token } from 'entities/token';
import { api } from 'shared/api';

export const $text = createStore<string>('').reset(api.mutations.thread.create.finished.success);
export const changedText = createEvent<string>('');
export const createdThread = createEvent();
export const $areInputsEmpty = combine($text, (text) => text.trim() === '');
export const $error = createStore<string | null>(null);

$error.reset(api.mutations.thread.create.finished.success);
sample({
  clock: changedText,
  target: $text,
});

sample({
  clock: createdThread,
  source: {
    text: $text,
    token_id: $token.map((token) => token?.id || null),
  },
  filter: ({ text, token_id }) => text.trim() !== '' && token_id !== null,
  fn: ({ text, token_id }) => {
    if (!token_id) return { text, token_id: 0 };
    return { text, token_id };
  },
  target: api.mutations.thread.create.start,
});

sample({
  clock: createdThread,
  source: $areInputsEmpty,
  filter: Boolean,
  fn: () => 'Field cannot be empty',
  target: $error,
});
