import { Button } from 'shared/ui/button';
import { ModalId, modalsStore } from 'shared/lib/modal';
import { MemescopeFilter } from 'features/memescope-filter/ui';
import { ModalDefault } from 'shared/ui/modal';
import { useUnit } from 'effector-react';

export const FiltersButton = () => {
  const [openModal, closeModal] = useUnit([modalsStore.openModal, modalsStore.closeModal]);

  const FILTER_MODAL_ID = 'memescope_filter_panel';

  const FilterModal = ({ id, onClose }: ModalId) => (
    <ModalDefault
      id={id}
      classNames={{
        wrapper: 'w-full max-w-[420px] h-full !p-0 rounded-l-xl',
        content: 'h-full',
      }}
      isNoBtnCLose>
      <MemescopeFilter onClose={onClose as () => void} />
    </ModalDefault>
  );
  return (
    <Button
      theme="outline"
      className={{
        button: 'text-secondary',
      }}
      icon={{
        name: 'filters',
        position: 'left',
        size: 13,
      }}
      onClick={() =>
        openModal({
          Modal: FilterModal,
          isOpen: false,
          props: {
            id: FILTER_MODAL_ID,
            onClose: () => {
              closeModal({ id: FILTER_MODAL_ID });
            },
          },
          className: 'mt-[50px] h-[calc(100vh-50px)] items-stretch justify-end !p-0',
          classNameWrapper: 'top-[50px] left-0 right-0 bottom-0 px-0',
        })
      }>
      Filters
    </Button>
  );
};
