import { createBarrier, isHttpErrorCode } from '@farfetched/core';

import { refreshToken } from 'shared/api/mutations/user/refresh-token';

export const auth = createBarrier({
  activateOn: {
    failure: isHttpErrorCode(401),
  },
  perform: [refreshToken],
});
