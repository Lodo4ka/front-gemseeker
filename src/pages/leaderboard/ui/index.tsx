import { Typography } from 'shared/ui/typography';
import { LeaderboardTable } from 'widgets/leaderboard';

export const LeaderboardPage = () => {
  return (
    <div className="mx-auto my-0 flex w-full max-w-[764px] flex-col gap-4">
      <Typography
        size="headline4"
        icon={{ position: 'left', name: 'leaderboard', size: 20 }}
        className="!gap-2"
        color="secondary">
        Leaderboard
      </Typography>
      <LeaderboardTable />
    </div>
  );
};

export const LeaderboardPageFallback = () => (
  <LeaderboardPage  />
)
