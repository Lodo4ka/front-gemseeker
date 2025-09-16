import { createFactory } from '@withease/factories';
import { createEvent, createStore, sample } from 'effector';

interface paginationFactoryProps {
  limit?: number
}

export const paginationFactory = createFactory(({limit = 10}: paginationFactoryProps) => {
  const $currentPage = createStore<number>(0);
  const $isEndReached = createStore<boolean>(false);

  const loadNextPage = createEvent();
  const dataRanedOut = createEvent();
  const onLoadedFirst = createEvent();

  sample({
    clock: loadNextPage,
    source: { currentPage: $currentPage, isEndReached: $isEndReached },
    filter: ({ isEndReached }) => !isEndReached,
    fn: ({ currentPage }) => (currentPage += limit),
    target: $currentPage,
  });

  sample({
    clock: dataRanedOut,
    target: loadNextPage,
  });
  
  return {
    $currentPage,
    $isEndReached,
    loadNextPage,
    dataRanedOut,
    onLoadedFirst,
  };
});
