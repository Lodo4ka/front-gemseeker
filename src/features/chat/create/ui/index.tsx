import { useForm } from '@effector-reform/react';
import { Button } from 'shared/ui/button';
import { Input } from 'shared/ui/input';
import { $$form } from '../model';
import clsx from 'clsx';

export const ChatCreate = () => {
  const form = useForm($$form);
  return (
    <form
      onSubmit={form.onSubmit}
      className="border-t-separator flex h-[68px] w-full items-center gap-[10px] border-t-[0.5px] p-4">
      <Input
        onValue={form.fields.message.onChange}
        value={form.fields.message.value}
        classNames={{
          flex: clsx('!bg-darkGray-2 !py-[6px] max-lg:!bg-transparent', {
            '!border-red border-[0.5px]': form.fields.message.error,
          }),
          container: 'w-full',
        }}
        placeholder="Write a message"
      />
      <Button
        type="submit"
        theme="quaternary"
        className={{ button: 'h-9 w-[56px]' }}
        icon={{
          position: 'center',
          name: 'send',
          size: 16,
        }}
      />
    </form>
  );
};
