import { Link } from 'atomic-router-react';
import { clsx } from 'clsx';
import { ElementType, useMemo } from 'react';
import { Icon } from 'shared/ui/icon';
import { ButtonProps, IconPosition } from './index.type';
import s from './style.module.css';

export const themeStyles = {
  primary:
    'border border-sm border-transparent bg-yellow border-lightYellow text-darkYellow hover:bg-[#FCC741] shadow-[0px_0px_28px_0px_rgba(251,191,36,0.16)] ',
  secondary: 'border-sm text-primary bg-darkGray-1 hover:bg-darkGray-3',
  outline: 'border border-sm text-primary bg-darkGray-1 border-separator hover:bg-darkGray-3',
  tertiary: 'text-primary hover:border-darkGray-3',
  quaternary: 'text-primary bg-darkGray-2 hover:bg-[#373F53] disabled:text-secondary disabled:opacity-40',
  white: 'bg-primary text-darkGray-1 hover:border-secondary',
  darkGray: 'border-sm text-primary bg-darkGray-3 hover:bg-darkGray-2 disabled:text-secondary disabled:opacity-40',
  green:
    'text-[15px] bg-btn-darkGreen border-green border-[0.5px] font-medium text-primary rounded-lg w-full py-3 px-4 hover:bg-btn-darkGreen-hover',
  red: 'text-[15px] bg-darkRed border-red border-[0.5px] font-medium text-primary rounded-lg w-full py-3 px-4 hover:bg-btn-darkRed-hover',
};

export const Button = <E extends ElementType = 'button'>({
  className,
  children,
  theme = 'primary',
  icon,
  as,
  isLoading = false,
  isActive = false,
  disabled,
  isLoaderIcon,
  ...props
}: ButtonProps<E>) => {
  const Component = as || 'button';

  const renderIcon = useMemo(
    () => (position: IconPosition) =>
      icon?.position === position && <Icon name={icon.name} className={className?.icon} size={icon.size} />,
    [icon, className?.icon],
  );

  return (
    <Component
      target={as === Link && typeof props.to === 'string' ? '_blank' : undefined}
      className={clsx(
        'opacity- inline-flex items-center justify-center gap-1 rounded-lg px-4 py-[7px] text-sm font-medium transition-all',
        themeStyles[theme],
        disabled && 'pointer-events-none cursor-not-allowed',
        className?.button,
      )}
      aria-expanded={isActive}
      disabled={disabled}
      {...props}
    >
      {renderIcon('left')}
      {isLoaderIcon &&
        <div className={s.loader} />
      }
      {children && children}
      {renderIcon('center')}
      {renderIcon('right')}
    </Component>
  );
};
