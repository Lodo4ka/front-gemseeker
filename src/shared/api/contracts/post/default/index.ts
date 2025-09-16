import { contracts } from 'shared/client';

export const single = contracts.PostResponse

// object({
//   id: number(),
//   user: object({
//     user_id: number(),
//     user_nickname: string(),
//     user_photo_hash: string(),
//   }),
//   text: string(),
//   attachments: array(string()),
//   timestamp: number(),
//   likes: number(),
//   liked: boolean(),
// });
