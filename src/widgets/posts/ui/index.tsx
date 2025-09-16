import { $posts, Post, PostsIdsStore, PostSkeleton } from 'entities/post';
import { useUnit } from 'effector-react';
import { ListWithPagination } from 'shared/ui/list-with-pagination';
import { EventCallable, StoreWritable } from 'effector';
import { Icon } from 'shared/ui/icon';
import { Typography } from 'shared/ui/typography';
import clsx from 'clsx';

type PostProps = {
  $postsIds: PostsIdsStore;
  $isEndReached: StoreWritable<boolean>;
  reachedEndOfList: EventCallable<void>;
  onLoaded?: EventCallable<void>;
  skeletonCount?: number;
  showUser?: boolean;
  className?: {
    list?: string;
    post?: string;
  };
};

export const Posts = ({
  $postsIds,
  $isEndReached,
  reachedEndOfList,
  onLoaded,
  skeletonCount = 3,
  showUser = true,
  className,
}: PostProps) => {
  const [posts, postsIds] = useUnit([$posts, $postsIds]);
  return (
    <ListWithPagination
      list={postsIds}
      isOnce={true}
      noData={
        <div className="flex h-[400px] w-full flex-col items-center justify-center gap-4">
          <Icon name="chat" className="text-primary" size={55} />
          <Typography size="subheadline2" className="text-center" weight="regular" color="secondary">
            There are currently <br /> no posts yet.
          </Typography>
        </div>
      }
      className={{
        list: clsx('gap-3 pr-4', className?.list),
      }}
      $isDataRanedOut={$isEndReached}
      reachedEndOfList={reachedEndOfList}
      onLoaded={onLoaded}
      renderItem={(postId, index) => {
        const post = posts[postId];
        if (!post) return null;
        return (
          <Post
            className={{ wrapper: clsx({ 'mt-3': index !== 0 }, className?.post) }}
            key={post.id}
            post={post}
            showUser={showUser}
          />
        );
      }}
      skeleton={{
        Element: <PostSkeleton className={{ wrapper: clsx('mt-3', className?.post) }} />,
        count: skeletonCount,
      }}
    />
  );
};
