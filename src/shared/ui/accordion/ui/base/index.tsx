import { useRef, useState } from 'react';

import { useEffect } from 'react';
import { AccordionBaseProps, AccordionControls } from '../../types';
import clsx from 'clsx';
import { Icon } from 'shared/ui/icon';

export interface AccordionBaseControls extends AccordionControls, AccordionBaseProps {}

export const AccordionBase = ({
  header,
  children,
  className,
  disabled = false,
  isOpen,
  setOpen,
  toggleOpen,
}: AccordionBaseControls) => {
  const [height, setHeight] = useState(0);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open || !contentRef.current) return;

    const updateHeight = () => setHeight(contentRef.current!.scrollHeight);

    updateHeight();

    const observer = new ResizeObserver(updateHeight);
    observer.observe(contentRef.current);

    return () => observer.disconnect();
  }, [open]);

  const handleClick = () => {
    if (!disabled) {
      setOpen?.(!isOpen);
      toggleOpen?.();
    }
  };

  return (
    <div className={clsx('w-full', className?.root)}>
      <div
        className={clsx(
          'flex w-full items-center justify-between gap-2 select-none',
          'transition-colors duration-200',
          disabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer',
          className?.header,
        )}
        onClick={handleClick}>
        {header.position === 'left' && header.content}
        <Icon
          name="arrowLeft"
          size={20}
          className={clsx(
            'text-secondary transition-transform duration-200',
            isOpen ? 'rotate-90' : '-rotate-90',
            className?.icon,
          )}
        />
        {header.position === 'right' && header.content}
      </div>
      <div
        ref={contentRef}
        style={{ maxHeight: isOpen ? height : 0 }}
        className={clsx('overflow-hidden transition-all duration-400', className?.content)}
        aria-hidden={!isOpen}>
        {children}
      </div>
    </div>
  );
};
