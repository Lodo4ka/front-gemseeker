import { createStore, createEvent } from 'effector';

// Individual checkbox stores
export const $isActiveChecked = createStore<boolean>(false);
export const $isSuccessChecked = createStore<boolean>(false);
export const $isFailedChecked = createStore<boolean>(false);
export const $isCanceledChecked = createStore<boolean>(false);
export const $isBuyDipChecked = createStore<boolean>(false);
export const $isStopLossChecked = createStore<boolean>(false);
export const $isTakeProfitChecked = createStore<boolean>(false);

// Events to toggle individual filters
export const toggleActive = createEvent<void>();
export const toggleSuccess = createEvent<void>();
export const toggleFailed = createEvent<void>();
export const toggleCanceled = createEvent<void>();
export const toggleBuyDip = createEvent<void>();
export const toggleStopLoss = createEvent<void>();
export const toggleTakeProfit = createEvent<void>();

// Reset all filters
export const resetFilters = createEvent<void>();

// Handle toggle events
$isActiveChecked.on(toggleActive, (state) => !state);
$isSuccessChecked.on(toggleSuccess, (state) => !state);
$isFailedChecked.on(toggleFailed, (state) => !state);
$isCanceledChecked.on(toggleCanceled, (state) => !state);
$isBuyDipChecked.on(toggleBuyDip, (state) => !state);
$isStopLossChecked.on(toggleStopLoss, (state) => !state);
$isTakeProfitChecked.on(toggleTakeProfit, (state) => !state);

// Reset all filters
$isActiveChecked.on(resetFilters, () => false);
$isSuccessChecked.on(resetFilters, () => false);
$isFailedChecked.on(resetFilters, () => false);
$isBuyDipChecked.on(resetFilters, () => false);
$isStopLossChecked.on(resetFilters, () => false);
$isTakeProfitChecked.on(resetFilters, () => false);

