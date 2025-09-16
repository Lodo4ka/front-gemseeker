import { createEvent, createStore } from 'effector';

import { solflare } from './solflare';
import { phantom } from './phantom';
import { useUnit, useStoreMap  } from 'effector-react';

export const settedAdapterVariant = createEvent<'phantom' | 'solflare'>();

export const $selectAdatper = createStore<'phantom' | 'solflare' | 'default'>('default')
    .on(settedAdapterVariant, (_, payload) => payload);

export const adapters = {
  phantom,
  solflare,
  default: {
    $publicKey: createStore('')
  }
}

// split({
//     source: $selectAdatper,
//     match: {
//         phantom: (payload) => payload === 'phantom',
//         solflare: (payload) => payload === 'solflare',
//     },
//     cases: {
//         phantom: phantom.connected,
//         solflare: solflare.connected,
//     }
// })

export const useAdapter = () => {
    const selectAdapter = useStoreMap(
      $selectAdatper,
      (selectAdatper) => adapters[selectAdatper]
    );
    const adapter = useUnit(selectAdapter);

    return adapter
}


export {
    phantom,
    solflare
}