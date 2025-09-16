import { Participant } from '@dtelecom/livekit-client';
import { useUnit } from 'effector-react';
import { Typography } from 'shared/ui/typography';
import { Skeleton } from 'shared/ui/skeleton';
import { StoreWritable } from 'effector';
import type { StreamInfo } from '../../../types';

export type ControlsProps = {
  participant: Participant;
};
export const Controls = ({ participant }: ControlsProps) => {
  return (
    <div className="absolute bottom-[12px] w-full">
      <div className="flex items-center justify-between px-3">
        <Typography
          icon={{
            position: 'left',
            name: participant.isMicrophoneEnabled ? 'microphone' : 'microphone_off',
            size: 24,
          }}
          className="bg-darkGray-3/30 rounded-lg p-[3px]"
          size="headline4"
          weight="bold">
          {participant.name}
        </Typography>
      </div>
    </div>
  );
};

type ControlsCreatorProps = {
  $streamInfo: StoreWritable<StreamInfo | null>;
};

export const ControlsCreator = ({ $streamInfo }: ControlsCreatorProps) => {
  const streamInfo = useUnit($streamInfo);

  if (!streamInfo) return <ControlsCreatorSkeleton />;
  return (
    <div className="absolute bottom-3 w-full">
      <div className="flex items-center justify-between px-3">
        <Typography
          icon={{
            position: 'left',
            name: 'microphone_off',
            size: 24,
          }}
          size="headline4"
          className="bg-darkGray-3/30 rounded-lg p-[3px]"
          weight="bold">
          {streamInfo.creator.user_nickname}
        </Typography>
      </div>
    </div>
  );
};

const ControlsCreatorSkeleton = () => {
  return (
    <div className="absolute bottom-[12px] w-full">
      <div className="flex items-center justify-between px-3">
        <Skeleton className="h-5 w-15 rounded-sm" isLoading />
      </div>
    </div>
  );
};
