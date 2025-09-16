import { number, object, string, literal } from 'zod';

export const rate = object({
  So11111111111111111111111111111111111111112: object({
    usdPrice: number(),
    blockId: number(),
    decimals: number(),
    priceChange24h: number()
    // id: literal('So11111111111111111111111111111111111111112'),
    // type: literal('derivedPrice'),
    // price: string(),
  }),
});
