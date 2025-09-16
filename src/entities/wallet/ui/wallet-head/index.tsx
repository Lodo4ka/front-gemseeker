import { useUnit } from 'effector-react';
import { useCallback, useState } from 'react';
import { Typography } from 'shared/ui/typography';
import { copied, $selectWallet } from '../../model';
import { api } from 'shared/api';
import { Icon } from 'shared/ui/icon';
import { Popover } from 'shared/ui/popover';
import { Input } from 'shared/ui/input';
import { formatter } from 'shared/lib/formatter';
import type { Wallet } from '../../types';

export type WalletHeadProps = Wallet & { active: boolean };

export const WalletHead = ({ name, public_key, is_active, id, active }: WalletHeadProps) => {
  const copy = useUnit(copied);
  const selectWallet = useUnit($selectWallet);
  const [setActive, rename] = useUnit([api.mutations.wallets.setActive.start, api.mutations.wallets.rename.start]);
  const [nameInput, setNameInput] = useState(name);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  const updateActiveWallet = useCallback(() => {
    if (selectWallet?.id !== id) setActive({ id });
  }, [selectWallet, setActive, id]);

  return (
    <div className="flex flex-col gap-[2px]">
      <div className="flex w-fit items-center gap-1">
        <Typography size="subheadline2" className="w-fit text-nowrap" weight="regular">
          {name}
        </Typography>
        {active && is_active && <Icon name="star" size={16} />}
        {active && !is_active && (
          <Icon onClick={updateActiveWallet} name="star_outlined" className="cursor-pointer" size={16} />
        )}

        <Popover
          className={{ children: 'bg-darkGray-3 w-fit min-w-[90px] translate-y-[-5px] !rounded-lg px-3 py-[6px]' }}
          placement="right"
          isOpen={isPopoverOpen}
          offset={-75}
          trigger={
            <Icon
              name="pen"
              size={16}
              className="text-secondary cursor-pointer"
              onMouseDown={() => setIsPopoverOpen(true)}
            />
          }>
          <Input
            value={nameInput}
            onValue={setNameInput}
            onBlur={() => {
              rename({ id, new_name: nameInput });
              setIsPopoverOpen(false);
            }}
            classNames={{
              container: 'w-full',
              flex: '!p-0 bg-transparent border-none',
              input: '!w-[90px] leading-[20px] !text-[14px]',
            }}
          />
        </Popover>
      </div>
      <Typography
        onClick={() => copy(public_key)}
        size="subheadline2"
        icon={{ name: 'copy', position: 'right', size: 12 }}
        className="w-fit cursor-pointer !gap-1"
        color="secondary"
        weight="regular">
        {formatter.address(public_key, { start: 3, end: 3 })}
      </Typography>
    </div>
  );
};
