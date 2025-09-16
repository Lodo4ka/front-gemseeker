import { concurrency, createJsonQuery, declareParams } from '@farfetched/core';
import { zodContract } from '@farfetched/zod';
import { array } from 'zod';
import { contracts } from 'shared/api/contracts';
import { baseUrl } from 'shared/lib/base-url';

export const tasks = createJsonQuery({
  params: declareParams<string>(),
  request: {
    method: 'GET',
    query: (slug) => ({ slug }),
    credentials: 'include',
    url: () => baseUrl(`/room/tasks`),
  },
  response: {
    contract: zodContract(array(contracts.stream.task)),
  },
});

concurrency(tasks, {
  strategy: 'TAKE_LATEST',
});
