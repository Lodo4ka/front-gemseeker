import { useUnit } from 'effector-react';

import clsx from 'clsx';

import { JSX, memo } from 'react';
import { StoreWritable } from 'effector';

export interface MultistepProps {
  steps: JSX.Element[];
  $currentStep: StoreWritable<number>;
  className?: string;
}

export const Multistep = memo(({ steps, className, $currentStep }: MultistepProps) => {
  const currentStep = useUnit($currentStep);

  return (
    <div className={clsx(className)}>
      {steps.map((step, index) => (
        <div
          key={index}
          className={clsx({
            'pointer-events-none absolute opacity-0': currentStep !== index,
            'opacity-100': currentStep === index,
          })}>
          {step}
        </div>
      ))}
    </div>
  );
});
