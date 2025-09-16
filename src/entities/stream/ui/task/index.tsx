import { Skeleton } from 'shared/ui/skeleton';
import { Typography } from 'shared/ui/typography';
import { TaskType } from '../../types';
import { Icon } from 'shared/ui/icon';
import { motion } from 'framer-motion';
export type TaskProps = {
  progress: number;
  id: number;
  description: string;
  type: TaskType;
  target: number;
};

export const Task = ({ progress, id, description, type, target }: TaskProps) => {
  return (
    <div className="flex w-full min-w-[170px] flex-col gap-2 max-sm:min-w-full">
      <div className="bg-darkGray-3 mb-2 h-[6px] w-full overflow-hidden rounded-sm">
        <motion.div
          className="bg-yellow h-full"
          style={{ width: `${progress}%` }}
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{
            duration: 0.5,
            ease: 'easeOut',
          }}
        />
      </div>
      <Typography size="captain1" color="secondary">
        Task {id}
      </Typography>
      <Typography weight="regular">{description}</Typography>
      <Typography size="captain1" color="green">
        {type === 'donation' ? <Icon name="solana" className="text-green !mr-1" size={16} /> : 'Mcap: $'}
        {target}
      </Typography>
    </div>
  );
};

export const TaskFallback = () => {
  return (
    <div className="flex w-full min-w-[170px] flex-col gap-2">
      <Skeleton isLoading className="bg-darkGray-3 mb-2 h-[6px] w-full overflow-hidden rounded-sm" />
      <Skeleton isLoading className="h-4 w-11 rounded-sm" />
      <Skeleton isLoading className="h-5 w-full rounded-sm" />
      <Skeleton isLoading className="h-4 w-1/2 rounded-sm" />
    </div>
  );
};
