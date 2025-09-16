import { createFactory } from '@withease/factories';
import { createEvent } from 'effector';
import { interval } from 'patronum';
import { REFRESH_INTERVAL } from 'shared/constants';

export const refreshFactory = createFactory(() => {
  const startedInterval = createEvent();
  const stoppedInterval = createEvent();

  const { tick } = interval({
    timeout: REFRESH_INTERVAL,
    start: startedInterval,
    stop: stoppedInterval,
  });

  return {
    startedInterval,
    stoppedInterval,
    tick,
  };
});
