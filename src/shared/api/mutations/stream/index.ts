import { create } from './create';
import { join } from './join';
import { deleteStream } from './delete';
import { donate } from './donate';
export const stream = {
  create,
  join,
  delete: deleteStream,
  donate,
};
