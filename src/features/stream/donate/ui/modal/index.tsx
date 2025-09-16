import { ModalDefault } from 'shared/ui/modal';
import { DONATE_MODAL } from '../../config';
import { ModalId, ModalProps } from 'shared/lib/modal';
import { Button } from 'shared/ui/button';
import { $$form } from '../../model';
import { useForm } from '@effector-reform/react';
import { Input } from 'shared/ui/input';
import clsx from 'clsx';

const DonateModal = ({ id }: ModalId) => {
  const form = useForm($$form);

  return (
    <ModalDefault
      header={{
        icon: { name: 'donate', size: 20, position: 'left' },
        className: '!gap-2 pl-4',
        size: 'headline3',
        children: 'Donate to the streamer',
      }}
      classNames={{
        wrapper: 'max-w-[506px] w-full !gap-2 !px-0',
      }}
      id={id}>
      <form className="flex w-full flex-col gap-7" onSubmit={form.onSubmit}>
        <div className="flex flex-col gap-3 px-4">
          <Input
            rightAddon={{
              icon: 'solana',
              className: 'text-secondary',
              size: 16,
            }}
            label="Enter the amount you want to donate."
            theme="tertiary"
            classNames={{
              container: '!gap-4 ',
              label: 'text-secondary !font-regular',
              flex: clsx({ '!border-red': form.fields.amount.error }),
            }}
            placeholder="Enter the amount"
            value={form.fields.amount.value}
            onValue={form.fields.amount.onChange}
          />
          <div className="border-separator flex overflow-hidden rounded-lg border-[0.5px]">
            <Button
              theme="darkGray"
              type="button"
              onClick={() => form.fields.amount.onChange('0.01')}
              className={{
                button:
                  'border-r-separator text-secondary w-full rounded-none border-r-[0.5px] bg-transparent !px-3 !py-2 text-[14px]',
              }}>
              0.01
            </Button>
            <Button
              theme="darkGray"
              type="button"
              onClick={() => form.fields.amount.onChange('0.1')}
              className={{
                button:
                  'border-r-separator text-secondary w-full rounded-none border-r-[0.5px] bg-transparent !px-3 !py-2 text-[14px]',
              }}>
              0.1
            </Button>
            <Button
              theme="darkGray"
              type="button"
              onClick={() => form.fields.amount.onChange('0.5')}
              className={{
                button:
                  'border-r-separator text-secondary w-full rounded-none border-r-[0.5px] bg-transparent !px-3 !py-2 text-[14px]',
              }}>
              0.5
            </Button>
            <Button
              theme="darkGray"
              type="button"
              onClick={() => form.fields.amount.onChange('1')}
              className={{
                button:
                  'border-r-separator text-secondary w-full rounded-none border-r-[0.5px] bg-transparent !px-3 !py-2 text-[14px]',
              }}>
              1
            </Button>
            <Button
              theme="darkGray"
              type="button"
              onClick={() => form.fields.amount.onChange('2')}
              className={{
                button:
                  'border-r-separator text-secondary w-full rounded-none border-r-[0.5px] bg-transparent !px-3 !py-2 text-[14px]',
              }}>
              2
            </Button>
            <Button
              theme="darkGray"
              type="button"
              onClick={() => form.fields.amount.onChange('10')}
              className={{
                button: 'text-secondary w-full rounded-none bg-transparent !px-3 !py-2 text-[14px]',
              }}>
              10
            </Button>
          </div>
        </div>

        <div className="border-t-separator flex w-full justify-end border-t-[0.5px] px-4 pt-5">
          <Button type="submit">Donate</Button>
        </div>
      </form>
    </ModalDefault>
  );
};

export const DonateModalProps: ModalProps = {
  Modal: DonateModal,
  isOpen: false,
  props: {
    id: DONATE_MODAL,
  },
};
