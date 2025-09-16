import { contracts } from 'shared/client';
import { object, string, number, boolean } from 'zod';

export const profile = contracts.UserProfileResponse

// object({
//   user_id: number(),
//   user_nickname: string(),
//   user_photo_hash: string().nullable(),
//   bio: string(),
//   volume: number(),
//   likes_received: number(),
//   mentions_received: number(),
//   tokens_created: number(),
//   followers: number(),
//   subscribed: boolean(),
//   followees: number(),
// });

export const user_mini = object({
  user_id: number(),
  user_nickname: string(),
  user_photo_hash: string().nullable(),
  user_followers: number(),
});

export const followee_mini = object({
  user_id: number(),
  user_nickname: string(),
  user_photo_hash: string().nullable(),
  user_subscribers: number(),
});
