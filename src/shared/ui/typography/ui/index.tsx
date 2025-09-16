import { clsx } from 'clsx';
import { FC } from 'react';
import { Icon } from 'shared/ui/icon';

import { colors, sizes, TypographyProps, weights } from './index.type';
import { Skeleton } from 'shared/ui/skeleton';

export const Typography: FC<TypographyProps> = ({
  className = '',
  size = 'subheadline2',
  color = 'primary',
  icon,
  as,
  skeleton,
  children,
  weight = 'medium',
  ...otherProps
}) => {
  const Component = as || 'div';

  if (skeleton?.isLoading) return <Skeleton isLoading={skeleton.isLoading} className={skeleton.className} />;

  return (
    <Component
      className={clsx('flex items-center gap-[2px]', sizes[size], colors[color], weights[weight], className)}
      {...otherProps}>
      {(icon?.position === 'left' || icon?.position === 'both') && (
        <Icon name={icon.name} onClick={icon.onClick} size={icon.size} className={icon.className} />
      )}
      {children}
      {(icon?.position === 'right' || icon?.position === 'both') && (
        <Icon name={icon.name} onClick={icon.onClick} size={icon.size} className={icon.className} />
      )}
    </Component>
  );
};
