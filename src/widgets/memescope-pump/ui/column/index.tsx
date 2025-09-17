import { Button } from 'shared/ui/button';
import { ColumnTitle } from '../columns-title';
import { TokenMarket } from 'entities/token';
import clsx from 'clsx';
// removed unused PauseVariant
import { useUnit } from 'effector-react';
import { modalsStore, type ModalId } from 'shared/lib/modal';
import { ModalDefault } from 'shared/ui/modal';
import { MemescopeFilter } from 'features/memescope-filter/ui';

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
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((key, idx_market, array) => (
          <TokenMarket
            className={clsx(
              'rounded-none!',
              { 'rounded-t-xl!': idx_market === 0 },
              { 'rounded-b-xl!': idx_market === array.length - 1 },
              { 'border-separator border-b-[0.5px] border-solid': idx_market !== array.length - 1 }, // MOCK, зменить на реальный массив
            )}
            key={key}
            token={{
              photo_hash: '',
              symbol: 'Umk99ujM',
              name: 'SYPERTOKEN',
              address: 'Umk99ujM',
              id: 0,
              deployer_wallet: '',
              migrated: false,
              messages: 0,
              mcap: 0,
              holders: 0,
              alltime_buy_txes: 0,
              alltime_sell_txes: 0,
              creation_date: 0,
              rate: 0,
              twitter: 'A',
              website: 'A',
              youtube: 'A',
              telegram: 'A',
              last_tx_timestamp: 0,
              trade_started: false,
              trade_finished: false,
              mcap_diff_24h: 0,
              description: 'A',
              volume_24h: 0,
              is_nsfw: true,
              created_by: {
                user_id: 0,
                user_nickname: 'Umk99ujM',
                user_photo_hash: '',
              },
              bounding_curve: 0,
              is_streaming: false,
              virtual_tokens: 0,
              virtual_sol: 0,
              real_tokens: 0,
              real_sol: 0,
              ath: 0,
              prev_ath: 0,
            }}
          />
        ))}
      </div>
    </div>
  );
};
