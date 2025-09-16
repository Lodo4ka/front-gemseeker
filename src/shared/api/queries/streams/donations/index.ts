import { concurrency, createJsonQuery, declareParams } from '@farfetched/core';
import { zodContract } from '@farfetched/zod';
import { array } from 'zod';
import { contracts } from 'shared/api/contracts';
import { baseUrl } from 'shared/lib/base-url';
import { Pagination } from 'shared/types';

export interface DonationsParams extends Pagination {
  slug: string;
}

export const donations = createJsonQuery({
  params: declareParams<DonationsParams>(),
  request: {
    method: 'GET',
    query: ({ slug, limit, offset }) => ({ slug, limit: limit ?? 10, offset: offset ?? 0 }),
    url: () => baseUrl(`/room/donations`),
  },
  response: {
    contract: zodContract(array(contracts.stream.donate)),
  },
});

concurrency(donations, {
  strategy: 'TAKE_LATEST',
});
