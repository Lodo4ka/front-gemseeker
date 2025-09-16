import { useState } from 'react';
import { AccordionBase } from './base';
import { AccordionControlledProps, AccordionProps } from '../types';
import { useUnit } from 'effector-react';

export const Accordion = ({ defaultState = false, ...props }: AccordionProps) => {
  const [isOpen, setOpen] = useState(defaultState);

  return <AccordionBase {...props} isOpen={isOpen} setOpen={setOpen} />;
};

export const AccordionControlled = ({ $isOpen, toggledOpen, ...props }: AccordionControlledProps) => {
  const [isOpen, toggleOpen] = useUnit([$isOpen, toggledOpen]);
  return <AccordionBase {...props} isOpen={isOpen} toggleOpen={toggleOpen} />;
};
