import { invoke } from '@withease/factories';
import { checkboxFactory } from 'shared/lib/checkbox';
import { persist } from 'effector-storage/local';

export const { $isChecked: $isAnimationsEnabled, toggled } = invoke(checkboxFactory, {});

persist({
  store: $isAnimationsEnabled,
  key: 'isAnimationsEnabled',
});
