import { invoke } from '@withease/factories';
import { copyFactory } from 'shared/lib/copy';

export const { copied } = invoke(copyFactory, 'Refer link copied to clipboard');
