import { contracts } from 'shared/client';

export const single = contracts.TradeHistoryResponse

// object({
//   timestamp: number(),
//   type: z.enum(['SELL', 'BUY']),
//   maker: string(),
//   token_photo_hash: string(),
//   token_name: string(),
//   price: number(),
//   amount: number(),
//   total: number(),
// });
