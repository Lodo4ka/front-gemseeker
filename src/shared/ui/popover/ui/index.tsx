import { ReactNode, memo, useEffect, useState, useRef } from 'react';
import clsx from 'clsx';

export type PopoverProps = {
  children: ReactNode;
  trigger: ReactNode;
  className?: {
    container?: string;
    children?: string;
  };
  placement?: 'top' | 'bottom' | 'left' | 'right';
  offset?: number;
  isOpen: boolean;
  onClose?: () => void;
};

export const Popover = memo(
  ({ trigger, children, className, placement = 'bottom', offset = 4, isOpen, onClose }: PopoverProps) => {
    const [mounted, setMounted] = useState(false);
    const popoverRef = useRef<HTMLDivElement>(null);
    const triggerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      if (isOpen && !mounted) {
        requestAnimationFrame(() => {
          setMounted(true);
        });
      }
    }, [isOpen]);

    useEffect(() => {
      if (!isOpen) return;

      const handleClick = (event: MouseEvent) => {
        const target = event.target as Node;

        if (triggerRef.current?.contains(target)) return;

        if (popoverRef.current && !popoverRef.current.contains(target) && isOpen && onClose) onClose();
      };

      document.addEventListener('mousedown', handleClick);
      return () => document.removeEventListener('mousedown', handleClick);
    }, [isOpen, onClose]);

    return (
      <div ref={popoverRef} className={clsx('relative', className?.container)}>
        <div ref={triggerRef} onMouseDown={(e) => e.stopPropagation()}>
          {trigger}
        </div>
        <div
          className={clsx(
            'absolute z-53',
            'bg-darkGray-1 border-separator rounded-xl border-[0.5px]',
            'shadow-lg',
            'invisible',
            'transition-all duration-500',
            'ease-[cubic-bezier(0.23,1,0.32,1)]',
            {
              visible: isOpen && mounted,

              'bottom-full left-1/2 -translate-x-1/2': placement === 'top',
              'top-full left-1/2 -translate-x-1/2': placement === 'bottom',
              'top-1/2 right-full -translate-y-1/2': placement === 'left',
              'top-1/2 left-full -translate-y-1/2': placement === 'right',
            },
            className?.children,
          )}
          style={{
            marginTop: placement === 'bottom' ? offset : undefined,
            marginBottom: placement === 'top' ? offset : undefined,
            marginLeft: placement === 'right' ? offset : undefined,
            marginRight: placement === 'left' ? offset : undefined,
            transform: `${getBaseTransform(placement)} ${isOpen && mounted ? 'scale(1)' : 'scale(0.95)'}`,
            opacity: isOpen && mounted ? 1 : 0,
          }}
          role="dialog"
          aria-modal="true">
          {children}
        </div>
      </div>
    );
  },
);

const getBaseTransform = (placement: PopoverProps['placement']) => {
  switch (placement) {
    case 'top':
      return 'translateX(-50%)';
    case 'bottom':
      return 'translateX(0%)';
    case 'left':
      return 'translateY(-50%)';
    case 'right':
      return 'translateY(-50%)';
    default:
      return '';
  }
};
