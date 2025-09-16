
import { createEvent, createStore, sample } from 'effector';
import { $token } from 'entities/token/model';

export const linePlaced = createEvent<{ price: number }>();
export const clearLine = createEvent();
export const setLineRef = createEvent<any>();
export const updateLinePrice = createEvent<number>();

export const $linePrice = createStore<number | null>(null)
  .on(linePlaced, (_, { price }) => price)
  .on(updateLinePrice, (_, price) => price)
  .reset(clearLine);

export const $lineRef = createStore<any>(null)
  .on(setLineRef, (_, ref) => ref)
  .reset(clearLine);

export const $lineDiff = sample({
  source: {
    price: $linePrice,
    token: $token,
  },
  fn: ({ price, token }) => {
    if (!price || !token) return null;
    const diff = ((price - token.mcap) / token.mcap) * 100;
    return +diff.toFixed(2);
  },
});
