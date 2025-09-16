import { $streamWithTokensIds } from 'entities/stream';
import { StreamList } from '../../ui';
import { $isEndReached, dataRanedOut, onLoadedFirst } from '../model';

export const WithTokenStreams = () => (
  <StreamList
    $streamIds={$streamWithTokensIds}
    $isEndReached={$isEndReached}
    reachedEndOfList={dataRanedOut}
    onLoaded={onLoadedFirst}
  />
);
