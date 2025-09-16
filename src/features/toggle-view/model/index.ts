import { checkboxFactory } from 'shared/lib/checkbox';

import { invoke } from '@withease/factories';
import { persist } from 'effector-storage/local';

export const { $isChecked, toggled, toggledChecked, toggledUnchecked } = invoke(checkboxFactory, {});

persist({
  store: $isChecked,
  key: 'isViewTable',
});
