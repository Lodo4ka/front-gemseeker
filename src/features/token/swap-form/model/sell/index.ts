import { createEvent, sample } from 'effector';
import { $rateSellTokens, amount } from '../input';
import { $address, $briberyAmount, $priorityFee, $speed, $token } from 'entities/token';
import { sellTokenMutation } from '../';

export const sold = createEvent();

sample({
  clock: sold,
  source: {
    exact_amount_in: amount.$value,
    speed: $speed,
    priority_fee: $priorityFee,
    bribery_amount: $briberyAmount,
    symbol: $token.map((token) => token?.symbol),
    rate: $rateSellTokens,
    address: $address,
  },
  fn: ({ exact_amount_in, priority_fee, bribery_amount, speed, address, symbol, rate }) => ({
    mint: address,
    exact_amount_in: +exact_amount_in,
    min_amount_out: 0,
    priority_fee: +priority_fee,
    bribery_amount: +bribery_amount,
    speed,
    rate,
    symbol,
  }),
  target: sellTokenMutation.start,
});
