import { ElementType, ReactNode } from 'react';

export type InputAddon = {
  icon?: string;
  text?: string;
  size?: number;
  className?: string;
  onClick?: () => void;
};

export type InputClassNames = {
  container?: string;
  flex?: string;
  input?: string;
  label?: string;
};

// Базовый тип для onValue
export type BaseOnValue = (value: string) => void;

// Расширенный тип для onValue с дополнительными параметрами
export type ExtendedOnValue = (value: string, additionalData?: any) => void;

export type InputProps<E extends ElementType = 'input'> = {
  as?: E;
  classNames?: InputClassNames;
  theme?: 'primary' | 'secondary' | 'tertiary' | 'clear';
  leftAddon?: InputAddon;
  rightAddon?: InputAddon;
  error?: string;
  disabled?: boolean;
  onChange?: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onValue?: BaseOnValue | ExtendedOnValue;
  onFocus?: (event: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  label?: ReactNode;
  placeholder?: string;
  type?: string;
  value?: string | number;
  min?: number;
  max?: number;
  step?: number;
  required?: boolean;
  readOnly?: boolean;
  autoComplete?: string;
  autoFocus?: boolean;
  name?: string;
  id?: string;
  tabIndex?: number;
  'aria-label'?: string;
  'aria-describedby'?: string;
} & Omit<React.ComponentPropsWithoutRef<E>, 'onChange' | 'onValue' | 'onFocus'>;
