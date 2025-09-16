import { useStoreMap } from 'effector-react';

import { $allStreams } from '../../model/list';
import { LivestreamToken } from 'entities/token';
import { NoTokenCard } from '../no-token-card';
import { memo } from 'react';

export type StreamCardProps = {
  slug: string;
};

export const StreamCard = memo(({ slug }: StreamCardProps) => {
  const currentStream = useStoreMap($allStreams, (state) => state[slug] ?? null);

  if (!currentStream) return null;

  if (currentStream.stream_tokens.length > 0) return <LivestreamToken stream={currentStream} />;

  return <NoTokenCard stream={currentStream} />;
});
