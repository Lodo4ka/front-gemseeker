import { invoke } from '@withease/factories';
import { listFactory } from '../list';

export const activity = invoke(listFactory, {
  show_events: ['MIGRATION', 'DEPLOY', 'STREAM_CREATED', 'STREAM_FINISHED', 'DONATION_RECEIVED'],
});
