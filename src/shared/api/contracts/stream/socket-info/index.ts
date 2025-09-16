import { contracts } from 'shared/client';
import { array, object, string, number, boolean } from 'zod';

export const socketInfo = object({
  name: string(),
  slug: string(),
  creator: contracts.UserResponseShort,
  created_at: number(),
  donation_sum: number(),
  viewers: number(),
  preview_photo: string(),
  is_nsfw: boolean(),
  stream_tokens: array(contracts.SPLTokenResponse),
  tasks: array(contracts.StreamTask),
});
