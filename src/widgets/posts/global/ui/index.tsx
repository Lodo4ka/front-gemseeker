import { $globalPostsIds } from 'entities/post';
import { Posts } from '../../ui';
import { $isEndReached, dataRanedOut, onLoadedFirst } from '../model';

export const GlobalPosts = () => {
  return (
    <Posts
      $postsIds={$globalPostsIds}
      skeletonCount={10}
      $isEndReached={$isEndReached}
      reachedEndOfList={dataRanedOut}
      onLoaded={onLoadedFirst}
      className={{ list: 'max-2lg:pr-0 h-full', post: '!bg-darkGray-1' }}
    />
  );
};
