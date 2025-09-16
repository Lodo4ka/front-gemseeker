import { object, literal } from 'zod';
import { socketInfo } from '../socket-info';

export const viewer = object({
  type: literal('VIEWER_CHANGE'),
  info: socketInfo,
});
