import { invoke } from '@withease/factories';
import { listFactory } from '../list';

export const recent = invoke(listFactory, {
  show_events: ['BUY', 'SELL'],
});
