import { sample } from "effector";
import { api } from "shared/api";
import { $balanceToken, $slippage, $token } from "entities/token";
import { createEvent, createStore } from 'effector';
import { debug, spread } from "patronum";
import { modalsStore } from "shared/lib/modal";
import { INSTA_MODAL_ID, InstaModal } from "../../ui/components/insta-modal";
import { amount } from "../input";
import { inputFactory } from "shared/lib/factories";
import { invoke } from "@withease/factories";
import { $rate } from "features/exchange-rate";

export const resettedOrderLimitSettings = createEvent();

export const $isBuyDipSelected = createStore<boolean>(false);
export const $isBuyNowSelected = createStore<boolean>(true);
export const toggledBuyDip = createEvent();
export const toggledBuyNow = createEvent();

export const $isBuyInstaSelected = createStore<boolean>(false);
export const toggledInstaBuy = createEvent();
const selectedInstaBuy = createEvent();

sample({
  clock: toggledInstaBuy,
  source: $isBuyInstaSelected,
  filter: (isBuyInstaSelected) => isBuyInstaSelected,
  fn: () => false,
  target: $isBuyInstaSelected,
});

sample({
  clock: selectedInstaBuy,
  fn: () => true,
  target: $isBuyInstaSelected,
});

sample({
  clock: toggledInstaBuy,
  source: $isBuyInstaSelected,
  filter: (isBuyInstaSelected) => !isBuyInstaSelected,
  fn: () => ({
    Modal: InstaModal,
    isOpen: false,
    props: {
      id: INSTA_MODAL_ID,
      toggled: selectedInstaBuy,
      type: 'Buy',
    },
  }),
  target: modalsStore.openModal,
});
sample({
  clock: toggledBuyDip,
  source: $isBuyNowSelected,
  filter: (isBuyNowSelected) => !isBuyNowSelected,
  fn: () => true,
  target: $isBuyDipSelected,
});

sample({
  clock: toggledBuyDip,
  source: $isBuyNowSelected,
  filter: (isBuyNowSelected) => isBuyNowSelected,
  fn: () => ({
    isBuyDipSelected: true,
    isBuyNowSelected: false,
  }),
  target: spread({
    isBuyDipSelected: $isBuyDipSelected,
    isBuyNowSelected: $isBuyNowSelected,
  }),
});

sample({
  clock: toggledBuyNow,
  source: $isBuyDipSelected,
  filter: (isBuyDipSelected) => !isBuyDipSelected,
  fn: () => true,
  target: $isBuyNowSelected,
});

sample({
  clock: toggledBuyNow,
  source: $isBuyDipSelected,
  filter: (isBuyDipSelected) => isBuyDipSelected,
  fn: () => ({
    isBuyDipSelected: false,
    isBuyNowSelected: true,
  }),
  target: spread({
    isBuyDipSelected: $isBuyDipSelected,
    isBuyNowSelected: $isBuyNowSelected,
  }),
});

export const $isSellAutoSelected = createStore<boolean>(false);
export const $isSellNowSelected = createStore<boolean>(true);
export const toggledSellAuto = createEvent();
export const toggledSellNow = createEvent();

export const $isSellInstaSelected = createStore<boolean>(false);
export const toggledInstaSell = createEvent();
const selectedInstaSell = createEvent();

export const $typeAutoSell = createStore<'Stop Loss' | 'Take Profit'>('Take Profit');
export const selectedType = createEvent<'Stop Loss' | 'Take Profit'>();

sample({
    clock: resettedOrderLimitSettings,
    target: [
      $isBuyDipSelected.reinit, 
      $isBuyNowSelected.reinit, 
      $isBuyInstaSelected.reinit,
      $isSellAutoSelected.reinit,
      $isSellNowSelected.reinit,
      $isSellInstaSelected.reinit,
      $typeAutoSell.reinit,
      amount.$value.reinit
    ]
});

sample({
  clock: selectedType,
  target: $typeAutoSell,
});

sample({
  clock: toggledInstaSell,
  source: $isSellInstaSelected,
  filter: (isSellInstaSelected) => isSellInstaSelected,
  fn: () => false,
  target: $isSellInstaSelected,
});

sample({
  clock: selectedInstaSell,
  fn: () => true,
  target: $isSellInstaSelected,
});

sample({
  clock: toggledInstaSell,
  source: $isSellInstaSelected,
  filter: (isSellInstaSelected) => !isSellInstaSelected,
  fn: () => ({
    Modal: InstaModal,
    isOpen: false,
    props: {
      id: INSTA_MODAL_ID,
      toggled: toggledInstaSell,

      type: 'Sell',
    },
  }),
  target: modalsStore.openModal,
});
sample({
  clock: toggledSellAuto,
  source: $isSellNowSelected,
  filter: (isSellNowSelected) => !isSellNowSelected,
  fn: () => true,
  target: $isSellAutoSelected,
});

sample({
  clock: toggledSellAuto,
  source: $isSellNowSelected,
  filter: (isSellNowSelected) => isSellNowSelected,
  fn: () => ({
    isSellAutoSelected: true,
    isSellNowSelected: false,
  }),
  target: spread({
    isSellNowSelected: $isSellNowSelected,
    isSellAutoSelected: $isSellAutoSelected,
  }),
});

