import clsx from 'clsx';
import { useUnit } from 'effector-react';
import { ReactNode } from 'react';
import { modalsStore } from 'shared/lib/modal';
import { Typography, type TypographyProps } from 'shared/ui/typography';

interface ModalDefaultProps {
  classNames?: {
    wrapper?: string;
    content?: string;
    exit?: {
      container?: string;
      content?: string;
    };
  };
  children?: ReactNode;
  id: string;
  onClose?: () => void;
  header?: TypographyProps;
  isNoClose?: boolean;
  isNoBtnCLose?: boolean;
}

export const ModalDefault = ({
  classNames,
  children,
  id,
  header,
  onClose,
  isNoClose = false,
  isNoBtnCLose = false,
}: ModalDefaultProps) => {
  const closeModal = useUnit(modalsStore.closeModal);

  const close = () => {
    closeModal({ id });
    onClose?.();
  };

  return (
    <div
      className={clsx(
        'bg-darkGray-1 flex flex-col gap-4',
        'relative z-10',
        'rounded-xl shadow-xl',
        'w-full p-4',
        'transition-all duration-200',
        classNames?.wrapper,
      )}>
      {header && <Typography {...header} />}
      {!isNoClose && !isNoBtnCLose && (
        <button onClick={close} className={clsx('absolute top-4 right-4 h-4 w-4', classNames?.exit?.container)}>
          <div className={clsx('bg-secondary h-[1px] w-4 origin-center rotate-45', classNames?.exit?.content)} />
          <div
            className={clsx(
              'bg-secondary h-[1px] w-4 origin-center translate-y-[-1px] -rotate-45',
              classNames?.exit?.content,
            )}
          />
        </button>
      )}
      <div className={classNames?.content}>{children}</div>
    </div>
  );
};
