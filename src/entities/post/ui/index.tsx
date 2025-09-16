import clsx from 'clsx';
import { api } from 'shared/api';
import { Icon } from 'shared/ui/icon';
import { Typography } from 'shared/ui/typography';
import { infer as types } from 'zod';
import { Timestamp } from './timestamp';
import { pinataUrl } from 'shared/lib/base-url';
import { Skeleton } from 'shared/ui/skeleton';
import { useUnit } from 'effector-react';
import { routes } from 'shared/config/router';
import { ImageWrapper } from 'shared/ui/image';
import { getFullUrlImg } from 'shared/lib/full-url-img';
import { $publicKey } from 'entities/wallet';
import { ConnectWalletModalProps } from 'features/connect-wallet';
import { modalsStore } from 'shared/lib/modal';
import { $viewer } from 'shared/viewer';
import { formatter } from 'shared/lib/formatter';
import { LoadedData } from 'shared/ui/loaded-data';
import { postViewed } from '../model';
import { Link } from 'atomic-router-react';
import { CrosspostShare } from './crosspost-share';
import { Edit } from './edit';
import { getImageModal } from './images';

import { Album } from 'shared/ui/album/ui';

type PostProps = {
  post: types<typeof api.contracts.post.default>;
  showUser?: boolean;
  className?: {
    wrapper?: string;
  };
};

export const Post = ({ post, className, showUser = true }: PostProps) => {
  const [publicKey, viewer] = useUnit([$publicKey, $viewer]);
  const [like, unlike, navigate, openModal] = useUnit([
    api.mutations.post.like.start,
    api.mutations.post.unlike.start,
    routes.profile.open,
    modalsStore.openModal,
  ]);

  const toggleLike = () => {
    if (!publicKey) return openModal(ConnectWalletModalProps);
    if (post.liked) unlike(post.id);
    else like(post.id);
  };
  return (
    <div
      className={clsx(
        'bg-darkGray-3 max-2lg:bg-darkGray-1 w-full cursor-pointer rounded-xl px-4 py-3',
        className?.wrapper,
      )}>
      <Link to={routes.post} params={{ id: String(post.id) }} className="absolute inset-0 z-0 h-full w-full" />
      <LoadedData params={{ id: post.id }} isOnce isFullSize className="z-[-1]" loadedData={postViewed} />
      <div className={clsx('flex items-center justify-between', { 'justify-end': !showUser })}>
        {showUser && (
          <div
            onClick={() => navigate({ id: String(post.user.user_id) })}
            className="z-1 mb-2 flex w-fit cursor-pointer items-center gap-2">
            <ImageWrapper
              src={getFullUrlImg(post.user.user_photo_hash, post.user.user_nickname)}
              alt="user"
              classNames={{ both: 'h-[30px] w-[30px] rounded-full' }}
              isHoverImg
            />
            <Typography size="subheadline1">{post.user.user_nickname}</Typography>
          </div>
        )}
        <Typography
          size="captain1"
          icon={{ name: 'eye', size: 14, position: 'right' }}
          className="!gap-1"
          color="secondary">
          {formatter.number.uiDefault(post.views)}
        </Typography>
      </div>
      <Typography size="subheadline1" className="uppercase">
        {post?.title}
      </Typography>

      {post?.attachments && post.attachments.length > 0 && (
        <Album
          images={post.attachments
            .filter((attachment): attachment is string => Boolean(attachment))
            .map((attachment) => {
              const url = pinataUrl(attachment);
              return url
                ? {
                    src: url,
                    width: 1,
                    height: 1,
                    alt: 'post image',
                  }
                : null;
            })
            .filter((item): item is NonNullable<typeof item> => item !== null)}
          maxHeight={450}
          borderRadius={12}
          maxImages={6}
        />
      )}
      <Typography size="captain1" className="break-all">
        {post?.text}
      </Typography>

      <div className="flex w-full items-center justify-between">
        <div className="flex items-center gap-[6px]">
          <div onClick={toggleLike} className="z-1 flex cursor-pointer items-center gap-1">
            <Icon
              name="like"
              className={clsx('text-secondary [&_.fill-path]:fill-[#FF3B81] [&_.fill-path]:opacity-0', {
                '!text-[#FF3B81] [&_.fill-path]:opacity-100': post.liked,
              })}
              size={14}
            />
            <Typography size="captain1" color="secondary">
              {post?.likes}
            </Typography>
          </div>
          <div className="flex cursor-pointer items-center gap-1">
            <Icon name="attach_comment" size={15} />
            <Typography size="captain1" color="secondary">
              {post.replies}
            </Typography>
          </div>
          <div className="flex cursor-pointer items-center gap-1">
            <Icon name="repost" className="text-secondary" size={10} />
            <Typography size="captain1" color="secondary">
              0
            </Typography>
          </div>
          <CrosspostShare />
          <Edit className={{ trigger: clsx({ hidden: post.user.user_id !== viewer?.user_id }) }} />
        </div>
        <Timestamp timestamp={post?.timestamp} />
      </div>
    </div>
  );
};

export const PostSkeleton = ({ className }: { className?: { wrapper?: string } }) => {
  return (
    <div className={clsx('bg-darkGray-3 max-2lg:bg-darkGray-1 w-full rounded-xl px-4 py-3', className?.wrapper)}>
      <Skeleton className="mb-2 h-[320px] w-full rounded-lg" isLoading />
      <Skeleton className="mb-3 h-4 w-1/2 rounded" isLoading />
      <div className="flex w-full items-center justify-between">
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-15 rounded" isLoading />
          <Skeleton className="h-4 w-15 rounded" isLoading />
        </div>
        <Skeleton className="h-4 w-25 rounded" isLoading />
      </div>
    </div>
  );
};
