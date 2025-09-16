import { concurrency, createJsonQuery, declareParams } from '@farfetched/core';
import { zodContract } from '@farfetched/zod';
import { BatchItem } from 'entities/token';
import { contracts } from 'shared/api/contracts';
import { baseUrl } from 'shared/lib/base-url';
import { calculateCreator, calculateTopHolders } from 'shared/lib/dop-info';
import { array, union } from 'zod';

type BatchResult = Record<
  string,
  {
    topHolders: number | null;
    creator: number | null;
  }
>;

export const batch = createJsonQuery({
  params: declareParams<BatchItem[]>(),
  request: {
    method: 'POST',
    url: baseUrl('/rpc'),
    body: (items) =>
      items.map((item, index) => {
        const baseRequest = {
          jsonrpc: '2.0',
          id: `${item.type}_${index}`,
        };

        if (item.type === 'address') {
          return {
            ...baseRequest,
            method: 'getTokenLargestAccounts',
            params: [item.value, { commitment: 'confirmed' }],
          };
        }

        let mint = '';
        for (let i = index - 1; i >= 0; i--) {
          if (items[i]?.type === 'address') {
            mint = items[i]?.value ?? '';
            break;
          }
        }

        return {
          ...baseRequest,
          method: 'getTokenAccountsByOwner',
          params: [item.value, { mint }, { commitment: 'confirmed', encoding: 'jsonParsed' }],
        };
      }),
  },
  response: {
    contract: zodContract(array(union([contracts.token.dopInfo.topHolders, contracts.token.dopInfo.creator]))),
    mapData: ({ result, params }): BatchResult => {
      const batchResults: BatchResult = {};

      for (let i = 0; i < params.length; i += 2) {
        const addressParam = params[i];
        const creatorParam = params[i + 1];

        if (!addressParam || addressParam.type !== 'address' || !creatorParam) continue;

        const mint = addressParam.value;
        const addressResponse = result[i];
        const creatorResponse = result[i + 1];

        const topHolders = contracts.token.dopInfo.topHolders.safeParse(addressResponse);
        const creator = contracts.token.dopInfo.creator.safeParse(creatorResponse);

        const topHoldersValue = calculateTopHolders(topHolders);
        const creatorValue = calculateCreator(creator);

        batchResults[mint] = { topHolders: topHoldersValue, creator: creatorValue };
      }

      return batchResults;
    },
  },
});

concurrency(batch, { strategy: 'TAKE_EVERY' });
