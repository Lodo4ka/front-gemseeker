import clsx from 'clsx';
import { useUnit } from 'effector-react';
import { Task, $tasks, $pending, TaskFallback, TaskType, $streamInfo } from 'entities/stream';
import { $tokenMCAP } from 'entities/token';
export type Tasks = {
  type: TaskType;
  className?: string;
};
export const Tasks = ({ type, className }: Tasks) => {
  const [tasks, pending] = useUnit([$tasks, $pending]);
  const tokenMCAP = useUnit($tokenMCAP);
  const donationAmount = useUnit($streamInfo.map((info) => info?.donation_sum ?? null));

  if (pending) {
    return (
      <div
        className={clsx(
          'border-t-separator max-lg:scrollbar-top mt-6 flex w-full gap-4 border-t-[0.5px] pt-6 max-lg:overflow-x-scroll',
          className,
        )}>
        <TaskFallback />
        <TaskFallback />
        <TaskFallback />
        <TaskFallback />
        <TaskFallback />
      </div>
    );
  }

  if (
    tasks.length === 0 ||
    (tokenMCAP === null && type === 'mcap') ||
    (donationAmount === null && type === 'donation')
  ) {
    return null;
  }
  return (
    <div
      className={clsx(
        'border-t-separator max-lg:scrollbar-top max-2lg:overflow-x-scroll mt-6 flex w-full gap-4 border-t-[0.5px] pt-6',
        className,
      )}>
      {tasks.map((task, index) => {
        const target = (type === 'donation' ? task.donation_target : task.mcap_target) as number;
        const amount = (type === 'donation' ? donationAmount : tokenMCAP) ?? 0;

        // Проверяем завершенность предыдущих задач
        const previousTasksCompleted = tasks.slice(0, index).every((prevTask) => {
          const prevTarget = (type === 'donation' ? prevTask.donation_target : prevTask.mcap_target) as number;
          return amount >= prevTarget;
        });

        if (!previousTasksCompleted) {
          return (
            <Task key={index} id={index + 1} description={task.description} type={type} target={target} progress={0} />
          );
        }

        const currentProgress = target > 0 ? Math.min(100, Math.round((amount / target) * 100)) : 0;

        return (
          <Task
            key={index}
            id={index + 1}
            description={task.description}
            type={type}
            target={target}
            progress={currentProgress}
          />
        );
      })}
    </div>
  );
};
