import { ModalDefault } from 'shared/ui/modal';
import { CREATE_STREAM_MODAL } from '../../config';
import { ModalId, ModalProps } from 'shared/lib/modal';
import { Button } from 'shared/ui/button';
import { CreateStream } from '../base';
import { $$form, changedAddress } from '../../model';
import { useEffect } from 'react';
import { useUnit } from 'effector-react';
import { useForm } from '@effector-reform/react';
import { Typography } from 'shared/ui/typography';
import { Input } from 'shared/ui/input';
import { DevicesWithPreview } from 'entities/stream';

type CreateStreamModalProps = ModalId & {
  address: string | null;
};

const CreateStreamModal = ({ id, address }: CreateStreamModalProps) => {
  const form = useForm($$form);
  const changeAddress = useUnit(changedAddress);

  useEffect(() => {
    changeAddress(address);
  }, [address]);
  return (
    <ModalDefault
      classNames={{
        wrapper: 'w-full max-sm:bg-bg px-0 overflow-y-scroll max-sm:h-full sm:max-h-[calc(100vh-4rem)]',
      }}
      id={id}>
      <form onSubmit={form.onSubmit} className="flex h-full flex-col gap-20 max-sm:justify-between">
        <div className="flex w-full flex-col px-4">
          <div className="flex w-full flex-col">
            <Typography className="!gap-2" size="headline3" icon={{ name: 'camera', size: 20, position: 'left' }}>
              Stream Settings
            </Typography>
            <Typography size="subheadline2" className="mt-2 mb-6" color="secondary" weight="regular">
              In this section, you can configure the data for your stream
            </Typography>
            <DevicesWithPreview classNames={{ videoContainer: 'relative' }} />
            <Input
              theme="tertiary"
              error={form.fields.name.error}
              value={form.fields.name.value}
              onValue={form.fields.name.onChange}
              label="Stream Name"
              classNames={{ container: 'mt-3 w-[346px]' }}
              placeholder="Enter stream name"
            />
          </div>
          <div className="bg-separator my-6 h-[0.5px] w-full" />
          <CreateStream className={{ container: '!px-0' }} isToken={!!address} />
        </div>
        <div className="border-t-separator flex w-full justify-end border-t-[0.5px] px-4 pt-5">
          <Button type="submit">Start Stream</Button>
        </div>
      </form>
    </ModalDefault>
  );
};

export const CreateStreamModalProps = (address: string | null): ModalProps => ({
  Modal: CreateStreamModal,
  isOpen: false,
  className: '!p-0 max-sm:h-full sm:max-w-[660px]',
  props: {
    id: CREATE_STREAM_MODAL,
    address,
  },
});
