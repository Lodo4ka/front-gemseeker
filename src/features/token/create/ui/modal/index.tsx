import { ModalDefault } from 'shared/ui/modal';
import { CREATE_TOKEN_MODAL } from '../../config';
import { ModalId } from 'shared/lib/modal';
import { CreateTokenStep } from '..';

const CreateTokenModal = ({ id }: ModalId) => {
  return (
    <ModalDefault
      classNames={{
        wrapper: 'w-full max-sm:!rounded-none max-sm:bg-bg overflow-y-scroll max-sm:h-full sm:max-h-[calc(100vh-4rem)]',
      }}
      id={id}>
      <CreateTokenStep isLiveStream={false} />
    </ModalDefault>
  );
};

export const CreateTokenModalProps = {
  Modal: CreateTokenModal,
  isOpen: false,
  className: '!p-0 max-sm:h-full sm:max-w-[660px]',
  props: {
    id: CREATE_TOKEN_MODAL,
  },
};