sample({
  clock: toggledSellNow,
  source: $isSellAutoSelected,
  filter: (isSellAutoSelected) => !isSellAutoSelected,
  fn: () => true,
  target: $isSellNowSelected,
});

sample({
  clock: toggledSellNow,
  source: $isSellAutoSelected,
  filter: (isSellAutoSelected) => isSellAutoSelected,
  fn: () => ({
    isSellAutoSelected: false,
    isSellNowSelected: true,
  }),
  target: spread({
    isSellNowSelected: $isSellNowSelected,
    isSellAutoSelected: $isSellAutoSelected,
  }),
});

const createLimitOrder = api.mutations.orderLimits.create;

type ConditionType = 'MC $' | 'MC %' | 'By target line';
type AutoSellType = 'stopLoss' | 'take_profit';

export const transformTextSelect = (variant_select: ConditionType, isBuyDip:boolean, autoSellVariant?: "Stop Loss" | "Take Profit"): string => {

  variant_select = variant_select
    .replace('$', 'is by') as ConditionType

  if(isBuyDip) return variant_select
    .replace('%', '↓ by');

  if(autoSellVariant === 'Stop Loss') return variant_select
    .replace('%', '↓ by')

  if(autoSellVariant === 'Take Profit') return variant_select
    .replace('%', '↑ by')

  return ''
}

export const options: ConditionType[] = ['MC $', 'MC %', 'By target line'];

export const createdLimitOrder = createEvent();
export const selectedConditionType = createEvent<ConditionType>();
export const changedIsBuyDip = createEvent();
export const changedAutoSell = createEvent<AutoSellType | false>();

export const $currentConditionType = createStore<ConditionType>('MC $')
  .on(selectedConditionType, (_, type) => type);

export const expiryHours = invoke(inputFactory, {
  defaultValue: '0',
  filter: (amount) => Math.sign(+amount) !== -1 && !Number.isNaN(+amount),
});

export const amountSellAuto = invoke(inputFactory, {
  defaultValue: '0',
  filter: (amount) => Math.sign(+amount) !== -1 && !Number.isNaN(+amount),
});

export const triggerMcapValue = invoke(inputFactory, {
  defaultValue: '0',
  filter: (amount) => Math.sign(+amount) !== -1 && !Number.isNaN(+amount),
});

export const $mcapTarget = createStore(0); 

debug($isBuyDipSelected, $isSellAutoSelected, $typeAutoSell)

sample({
  clock: [triggerMcapValue.$value, $currentConditionType, $token, $rate],
  source: {
    token: $token,
    conditionType: $currentConditionType,
    mcapTrigger: triggerMcapValue.$value,
    rateSol: $rate,
    isBuyDip: $isBuyDipSelected,
    isAutoSell: $isSellAutoSelected,
    variantAutoSell: $typeAutoSell
  },
  fn: ({ token, conditionType, mcapTrigger, rateSol, isBuyDip, isAutoSell, variantAutoSell }) => {

    if (!token?.mcap) return 0;

    console.log({isBuyDip, isAutoSell, variantAutoSell})

    if (conditionType === 'MC $') {
      return +mcapTrigger / rateSol;
    }

    if(isBuyDip) {
      if (conditionType === 'MC %') {
        return token.mcap - (token.mcap * (+mcapTrigger / 100));
      }
    }

    if(isAutoSell) {
      if(variantAutoSell === 'Take Profit') {
        if (conditionType === 'MC %') {
          return token.mcap + (token.mcap * (+mcapTrigger / 100));
        }
      }

      if(variantAutoSell === 'Stop Loss') {
        if (conditionType === 'MC %') {
          return token.mcap - (token.mcap * (+mcapTrigger / 100));
        }
      }
    }

    if (conditionType === 'By target line') {
      return 0;
    }

    return token.mcap;
  },
  target: $mcapTarget
});


sample({
  clock: createdLimitOrder,
  source: {
    token: $token,
    isBuyDipSelected: $isBuyDipSelected,
    typeAutoSell: $typeAutoSell,
    amountBuyDip: amount.$value,
    amountSellAuto: amountSellAuto.$value,
    expiryHours: expiryHours.$value,
    mcapTarget: $mcapTarget,
    balanceToken: $balanceToken,
    slippage: $slippage
  },
  fn: ({
    token, 
    isBuyDipSelected, 
    typeAutoSell, 
    amountBuyDip, 
    amountSellAuto, 
    expiryHours, 
    mcapTarget, 
    balanceToken,
    slippage
  }) => {
    let type = '';
    let amount = 0;
    
    if(typeAutoSell === 'Stop Loss') {
      type = "STOP_LOSS";
    };
    if(typeAutoSell === 'Take Profit') {
      type = "TAKE_PROFIT";
    };
    if(isBuyDipSelected) {
      type = "BUY_DIP";
      amount = +amountBuyDip;
    } else {
      amount = balanceToken * (+amountSellAuto / 100);
    };
    console.log(isBuyDipSelected, +amountSellAuto / 100, balanceToken)

    const currentTimeMs = Date.now();
    const hoursInMs = +expiryHours * 3600 * 1000;
    const expiry = Math.floor((currentTimeMs + hoursInMs) / 1000);

    return {
      type,
      mcap_target: mcapTarget,
      amount,
      token_address: token?.address,
      expiry,
      slippage: +slippage
    }
  },
  target: createLimitOrder.start
});