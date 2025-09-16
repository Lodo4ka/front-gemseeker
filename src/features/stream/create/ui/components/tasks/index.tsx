import { useUnit } from 'effector-react';
import { Input } from 'shared/ui/input';
import { Typography } from 'shared/ui/typography';
import { Button } from 'shared/ui/button';
import { ReactFields, useForm } from '@effector-reform/react';
import { $$form, taskAdded } from '../../../model';
import { PrimitiveField } from '@effector-reform/core';
type TaskProps = {
  isToken?: boolean;
  task: ReactFields<{
    title: PrimitiveField<string, any>;
    target: PrimitiveField<string, any>;
  }>;
  id: number;
  onRemove: (index: number) => void;
};

const Task = ({ task, id, onRemove, isToken = false }: TaskProps) => {
  const labelTarget = isToken ? 'M.Cap to complete the task' : 'Donation amount to complete the task';
  const placeholder = isToken ? 'Enter M.Cap' : 'Enter donation amount';
  return (
    <div className="border-separator flex w-full flex-col gap-[10px] rounded-xl border-[0.5px] p-4">
      <div className="flex items-center justify-between">
        <Typography size="headline4">Task {id + 1}</Typography>
        <button type="button" onClick={() => onRemove(id)} className="h-4 w-4">
          <div className="bg-secondary h-[1px] w-4 origin-center rotate-45" />
          <div className="bg-secondary h-[1px] w-4 origin-center translate-y-[-1px] -rotate-45" />
        </button>
      </div>
      <Input
        placeholder="Enter a task"
        value={task.title.value}
        onValue={task.title.onChange}
        error={task.title.error}
        classNames={{ flex: 'bg-darkGray-3 max-2lg:bg-darkGray-1', container: 'w-full' }}
      />

      <Input
        value={task.target.value}
        onValue={task.target.onChange}
        error={task.target.error}
        label={labelTarget}
        classNames={{ flex: 'bg-darkGray-3 max-2lg:bg-darkGray-1', container: 'w-full' }}
        placeholder={placeholder}
      />
    </div>
  );
};

type TaskListProps = {
  isToken?: boolean;
};

export const TasksList = ({ isToken = false }: TaskListProps) => {
  const form = useForm($$form);
  const create = useUnit(taskAdded);

  const remove = (index: number) => {
    form.fields.tasks.onRemove({ index });
  };

  return (
    <div className="flex w-full flex-col gap-6">
      <div className="flex w-full flex-col gap-4">
        {form.fields.tasks.values.map((task, index) => (
          <Task isToken={isToken} task={task} id={index} onRemove={remove} key={index} />
        ))}
      </div>
      <div className="flex flex-col gap-3">
        {form.fields.tasks.values.length >= 5 && (
          <Typography size="captain1" weight="regular" color="secondary">
            *You can only add up to 5 tasks
          </Typography>
        )}
        <Button
          type="button"
          disabled={form.fields.tasks.values.length >= 5}
          className={{ button: 'w-fit' }}
          theme="darkGray"
          onClick={create}>
          + Add task
        </Button>
      </div>
    </div>
  );
};
