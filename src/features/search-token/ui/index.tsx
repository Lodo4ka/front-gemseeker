import { memo } from 'react';
import { useUnit } from 'effector-react';

import { TokenSearch, TokenSearchFallback } from 'entities/token';
import { Input } from 'shared/ui/input';
import { Typography } from 'shared/ui/typography';
import {
  $isOpen,
  open,
  close,
  inputSearch,
  $searchTokens,
  changedIsFocused,
  $isEndReached,
  dataRanedOut,
  isMobileViewed,
} from '../model';
import { Popover } from 'shared/ui/popover';
import { ListWithPagination } from 'shared/ui/list-with-pagination';
import { $rate } from 'features/exchange-rate';
import clsx from 'clsx';

type SearchInputProps = {
  openPopover?: () => void;
  className?: string;
};

const SearchInput = memo(({ openPopover, className }: SearchInputProps) => {
  const [value, fieldUpdate] = useUnit([inputSearch.$value, inputSearch.fieldUpdated]);
  const changeIsFocused = useUnit(changedIsFocused);

  const handleFocus = () => {
    changeIsFocused();
    openPopover?.();
  };

  return (
    <Input
      value={value}
      onValue={fieldUpdate}
      onFocus={handleFocus}
      placeholder="Search"
      leftAddon={{
        icon: 'search',
      }}
      classNames={{
        container: className,
      }}
      rightAddon={{
        text: '/',
        className: 'min-w-5 h-5 bg-darkGray-2 rounded-[4px] flex items-center justify-center',
      }}
    />
  );
});

interface PopoverContentProps {
  isPopoverOpen?: boolean;
  closePopover?: () => void;
}

export const PopoverContent = ({ isPopoverOpen, closePopover }: PopoverContentProps) => {
  const [searchTokens, rate] = useUnit([$searchTokens, $rate]);

  return (
    <div className="flex flex-col gap-5">
      <SearchInput className="flex w-full lg:hidden" />
      <div className="flex flex-col gap-4">
        <Typography size="headline4" color="secondary">
          Top gainers
        </Typography>
        <div className="flex w-full flex-col gap-[10px]">
          {isPopoverOpen && (
            <ListWithPagination
              list={searchTokens}
              className={{
                wrapper: 'h-[430px] w-full',
              }}
              $isDataRanedOut={$isEndReached}
              reachedEndOfList={dataRanedOut}
              onLoaded={isMobileViewed}
              layout="list"
              renderItem={(token, index) => (
                <TokenSearch
                  key={token.id}
                  preview={token.photo_hash}
                  name={token.name}
                  onClose={closePopover}
                  address={token.address}
                  price={token.rate * rate} // token.rate
                  changePrice24h={token.mcap_diff_24h}
                  className={clsx({
                    'mt-[10px]': index != 0,
                  })}
                />
              )}
              skeleton={{ Element: <TokenSearchFallback className="mt-[10px]" />, count: 10 }}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export const SearchToken = () => {
  const [isPopoverOpen, openPopover, closePopover] = useUnit([$isOpen, open, close]);
  return (
    <Popover
      className={{
        container: 'hidden lg:inline-block',
        children: 'w-[400px] rounded-xl p-4',
      }}
      onClose={closePopover}
      trigger={<SearchInput className="hidden w-[400px] lg:flex" openPopover={openPopover} />}
      children={<PopoverContent closePopover={closePopover} isPopoverOpen={isPopoverOpen} />}
      isOpen={isPopoverOpen}
    />
  );
};
