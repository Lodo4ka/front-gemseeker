import { invoke } from "@withease/factories";
import { createStore, sample, combine, createEvent } from "effector";
import { $address } from "entities/token";
import { $selectedWallet } from "entities/wallet";
import { $trades } from "pages/token/model/trades";
import { api } from "shared/api";
import { LimitOrdersActiveResponse } from "shared/api/queries/order-limits/active";
import { paginationFactory } from "shared/lib/pagination-factory";
import { 
  $isActiveChecked,
  $isSuccessChecked,
  $isFailedChecked,
  $isBuyDipChecked,
  $isStopLossChecked,
  $isTakeProfitChecked
} from "entities/token/model/filtres-limit-orders";
import { debug, spread } from "patronum";
import { CreateOrderMutationResponse } from "shared/api/mutations/order-limits/create";

export const canceled = createEvent<{order_pubkey: string}>()

const limit = 20;
const ordersActiveQuery = api.queries.orderLimits.active;
const deleteOrder = api.mutations.orderLimits.delete;

export const { $currentPage, $isEndReached, dataRanedOut, loadNextPage, onLoadedFirst } = invoke(paginationFactory, {
  limit,
});

export const $orders = createStore<LimitOrdersActiveResponse | null>(null);

sample({
  clock: canceled,
  source: $orders,
  filter: (orders) => orders !== null,
  fn: (orders, { order_pubkey }) => ({
    array: orders!.filter((order) => order.order_pubkey !== order_pubkey),
    api_call: {order_pubkey}
  }),
  target: spread({
    array: $orders,
    api_call: deleteOrder.start,
  })
});

sample({
  clock: ordersActiveQuery.finished.success,
  fn: ({ result }) => result,
  target: $orders,
});

sample({
  clock: ordersActiveQuery.finished.success,
  filter: ({ result }) => result.length < limit,
  fn: () => true,
  target: $isEndReached,
});

debug($isEndReached)

// Computed store for filter parameters
export const $filterParams = combine({
  active: $isActiveChecked,
  success: $isSuccessChecked,
  failed: $isFailedChecked,
  buyDip: $isBuyDipChecked,
  stopLoss: $isStopLossChecked,
  takeProfit: $isTakeProfitChecked,
});

const buildQueryParams = ({
  address,
  wallet,
  filters,
}: {
  address: string | null;
  wallet: any;
  filters: {
    active: boolean;
    success: boolean;
    failed: boolean;
    cancelled: boolean;
    buyDip: boolean;
    stopLoss: boolean;
    takeProfit: boolean;
  };
}) => {
  // Собираем массив статусов
  const status: ("ACTIVE" | "SUCCESS" | "FAILED" | "CANCELLED")[] = [];
  if (filters.active) status.push("ACTIVE");
  if (filters.success) status.push("SUCCESS");
  if (filters.failed) status.push("FAILED");
  if (filters.cancelled) status.push("CANCELLED");

  // Собираем массив типов ордеров
  const order_type: ("BUY_DIP" | "STOP_LOSS" | "TAKE_PROFIT")[] = [];
  if (filters.buyDip) order_type.push("BUY_DIP");
  if (filters.stopLoss) order_type.push("STOP_LOSS");
  if (filters.takeProfit) order_type.push("TAKE_PROFIT");

  return {
    wallet_id: wallet.id,
    status: status.length > 0 ? status : null,
    order_type: order_type.length > 0 ? order_type : null,
    token_mint: address,
  };
};


sample({
  clock: $address,
  target: [$trades.reinit, $currentPage.reinit, $isEndReached.reinit],
});

// Reset pagination and refresh data when address changes
sample({
  clock: $address,
  source: {
    address: $address,
    wallet: $selectedWallet,
    filters: $filterParams,
  },
  filter: ({address, wallet}) => Boolean(address && wallet?.id),
  fn: buildQueryParams,
  target: [ordersActiveQuery.refresh, $currentPage.reinit, $isEndReached.reinit],
});

sample({
  clock: onLoadedFirst,
  source: {
    address: $address,
    wallet: $selectedWallet,
    filters: $filterParams,
  },
  filter: ({address, wallet}) => Boolean(address && wallet?.id),
  fn: buildQueryParams,
  target: ordersActiveQuery.refresh,
});

// Load next page with current filters
sample({
  clock: loadNextPage,
  source: {
    address: $address,
    wallet: $selectedWallet,
    filters: $filterParams,
  },
  filter: ({address, wallet}) => Boolean(address && wallet?.id),
  fn: buildQueryParams,
  target: ordersActiveQuery.refresh,
});

// Refresh query when filters change
sample({
  clock: $filterParams,
  source: {
    address: $address,
    wallet: $selectedWallet,
    filters: $filterParams,
  },
  filter: ({address, wallet}) => Boolean(address && wallet?.id),
  fn: buildQueryParams,
  target: [ordersActiveQuery.refresh, $currentPage.reinit, $isEndReached.reinit],
});

// Refresh query when wallet changes
sample({
  clock: $selectedWallet,
  source: {
    address: $address,
    wallet: $selectedWallet,
    filters: $filterParams,
  },
  filter: ({address, wallet}) => Boolean(address && wallet?.id),
  fn: buildQueryParams,
  target: [ordersActiveQuery.refresh, $currentPage.reinit, $isEndReached.reinit],
});

// Refresh query when a new limit order is created
sample({
  clock: api.mutations.orderLimits.create.finished.success,
  source: {
    orders: $orders,
    wallet: $selectedWallet,
    filters: $filterParams,
  },

  fn: ({orders}, newOrder) => {
    if(orders === null) return null;

    const copy = [...orders]

    copy.unshift(newOrder.result as CreateOrderMutationResponse)

    return copy;
  },
  target: $orders,
});

// TODO: Add refresh when limit order is cancelled
// This will require implementing the cancel mutation in shared/api/mutations/order-limits/cancel/
// sample({
//   clock: api.mutations.orderLimits.cancel.finished.success,
//   source: { address: $address, wallet: $selectedWallet, filters: $filterParams },
//   filter: ({address, wallet}) => Boolean(address && wallet?.id),
//   fn: buildQueryParams,
//   target: [ordersActiveQuery.refresh, $currentPage.reinit, $isEndReached.reinit],
// });

