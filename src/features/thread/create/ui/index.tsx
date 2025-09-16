import { useUnit } from 'effector-react';
import { $text, changedText, $error, createdThread } from '../model';
import { api } from 'shared/api';
import { Input } from 'shared/ui/input';
import { Button } from 'shared/ui/button';
import clsx from 'clsx';
export const ThreadCreate = () => {
  const [text, changeText, error] = useUnit([$text, changedText, $error]);
  const [creating, createThread] = useUnit([api.mutations.thread.create.$pending, createdThread]);
  return (
    <div className="flex w-full flex-col gap-1">
      <div className="flex w-full items-start gap-2">
        <Input
          classNames={{ input: 'w-full', flex: 'h-9', container: 'w-full' }}
          value={text}
          onValue={changeText}
          error={error}
          placeholder="Write a message"
        />
        <Button
          onClick={createThread}
          icon={{
            position: 'center',
            size: 16,
            name: 'send',
          }}
          theme="quaternary"
          className={{ button: 'h-8 w-12', icon: clsx({ hidden: creating }) }}
          disabled={creating}>
          <div
            className={clsx(
              'border-secondary border-t-primary h-4 min-w-4 animate-spin rounded-full border-2 border-solid',
              { hidden: !creating },
            )}
          />
        </Button>
      </div>
    </div>
  );
};
