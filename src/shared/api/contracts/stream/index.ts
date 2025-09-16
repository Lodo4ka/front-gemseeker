import { create } from './create';
import { list } from './list';
import { wsUrl } from './ws-url';
import { join } from './join';
import { info } from './info';
import { task } from './task';
import { donate } from './donate';
import { viewer } from './viewer';
import { donation } from './donation';
import { finished } from './finished';
import { created } from './created';

export const stream = {
  list,
  donate,
  create,
  join,
  task,
  info,
  viewer,
  donation,
  finished,
  created,
  wsUrl,
};
