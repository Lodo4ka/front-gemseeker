import { Button } from 'shared/ui/button';
import { ColumnTitle } from '../columns-title';
import { useUnit } from 'effector-react';
import { modalsStore, type ModalId } from 'shared/lib/modal';
import { ModalDefault } from 'shared/ui/modal';
import { MemescopeFilter } from 'features/memescope-filter/ui';
import { ContentMarket } from 'widgets/markets/ui/content/index.tsx';
import { MemescopeMarket } from 'entities/token/ui/memescope-market';

interface ColumnProps {
  idx: number;
}

export const Column = ({ idx }: ColumnProps) => {
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
    <div className="flex w-full flex-col gap-[12px]">
      <div className="flex w-full justify-between gap-[5px]">
        <ColumnTitle idx={idx} />
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
      </div>
      <div className="flex w-full flex-col rounded-xl">
        <ContentMarket TokenMarket={MemescopeMarket} />
      </div>
    </div>
  );
};
