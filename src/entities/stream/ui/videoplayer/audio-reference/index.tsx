import { StartAudio } from '@dtelecom/components-react';

import { AudioTrack } from '@dtelecom/components-react';
import { Participant, Track, TrackPublication } from '@dtelecom/livekit-client';
import { useUnit } from 'effector-react';
import { $volume } from '../../../model';

export type AudioReferenceProps = {
  participant: Participant;
  source: Track.Source;
  publication: TrackPublication;
};

export const AudioReference = ({ participant, source, publication }: AudioReferenceProps) => {
  const volume = useUnit($volume);
  return (
    <div className="absolute top-0 h-full w-full">
      <AudioTrack participant={participant} source={source} publication={publication} volume={volume} />
      <StartAudio label="Click to allow audio playback" className="!text-primary absolute top-0 h-full w-full" />
    </div>
  );
};
