import { EventCallable } from 'effector';
import { JSX } from 'react';

export interface ModalId {
  id: string;
  onClose?: () => void | EventCallable<void>;
}
export interface ModalProps {
  Modal: (props: any) => JSX.Element;
  props: Record<string, unknown> & ModalId;
  isOpen: boolean;
  className?: string;
  classNameWrapper?: string;
}
