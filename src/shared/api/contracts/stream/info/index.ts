import { contracts } from 'shared/client';
// import { object, number, string, array, boolean } from 'zod';

export const streamToken = contracts.SPLTokenWithStreamResponse
// object({
//   id: number(),
//   created_by: object({
//     user_id: number(),
//     user_nickname: string(),
//     user_photo_hash: string().nullable(),
//   }),
//   creator_wallets: array(string()),
//   name: string(),
//   symbol: string(),
//   description: string(),
//   photo_hash: string(),
//   twitter: string().nullable(),
//   telegram: string().nullable(),
//   youtube: string().nullable(),
//   website: string().nullable(),
//   address: string(),
//   trade_started: boolean(),
//   trade_finished: boolean(),
//   last_tx_timestamp: number(),
//   holders: number(),
//   messages: number(),
//   alltime_buy_txes: number(),
//   alltime_sell_txes: number(),
//   volume_24h: number(),
//   mcap: number(),
//   rate: number(),
//   creation_date: number(),
//   is_nsfw: boolean(),
//   mcap_diff_24h: number(),
//   is_streaming: boolean(),
//   bounding_curve: number(),
// });

export const info = contracts.RoomResponseWSum

// object({
//   slug: string(),
//   name: string(),
//   creator: object({
//     user_id: number(),
//     user_nickname: string(),
//     user_photo_hash: string().nullable(),
//   }),
//   created_at: number(),
//   viewers: number(),
//   preview_photo: string(),
//   stream_tokens: array(streamToken),
//   donation_sum: number(),
// });
