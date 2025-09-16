import { $userPostsIds } from 'entities/post';
import { Posts } from '../../ui';
import { $isEndReached, dataRanedOut } from '../model';

export const UserPosts = () => {
  return (
    <Posts
      $postsIds={$userPostsIds}
      skeletonCount={4}
      $isEndReached={$isEndReached}
      showUser={false}
      reachedEndOfList={dataRanedOut}
      className={{
        list: 'flex h-[430px] flex-col overflow-y-auto rounded-2xl !pr-4 [mask-image:linear-gradient(to_bottom,black,black)]',
      }}
    />
  );
};
