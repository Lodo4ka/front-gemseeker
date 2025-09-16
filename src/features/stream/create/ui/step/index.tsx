import { Typography } from 'shared/ui/typography';

import { EventCallable } from 'effector';
import { useUnit } from 'effector-react';

import { CreateStream } from '../base';
import { Button } from 'shared/ui/button';
import { useForm } from '@effector-reform/react';
import { $$form } from '../../model';
import { Input } from 'shared/ui/input';

export const CreateStreamStep = ({ prevStep }: { prevStep: EventCallable<void> }) => {
  const prev = useUnit(prevStep);
  const form = useForm($$form);

  // const createStream = useUnit(createdStream);
  return (
    <div className="flex h-full w-full flex-col">
      <Typography
        color="secondary"
        onClick={prev}
        icon={{ position: 'left', name: 'arrowLeft', size: 16 }}
        className="w-fit cursor-pointer !gap-1 px-5 py-5 pb-4 max-sm:px-0 max-sm:pt-0">
        Back to token
      </Typography>
      <form onSubmit={form.onSubmit} className="flex h-full flex-col justify-between">
        <Input
          theme="tertiary"
          error={form.fields.name.error}
          value={form.fields.name.value}
          onValue={form.fields.name.onChange}
          label="Stream Name"
          classNames={{ container: 'mb-3 w-[346px] px-5' }}
          placeholder="Enter stream name"
        />
        <CreateStream isToken />
        <div className="border-t-separator flex w-full items-center justify-end gap-4 border-t-[0.5px] p-5 max-sm:mt-10">
          <Typography
            color="secondary"
            size="subheadline2"
            className="!gap-1"
            icon={{ position: 'right', name: 'solana', size: 14 }}>
            The fee is 0.00036
          </Typography>
          <Button type="submit" className={{ button: 'text-nowrap' }}>
            Start Stream
          </Button>
        </div>
      </form>
    </div>
  );
};
