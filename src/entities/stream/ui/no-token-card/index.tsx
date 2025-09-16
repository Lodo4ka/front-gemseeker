import { StreamListItem } from '../../types';
import { ImageWrapper } from 'shared/ui/image';
import { Typography } from 'shared/ui/typography';
import { formatter } from 'shared/lib/formatter';
import { getFullUrlImg } from 'shared/lib/full-url-img';
import { routes } from 'shared/config/router';
import { Link } from 'atomic-router-react';
import { MiniPlayer } from '../mini-player';
import { useHover } from 'shared/lib/use-hover';
import { useUnit } from 'effector-react';

export type NoTokenCardProps = {
  stream: StreamListItem;
};

type TasksProps = {
  tasks: StreamListItem['tasks'];
  donationSum: number;
};
const Tasks = ({ tasks, donationSum }: TasksProps) => {
  const completedTasksCount = tasks.filter(
    (task) => task?.donation_target && donationSum > task.donation_target,
  ).length;
  return (
    <div className="flex w-full flex-col gap-[14px]">
      <div className="flex w-full items-center gap-2">
        <Typography size="captain1" weight="regular" className="!w-8" color="secondary">
          {completedTasksCount} / {tasks.length}
        </Typography>
        <div className="flex w-full items-center gap-2">
          {tasks.map((task) => {
            const target = task.donation_target ?? 0;
            const percent = target > 0 ? Math.min((donationSum / target) * 100, 100) : 0;

            return (
              <div key={task.description} className="bg-darkGray-3 h-[6px] w-full overflow-hidden rounded-sm">
                <div className="bg-yellow h-full transition-all duration-300" style={{ width: `${percent}%` }} />
              </div>
            );
          })}
        </div>
      </div>
      <Typography
        icon={{ position: 'left', size: 16, name: 'solana' }}
        size="captain1"
        weight="regular"
        className="!gap-2"
        color="secondary">
        {donationSum} / {tasks[tasks.length - 1]?.donation_target}
      </Typography>
    </div>
  );
};
export const NoTokenCard = ({ stream }: NoTokenCardProps) => {
  const toStream = useUnit(routes.stream.open);
  const { isHovered, handleMouseOver, handleMouseOut, isMobile } = useHover({ pauseVariant: 'streams' });
  return (
    <div
      onMouseEnter={!isMobile ? handleMouseOver : undefined}
      onMouseLeave={!isMobile ? handleMouseOut : undefined}
      onClick={() => toStream({ slug: stream.slug })}
      className="bg-darkGray-1 relative flex w-full transform cursor-pointer flex-col gap-[10px] rounded-xl p-4 transition-all duration-300 ease-in-out hover:z-10 hover:scale-102 hover:shadow-2xl">
      <MiniPlayer isHovered={isHovered} stream={stream} />
      <div className="flex w-full flex-col gap-4">
        <div className="flex items-center gap-2">
          <ImageWrapper
            src={getFullUrlImg(stream.creator.user_photo_hash, stream.creator.user_nickname)}
            classNames={{
              both: '!w-[50px] rounded-full !h-[50px]',
            }}
            isHoverImg
          />
          <div className="flex flex-col gap-[6px]">
            <Typography size="headline4">{stream.name}</Typography>
            <Typography
              as={Link}
              to={routes.profile}
              params={{ id: stream.creator.user_id }}
              weight="regular"
              color="secondary">
              @{stream.creator.user_nickname}
            </Typography>
          </div>
        </div>
        <div className="bg-separator h-[0.5px] w-full" />

        {stream.tasks.length > 0 && <Tasks tasks={stream.tasks} donationSum={stream.donation_sum} />}
        {stream.tasks.length === 0 && (
          <Typography
            icon={{ position: 'left', name: 'solana', size: 20 }}
            size="headline3"
            className="h-12 !gap-1"
            color="secondary">
            {formatter.number.uiDefault(stream.donation_sum)}
          </Typography>
        )}
      </div>
    </div>
  );
};
