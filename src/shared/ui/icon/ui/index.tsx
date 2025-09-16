import { HTMLAttributes, Suspense, useMemo } from 'react';

import { icons } from './icons';
import clsx from 'clsx';
import { SharedSkeleton, Skeleton } from 'shared/ui/skeleton';

export type IconName = keyof typeof icons;

interface Props extends HTMLAttributes<HTMLDivElement> {
  name: IconName;
  className?: string;
  rotate?: number;
  skeleton?: SharedSkeleton;
  size?: number;
}

export const Icon = ({ name, className, skeleton, size = 16, ...rest }: Props) => {
  const SvgIcon = useMemo(() => icons[name], [name]);

  if (!SvgIcon) return null;

  if (skeleton?.isLoading) return <Skeleton isLoading={skeleton.isLoading} className={skeleton.className} />;

  return (
    <div
      className={clsx(className, `flex items-center justify-center`)}
      style={{ width: size }}
      aria-label={String(name)}
      role="img"
      {...rest}>
      <Suspense fallback={<Skeleton isLoading className="h-full w-full rounded-md" />}>
        <SvgIcon style={{ width: '100%', height: '100%' }} />
      </Suspense>
    </div>
  );
};
