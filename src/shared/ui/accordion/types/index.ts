import { EventCallable, StoreWritable } from 'effector';
import { ReactNode } from 'react';

export interface AccordionBaseProps {
  header: {
    position: 'left' | 'right';
    content: ReactNode;
  };
  children: ReactNode;
  className?: {
    root?: string;
    header?: string;
    content?: string;
    icon?: string;
  };
  disabled?: boolean;
}

export interface AccordionControls {
  setOpen?: (v: boolean) => void;
  toggleOpen?: () => void;
  isOpen: boolean;
}

export interface AccordionProps extends AccordionBaseProps {
  defaultState?: boolean;
}

export interface AccordionControlledProps extends AccordionBaseProps {
  $isOpen: StoreWritable<boolean>;
  toggledOpen: EventCallable<void>;
}
