import { literal, object } from 'zod';
import { socketInfo } from '../socket-info';

export const created = object({
  type: literal('STREAM_CREATED'),
  info: socketInfo,
});
