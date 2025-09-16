import { literal, object } from 'zod';
import { socketInfo } from '../socket-info';

export const finished = object({
  type: literal('STREAM_FINISHED'),
  info: socketInfo,
});
