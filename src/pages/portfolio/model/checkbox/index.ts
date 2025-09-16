import { invoke } from '@withease/factories';
import { checkboxFactory } from 'shared/lib/checkbox';

export const { $isChecked, toggled } = invoke(() => checkboxFactory({ defaultState: false }));
