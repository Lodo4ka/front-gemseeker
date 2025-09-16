import { IconName } from 'shared/ui/icon';
import { ComponentProps, ElementType, JSX } from 'react';
import { themeStyles } from './index';

interface IconAddon {
  icon: IconName;
  size?: number;
  className?: string;
  onClick?: () => void;
}

interface TextAddon {
  text: string | JSX.Element;
  className?: string;
}

export type InputAddon = IconAddon | TextAddon;

export interface InputBaseProps<E extends ElementType = 'input'> {
  as?: E;
  theme?: keyof typeof themeStyles;
  leftAddon?: InputAddon;
  rightAddon?: InputAddon;
  error?: string | null;
  label?: string;
  onValue?: (value: string) => void;
  onFocus?: () => void;
  classNames?: {
    flex?: string;
    container?: string;
    label?: string;
    input?: string;
  };
}

export type InputProps<E extends ElementType = 'input'> = InputBaseProps<E> &
  Omit<ComponentProps<E>, keyof InputBaseProps>;
