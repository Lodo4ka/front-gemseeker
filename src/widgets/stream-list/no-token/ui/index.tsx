import { $streamNoTokensIds } from 'entities/stream';
import { StreamList } from '../../ui';
import { $isEndReached, dataRanedOut, onLoadedFirst } from '../model';

export const NoTokenStreams = () => (
  <StreamList
    $streamIds={$streamNoTokensIds}
    $isEndReached={$isEndReached}
    reachedEndOfList={dataRanedOut}
    onLoaded={onLoadedFirst}
  />
);
