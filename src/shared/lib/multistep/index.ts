import { createFactory } from '@withease/factories';
import { createEvent, createStore, sample } from 'effector';

export const multistepFactory = createFactory(() => {
  const nextStep = createEvent();
  const prevStep = createEvent();
  const setStep = createEvent<number>();

  const $currentStep = createStore(0);

  sample({
    clock: nextStep,
    source: $currentStep,
    fn: (step) => step + 1,
    target: $currentStep,
  });

  sample({
    clock: prevStep,
    source: $currentStep,
    fn: (step) => Math.max(0, step - 1),
    target: $currentStep,
  });

  sample({
    clock: setStep,
    target: $currentStep,
  });

  return {
    $currentStep,
    prevStep,
    setStep,
    nextStep,
  };
});
