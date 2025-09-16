import clsx from 'clsx';
import { Typography } from 'shared/ui/typography';
import { TasksList } from '../components/tasks';

type CreateStreamProps = {
  className?: {
    container?: string;
  };
  isToken?: boolean;
};
export const CreateStream = ({ className, isToken = false }: CreateStreamProps) => {
  return (
    <div className={clsx('flex h-full flex-col px-5 pb-5 max-sm:p-0', className?.container)}>
      <Typography icon={{ position: 'left', size: 20, name: 'tasks' }} size="headline3">
        Tasks on the stream
      </Typography>
      <Typography size="subheadline2" weight="regular" className="mt-3 mb-4" color="secondary">
        You can create tasks that will be performed on the stream after the token reaches a certain market
        capitalization. There may be several such assignments, and they may be linked to different values of market
        capitalization.
      </Typography>
      <TasksList isToken={isToken} />
    </div>
  );
};
