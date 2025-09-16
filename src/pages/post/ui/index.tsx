import { Post, PostSkeleton } from 'entities/post';
import { useUnit } from 'effector-react';
import { $post } from '../model';
import { BackLayout } from 'layouts/back-layout';

export const PostPage = () => {
  const post = useUnit($post);

  if (!post) return <PostSkeleton />;
  return (
    <BackLayout>
      <div className="pt-[54px]">
        <Post className={{ wrapper: '!bg-darkGray-1' }} showUser post={post} />
      </div>
    </BackLayout>
  );
};

export const PostPageFallback = () => {
  return <PostSkeleton />;
};
