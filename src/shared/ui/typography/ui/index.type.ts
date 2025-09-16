import { ComponentProps, ElementType, ReactNode } from 'react';
import { IconName } from 'shared/ui/icon';
import { SharedSkeleton } from 'shared/ui/skeleton';

export const weights = {
  bold: 'font-bold',
  regular: 'font-regular',
  semibold: 'font-semibold',
  medium: 'font-medium',
};

export const colors = {
  primary: 'text-primary',
  secondary: 'text-secondary',
  red: 'text-red',
  yellow: 'text-yellow',
  green: 'text-green',
  blue: 'text-blue',
  nsfw: 'text-nsfw'
};
export const sizes = {
  headline1: 'text-[33px]',
  headline2: 'text-[21px]',
  headline3: 'text-[18px]',
  headline4: 'text-[16px]',
  subheadline1: 'text-[15px]',
  subheadline2: 'text-[14px]',
  captain1: 'text-[12px]',
  captain2: 'text-[10px]',
};
export type TypographyWeight = keyof typeof weights;
export type TypographyColor = keyof typeof colors;
export type TypographySize = keyof typeof sizes;

export interface TypographyIconProps {
  position: 'left' | 'right' | 'both';
  name: IconName;
  onClick?: () => void;
  className?: string;
  size?: number;
};
export interface TypographyOwnProps<E extends ElementType = ElementType> {
  className?: string;
  weight?: TypographyWeight;
  size?: TypographySize;
  color?: TypographyColor;
  children?: ReactNode | string;
  as?: E;
  skeleton?: SharedSkeleton;
  icon?: TypographyIconProps
}

export type TypographyProps<E extends ElementType = ElementType> = TypographyOwnProps<E> &
  Omit<ComponentProps<E>, keyof TypographyOwnProps>;
