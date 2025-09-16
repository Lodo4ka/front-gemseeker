import { LocalParticipant, Participant } from '@dtelecom/livekit-client';
import { ReactNode, useState } from 'react';
import { useUnit } from 'effector-react';
import { Skeleton } from 'shared/ui/skeleton';
import { getFullUrlImg } from 'shared/lib/full-url-img';
import clsx from 'clsx';
import type { StreamInfo } from '../../../types';
import { StoreWritable } from 'effector';

export type PlaceholderProps = {
  participant: Participant | LocalParticipant;
  children?: ReactNode;
  className?: string;
};
export const Placeholder = ({ participant, children, className }: PlaceholderProps) => {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className="flex aspect-video h-full w-full items-center justify-center">
      {!participant.isCameraEnabled && !participant.isScreenShareEnabled && (
        <div className={clsx('bg-darkGray-2 flex h-full w-full items-center justify-center rounded-xl', className)}>
          {!loaded && <Skeleton className="!bg-darkGray-3 h-30 w-30 rounded-full" isLoading />}
          <img
            onLoad={() => setLoaded(true)}
            src={getFullUrlImg(participant.metadata ?? '', participant.name ?? '')}
            className="h-30 w-30 rounded-full"
            style={{ display: loaded ? 'block' : 'none' }}
            alt="preview"
          />
        </div>
      )}
      {(participant.isCameraEnabled || participant.isScreenShareEnabled) && children}
    </div>
  );
};

type PlaceholderСreatorProps = {
  className?: string;
  $streamInfo: StoreWritable<StreamInfo | null>;
};

export const PlaceholderСreator = ({ className, $streamInfo }: PlaceholderСreatorProps) => {
  const streamInfo = useUnit($streamInfo);
  const [loaded, setLoaded] = useState(false);

  if (!streamInfo) return <PlaceholderSkeleton className={className} />;
  return (
    <div className={clsx('flex aspect-video h-full w-full items-center justify-center', className)}>
      <div className={clsx('bg-darkGray-2 flex h-full w-full items-center justify-center rounded-xl', className)}>
        {!loaded && <Skeleton className="!bg-darkGray-3 h-30 w-30 rounded-full" isLoading />}
        <img
          src={getFullUrlImg(streamInfo.creator.user_photo_hash, streamInfo.creator.user_nickname)}
          className="h-30 w-30 rounded-full"
          alt="preview"
          style={{ display: loaded ? 'block' : 'none' }}
          onLoad={() => setLoaded(true)}
        />
      </div>
    </div>
  );
};

export const PlaceholderSkeleton = ({ className }: { className?: string }) => (
  <div className={clsx('flex aspect-video h-full w-full items-center justify-center rounded-xl', className)}>
    <div className={clsx('bg-darkGray-2 flex h-full w-full items-center justify-center', className)}>
      <Skeleton className="h-30 w-30 rounded-full" isLoading />
    </div>
  </div>
);
