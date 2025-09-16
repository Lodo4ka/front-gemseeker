import { ComponentProps, ElementType, ReactNode } from 'react';
import { IconName } from 'shared/ui/icon';
import { themeStyles } from '.';

export type IconPosition = 'left' | 'right' | 'center';
export type ButtonTheme = keyof typeof themeStyles;
type ButtonOwnProps<E extends ElementType = 'button'> = {
  className?: {
    button?: string;
    icon?: string;
  };
  theme?: ButtonTheme;
  icon?: {
    position: IconPosition;
    name: IconName;
    size?: number;
  };
  as?: E;
  children?: ReactNode;
  isActive?: boolean;
  disabled?: boolean;
  isLoaderIcon?: boolean;
};

export type ButtonProps<E extends ElementType> = ButtonOwnProps<E> & Omit<ComponentProps<E>, keyof ButtonOwnProps>;
