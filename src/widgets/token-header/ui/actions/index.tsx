
import { clsx } from 'clsx';
import { Skeleton } from 'shared/ui/skeleton';
import { ActionFavouriteToken } from 'features/action-favourite-token';
import { ShareToken } from 'features/share-token';
import { PreviewButton } from './preview';
import { SearchInX } from './search-in-x';

export type ActionsProps = {
  className?: {
    container?: string;
    button?: {
      button?: string;
      icon?: string;
      span?: string;
    };
  };
};

export const Actions = ({ className }: ActionsProps) => (
  <div className={clsx('flex items-center gap-2', className?.container)}>
    <SearchInX 
      button={className?.button?.button}
      icon={className?.button?.icon}
      span={className?.button?.span}
    />

    <PreviewButton 
      button={className?.button?.button}
      icon={className?.button?.icon}
      span={className?.button?.span}
    />
    
    <ShareToken 
      button={className?.button?.button}
      icon={className?.button?.icon}
      span={className?.button?.span}
    />

    <ActionFavouriteToken 
      button={className?.button?.button}
      icon={className?.button?.icon}
      span={className?.button?.span}
    />
  </div>
)

export type ActionsSkeletonProps = {
  className?: {
    container?: string;
    button?: string;
  };
};

export const ActionsSkeleton = ({ className }: ActionsSkeletonProps = {}) => (
  <div className={clsx('flex items-center gap-2', className?.container)}>
    <Skeleton isLoading className={clsx('h-8 w-16 rounded', className?.button)} />
    <Skeleton isLoading className={clsx('h-8 w-16 rounded', className?.button)} />
    <Skeleton isLoading className={clsx('h-8 w-16 rounded', className?.button)} />
  </div>
);
