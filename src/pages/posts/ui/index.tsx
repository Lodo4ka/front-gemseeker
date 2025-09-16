import { useUnit } from 'effector-react';
import { PostCreate, PostCreateBox, PostCreateBoxFallback } from 'features/post';
import { Skeleton } from 'shared/ui/skeleton';
import { Tabs } from 'shared/ui/tabs';
import { Typography } from 'shared/ui/typography';
import { GlobalPosts, FriendsPosts } from 'widgets/posts';
import { $activeTab, changedActiveTab } from '../model';

export const PostsPage = () => {
  const [activeTab, changeActiveTab] = useUnit([$activeTab, changedActiveTab]);

  return (
    <div className="mx-auto my-0 flex w-full max-w-[1420px] flex-col gap-4">
      <Typography size="headline4" icon={{ position: 'left', name: 'posts', size: 20 }} className="!gap-2">
        Gem post
      </Typography>
      <div className="flex w-full gap-[10px]">
        <Tabs
          activeTab={activeTab}
          onTabChange={changeActiveTab}
          between={<PostCreate theme="quaternary" className={{ button: '2lg:hidden', icon: 'text-primary' }} />}
          controllers={[
            {
              children: 'Global',
              name: 'global'
            },
            {
              children: 'Friends',
              name: 'friends'
            },
          ]}
          queryParamName='filter'
          contents={[<GlobalPosts />, <FriendsPosts />]}
        />
        <PostCreateBox className="max-2lg:hidden mt-13 max-w-[548px]" />
      </div>
    </div>
  );
};

export const PostsPageFallback = () => {
  return (
    <div className="mx-auto my-0 flex w-full max-w-[1420px] flex-col gap-4">
      <div className="flex items-center gap-2">
        <Skeleton isLoading className="h-5 w-5 rounded-sm" />
        <Skeleton isLoading className="h-[26px] w-[60px] rounded-sm" />
      </div>
      <div className="flex w-full gap-[10px]">
        <div className="flex w-full flex-col gap-4">
          <div className="border-separator flex w-[160px] overflow-x-scroll rounded-lg border-[0.5px] whitespace-nowrap [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {[1, 2].map((key) => (
              <div
                key={key}
                className="border-r-separator flex items-center gap-2 border-r-[0.5px] px-3 py-2 last:border-r-0">
                <Skeleton isLoading className="h-5 w-13" />
              </div>
            ))}
          </div>
          <Skeleton isLoading className="2lg:hidden h-9 w-full rounded-lg" />
          <GlobalPosts />
        </div>
        <PostCreateBoxFallback className="2lg:flex mt-13 hidden max-w-[548px]" />
      </div>
    </div>
  );
};
