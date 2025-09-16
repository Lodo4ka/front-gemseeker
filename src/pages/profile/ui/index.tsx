import { EditProfile, EditProfileSkeleton } from 'features/edit-profile';
import { PostCreate } from 'features/post';
import { BackLayout } from 'layouts/back-layout';
import { Tabs } from 'shared/ui/tabs';
import { useUnit } from 'effector-react';
import { $activeTab, $isOwnProfile, tabChanged } from '../model';
import clsx from 'clsx';
import { Skeleton } from 'shared/ui/skeleton';
import { UserPosts } from 'widgets/posts';
import { Followers } from './followers';
import { Followees } from './followees';
import { Transactions } from './transactions';
import { TokensCreated } from './tokens-created';
import { Stats, StatsSkeleton } from './stats';
import { TradingActivity } from './trading-activity';

const InfoTabs = () => {
  const [activeTab, onTabChange] = useUnit([$activeTab, tabChanged]);
  return (
    <Tabs
      className={{
        controllers: {
          controller: {
            default: 'hover:bg-darkGray-1 md:hover:bg-darkGray-3',
            active: 'md:!bg-darkGray-3',
          },
        },
      }}
      activeTab={activeTab}
      onTabChange={onTabChange}
      contents={[<UserPosts />, <Followers />, <Followees />, <Transactions />, <TokensCreated />, <TradingActivity />]}
      controllers={[
        {
          children: 'Posts',
          name:"posts"
        },
        {
          children: 'Followers',
          name:"followers"
        },
        {
          children: 'Following',
          name:"following"
        },
        {
          children: 'Transactions',
          name:"transactions"
        },
        {
          children: 'Tokens created',
          name:"tokens_created"
        },
        {
          children: 'Trading activity',
          name:"trading_activity"
        },
      ]}
      queryParamName='profile'
    />
  );
};

export const ProfilePage = () => {
  const isOwnProfile = useUnit($isOwnProfile);
  return (
    <BackLayout>
      <div className="max-2lg:items-start flex h-full w-full items-center justify-center">
        <div className="border-primary/30 max-2lg:border-none relative w-full max-w-[896px] rounded-[26px] border-[0.5px]">
          <div
            className={clsx(
              "max-2lg:border-none max-2lg:before:hidden max-2lg:after:hidden relative z-[1] w-full rounded-[26px] border-[10px] border-[rgba(255,255,255,0.1)] before:absolute before:top-[5px] before:-z-20 before:h-[150px] before:w-[300px] before:bg-transparent before:content-[''] after:absolute after:bottom-[5px] after:-z-20 after:h-[150px] after:w-[300px] after:bg-transparent after:content-['']",
              {
                'before:left-[5px] before:shadow-[200px_-20px_75px_#FBBF24] after:right-[5px] after:shadow-[-150px_30px_75px_#FBBF24]':
                  isOwnProfile,
                'before:right-[5px] before:shadow-[150px_-20px_150px_#34D399] after:left-[5px] after:shadow-[-50px_50px_100px_#34D399]':
                  !isOwnProfile,
              },
            )}>
            <div
              className={clsx(
                "bg-darkGray-1 max-2lg:p-0 max-2lg:before:hidden max-2lg:after:hidden max-2lg:bg-transparent relative w-full rounded-2xl p-5 before:absolute before:top-[5px] before:-z-20 before:h-[150px] before:w-[200px] before:bg-transparent before:content-[''] after:absolute after:bottom-[5px] after:-z-20 after:h-[150px] after:w-[200px] after:content-['']",
                {
                  'before:left-[5px] before:shadow-[-80px_-80px_150px_#FBBF24] after:right-[5px] after:shadow-[110px_110px_150px_#FBBF24]':
                    isOwnProfile,
                  'before:right-[5px] before:shadow-[-180px_-80px_100px_#34D399] after:left-[35px] after:shadow-[110px_110px_250px_#34D399]':
                    !isOwnProfile,
                },
              )}>
              <EditProfile isOwnProfile={isOwnProfile} />
              <div className="max-2lg:flex-col max-2lg:gap-5 my-6 flex w-full items-center justify-between">
                <Stats />
                {isOwnProfile && <PostCreate />}
              </div>
              <InfoTabs />
            </div>
          </div>
        </div>
      </div>
    </BackLayout>
  );
};

export const ProfilePageFallback = () => (
  <BackLayout>
    <div className="max-2lg:items-start flex h-full w-full items-center justify-center">
      <div className="border-primary/30 max-2lg:border-none relative w-full max-w-[896px] rounded-[26px] border-[0.5px]">
        <div
          className={
            "max-2lg:border-none max-2lg:before:hidden max-2lg:after:hidden relative z-[1] w-full rounded-[26px] border-[10px] border-[rgba(255,255,255,0.1)] before:absolute before:top-[5px] before:-z-20 before:h-[150px] before:w-[300px] before:bg-transparent before:content-[''] after:absolute after:bottom-[5px] after:-z-20 after:h-[150px] after:w-[300px] after:bg-transparent after:content-['']"
          }>
          <div
            className={
              "bg-darkGray-1 max-2lg:p-0 max-2lg:before:hidden max-2lg:after:hidden max-2lg:bg-transparent relative w-full rounded-2xl p-5 before:absolute before:top-[5px] before:-z-20 before:h-[150px] before:w-[200px] before:bg-transparent before:content-[''] after:absolute after:bottom-[5px] after:-z-20 after:h-[150px] after:w-[200px] after:content-['']"
            }>
            <EditProfileSkeleton />
            <div className="max-2lg:flex-col max-2lg:gap-5 my-6 flex w-full items-center justify-between">
              <StatsSkeleton />
            </div>
            <div className="border-separator mb-4 flex w-[623px] overflow-x-scroll rounded-lg border-[0.5px] whitespace-nowrap [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {[1, 2, 3, 4, 5, 6, 7].map((key) => (
                <div
                  key={key}
                  className="border-r-separator flex items-center gap-2 border-r-[0.5px] px-3 py-2 last:border-r-0">
                  <Skeleton isLoading className="h-5 w-16" />
                </div>
              ))}
            </div>
            <UserPosts />
          </div>
        </div>
      </div>
    </div>
  </BackLayout>
);
