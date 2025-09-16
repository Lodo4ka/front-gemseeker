import { ReactNode } from 'react';

export interface SkeletonProps {
  children?: ReactNode;
  isLoading: boolean;
  className: string;
}

export type SharedSkeleton = Omit<SkeletonProps, 'children'>;
