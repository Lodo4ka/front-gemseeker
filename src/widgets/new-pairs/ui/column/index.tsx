import { Button } from 'shared/ui/button';
import { ColumnTitle } from '../columns-title';
import { TokenMarket, TokenMarketFallback } from 'entities/token';
import { useUnit } from 'effector-react';
import { modalsStore, type ModalId } from 'shared/lib/modal';
import { ModalDefault } from 'shared/ui/modal';
import { MemescopeFilter } from 'features/memescope-filter/ui';
import { $list, $tokens, $isEndReached } from 'widgets/markets/model';
import { $rate } from 'features/exchange-rate';
import { dataRanedOut } from 'widgets/markets/model';
import { $isChecked } from 'features/toggle-view';
import { ListWithPagination } from 'shared/ui/list-with-pagination';
import { MemescopeMarket } from 'entities/token/ui/memescope-market';

interface ColumnProps {
  idx: number;
}

export const Column = ({ idx }: ColumnProps) => {
  const [openModal, closeModal] = useUnit([modalsStore.openModal, modalsStore.closeModal]);
  const [list] = useUnit([$list, $rate, $isChecked]);
  const tokens = useUnit($tokens);

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
        <ListWithPagination
          layout="grid"
          list={list}
          className={{
            list: 'xs:grid-cols-[repeat(auto-fill,minmax(400px,1fr))] grid w-full grid-cols-[repeat(auto-fill,minmax(100%,1fr))] gap-[10px]',
          }}
          $isDataRanedOut={$isEndReached}
          reachedEndOfList={dataRanedOut}
          skeleton={{ Element: <TokenMarketFallback />, count: 30 }}
          uniqueKey={(address) => address}
          renderItem={(id) => {
            const token = tokens[id];
            if (!token) return null;
            return <MemescopeMarket token={token} />;
          }}
        />
      </div>
    </div>
  );
};
