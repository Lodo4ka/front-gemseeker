import { useUnit } from 'effector-react';
import { Popover } from 'shared/ui/popover';
import { Typography } from 'shared/ui/typography';
import { $isOpen, closed, toggled } from '../../model/edit';
import clsx from 'clsx';
export type EditProps = {
  className?: {
    trigger?: string;
  };
};
export const Edit = ({ className }: EditProps) => {
  const [isOpen, toggle, close] = useUnit([$isOpen, toggled, closed]);
  return (
    <Popover
      isOpen={isOpen}
      onClose={close}
      placement="bottom"
      className={{ children: 'bg-darkGray-3 w-[107px] -translate-x-[0px] rounded-tl-none px-[10px] py-[6px]' }}
      trigger={
        <button
          onClick={toggle}
          className={clsx('ml-1 flex items-center gap-1 border-none bg-transparent outline-none', className?.trigger)}>
          <div className="bg-secondary h-[4px] w-[4px] rounded-full" />
          <div className="bg-secondary h-[4px] w-[4px] rounded-full" />
          <div className="bg-secondary h-[4px] w-[4px] rounded-full" />
        </button>
      }>
      <div className="flex flex-col items-start justify-center gap-1">
        <Typography
          size="captain2"
          weight="regular"
          className="hover:text-secondary !gap-[6px] transition-all duration-300 ease-in-out"
          icon={{ name: 'pen', size: 12, position: 'left' }}>
          Edit post
        </Typography>
        <Typography
          size="captain2"
          weight="regular"
          onClick={close}
          className="hover:text-secondary !gap-[6px] transition-all duration-300 ease-in-out"
          icon={{ name: 'delete', size: 12, position: 'left' }}>
          Delete post
        </Typography>
      </div>
    </Popover>
  );
};
