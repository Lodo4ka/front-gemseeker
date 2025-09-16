import clsx from 'clsx';
import { useUnit } from 'effector-react';
import { modalsStore } from 'shared/lib/modal';
import { useEffect, useState } from 'react';

export const ModalComponent = () => {
  const modalState = useUnit(modalsStore.$modals);
  const closeModal = useUnit(modalsStore.closeModal);
  const [mounted, setMounted] = useState<Record<string, boolean>>({});

  useEffect(() => {
    modalState.forEach(({ props, isOpen }) => {
      if (isOpen && !mounted[props.id]) {
        requestAnimationFrame(() => {
          setMounted((prev) => ({ ...prev, [props.id]: true }));
        });
      }
    });
  }, [modalState]);

  return modalState.map(({ props, Modal, isOpen, className, classNameWrapper }) => (
    <div
      key={props.id}
      style={{ perspective: '2000px' }}
      className={clsx(
        'fixed inset-0 z-1000',
        'flex items-center justify-center',
        'invisible',
        'transition-all duration-300 ease-in-out',
        {
          visible: isOpen && mounted[props.id],
        },
      )}>
      <div
        className={clsx(
          'absolute inset-0 px-5',
          'bg-[#000000]/50 backdrop-blur-[2px]',
          'opacity-0',
          'transition-all duration-300 ease-in-out',
          classNameWrapper,
          { 'opacity-100': isOpen && mounted[props.id] },
        )}
        onClick={() => {
          if (props.isNoClose) return;
          closeModal({ id: props.id });
          props.onClose?.();
        }}
      />
      <div
        style={{
          transform:
            isOpen && mounted[props.id]
              ? 'rotateY(0deg) translateZ(0) translateX(0)'
              : 'rotateY(30deg) translateZ(-200px) translateX(50px)',
          transformOrigin: 'right center',
          opacity: isOpen && mounted[props.id] ? 1 : 0,
          transition: 'all 800ms cubic-bezier(0.23, 1, 0.32, 1)',
        }}
        className={clsx('relative z-10 flex w-full items-center justify-center p-4', className)}>
        <Modal {...props} />
      </div>
    </div>
  ));
};
