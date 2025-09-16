import { RouteInstance, RouteParams, RouteParamsAndQuery, chainRoute } from 'atomic-router';
import { createEvent, Effect, Event, EventCallable, sample } from 'effector';
import { api } from 'shared/api';

import { $viewerStatus, ViewerStatus } from '../model';

interface ChainParams {
  otherwise?: Event<void> | Effect<void, any, unknown>;
}

export function chainAuthenticated<Params extends RouteParams>(
  route: RouteInstance<Params>,
  { otherwise }: ChainParams = {},
): RouteInstance<Params> {
  const authenticationCheckStarted = createEvent<RouteParamsAndQuery<Params>>();
  const pageAccessGranted = createEvent();
  const authorizationRequired = createEvent();
  const redirectTriggered = createEvent();

  // Проверяем статус кошелька при входе на страницу
  sample({
    clock: authenticationCheckStarted,
    source: $viewerStatus,
    // filter: (status) => status === ViewerStatus.Initial,
    target: [api.queries.user.me.start, api.queries.wallets.all.start],
  });

  // Нет подключенного кошелька - пускаем на страницу
  sample({
    clock: [authenticationCheckStarted, api.queries.wallets.all.$failed],
    source: $viewerStatus,
    filter: (status) => status === ViewerStatus.Anonymous,
    target: pageAccessGranted,
  });

  // Авторизован, но нет wallets - редирект
  sample({
    clock: [authenticationCheckStarted, api.queries.wallets.all.$succeeded],
    source: $viewerStatus,
    filter: (status) => status === ViewerStatus.AuthenticatedWithNoWallets,
    target: redirectTriggered,
  });

  // Авторизован и есть wallets - пускаем на страницу
  sample({
    clock: [authenticationCheckStarted, api.queries.wallets.all.$succeeded],
    source: $viewerStatus,
    filter: (status) => status === ViewerStatus.Authenticated,
    target: pageAccessGranted,
  });

  if (otherwise) {
    sample({
      clock: redirectTriggered,
      filter: route.$isOpened,
      target: otherwise as EventCallable<void>,
    });
  }

  return chainRoute({
    route,
    beforeOpen: authenticationCheckStarted,
    openOn: pageAccessGranted,
    cancelOn: [authorizationRequired, redirectTriggered],
  });
}

export function chainAnonymous<Params extends RouteParams>(
  route: RouteInstance<Params>,
  { otherwise }: ChainParams = {},
): RouteInstance<Params> {
  const authenticationCheckStarted = createEvent<RouteParamsAndQuery<Params>>();
  const pageAccessGranted = createEvent();
  const redirectTriggered = createEvent();

  sample({
    clock: authenticationCheckStarted,
    source: $viewerStatus,
    // filter: (status) => status === ViewerStatus.Initial,
    target: [api.queries.user.me.start, api.queries.wallets.all.start],
  });

  sample({
    clock: [authenticationCheckStarted, api.queries.wallets.all.$failed],
    source: $viewerStatus,
    filter: (status) => status === ViewerStatus.Anonymous,
    target: redirectTriggered,
  });

  sample({
    clock: [authenticationCheckStarted, api.queries.wallets.all.$succeeded],
    source: $viewerStatus,
    filter: (status) => status === ViewerStatus.AuthenticatedWithNoWallets,
    target: pageAccessGranted,
  });

  sample({
    clock: [authenticationCheckStarted, api.queries.wallets.all.$succeeded],
    source: $viewerStatus,
    filter: (status) => status === ViewerStatus.Authenticated,
    target: pageAccessGranted,
  });

  if (otherwise) {
    sample({
      clock: redirectTriggered,
      filter: route.$isOpened,
      target: otherwise as EventCallable<void>,
    });

  }

  return chainRoute({
    route,
    beforeOpen: authenticationCheckStarted,
    openOn: [pageAccessGranted],
    cancelOn: [redirectTriggered],
  });
}
