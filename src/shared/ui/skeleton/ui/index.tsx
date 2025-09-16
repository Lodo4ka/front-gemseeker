import { memo } from 'react';

import { SkeletonProps } from './index.type';
import clsx from 'clsx';

const SkeletonWrapper = ({ children, isLoading, className }: SkeletonProps) => {
  if (isLoading) {
    return (
      <div className={clsx('bg-skeleton dark:bg-skeleton animate-pulse shadow-sm', className)}>
        <div />
      </div>
    );
  }

  return <>{children}</>;
};

export const Skeleton = memo(SkeletonWrapper);
