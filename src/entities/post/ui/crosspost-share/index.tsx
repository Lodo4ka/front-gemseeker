import { useUnit } from 'effector-react';
import { Icon } from 'shared/ui/icon';
import { Popover } from 'shared/ui/popover';
import { Typography } from 'shared/ui/typography';
import { $isOpen, closed, shared, toggled } from '../../model/crosspost-share';

export const CrosspostShare = () => {
  const [isOpen, toggle, close, share] = useUnit([$isOpen, toggled, closed, shared]);
  return (
    <Popover
      isOpen={isOpen}
      onClose={close}
      placement="bottom"
      className={{ children: 'bg-darkGray-3 w-[107px] -translate-x-[0px] rounded-tl-none px-[10px] py-[6px]' }}
      trigger={<Icon onClick={toggle} name="vector" className="text-secondary cursor-pointer" size={12} />}>
      <div className="flex flex-col items-start justify-center gap-1">
        <Typography
          size="captain2"
          onClick={share}
          weight="regular"
          className="hover:text-secondary !gap-[3px] transition-all duration-300 ease-in-out"
          icon={{ name: 'copy_chain', size: 15, position: 'left' }}>
          Copy link
        </Typography>
        <Typography
          size="captain2"
          weight="regular"
          onClick={close}
          className="hover:text-secondary !gap-[6px] transition-all duration-300 ease-in-out"
          icon={{ name: 'crosspost', size: 12, position: 'left' }}>
          Crosspost
        </Typography>
      </div>
    </Popover>
  );
};
