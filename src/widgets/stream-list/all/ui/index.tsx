import { $allStreamsIds } from 'entities/stream';
import { StreamList } from '../../ui';
import { $isEndReached, dataRanedOut, onLoadedFirst } from '../model';

export const AllStreams = () => (
  <StreamList
    $streamIds={$allStreamsIds}
    $isEndReached={$isEndReached}
    reachedEndOfList={dataRanedOut}
    onLoaded={onLoadedFirst}
  />
);
