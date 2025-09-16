import { createEvent, createStore, sample } from 'effector';

export const $currentToken = createStore<'SOL' | 'TOKEN'>('SOL');
export const toggledToken = createEvent();

sample({
  clock: toggledToken,
  source: $currentToken,
  fn: (token) => (token === 'SOL' ? 'TOKEN' : 'SOL'),
  target: $currentToken,
});
