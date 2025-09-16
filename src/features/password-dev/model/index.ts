import { createEffect, createEvent, createStore, sample } from "effector";
import { persist } from "effector-storage/local";

import { PasswordDevModalUi } from "../ui";
import { MODAL_KEYS } from "../config";
import { appStarted } from "shared/config/init";
import { modalsStore } from "shared/lib/modal";
import { invoke } from "@withease/factories";
import { inputFactory } from "shared/lib/factories";
import { showToastFx, ShowToastParams } from "shared/lib/toast";
import { spread } from "patronum";
import { controls, router, routes } from "shared/config/router";
import { querySync } from "atomic-router";

export const submitted = createEvent();
export const autthed = createEvent();

export const password = invoke(inputFactory, {});
export const nickname = invoke(inputFactory, {});

const $isAuthed = createStore(false)
    .on(autthed, () => true)
const $nicknameDev = createStore<string | null>(null)

persist({
  store: $isAuthed,
  key: 'isAuthed',
});
persist({
  store: $nicknameDev,
  key: 'nicknameDev',
});

sample({
    clock: appStarted,
    source: $isAuthed,
    filter: (isAuthed) => !isAuthed,
    fn: () => ({
        Modal: PasswordDevModalUi,
        isOpen: false,
        props: {
            id: MODAL_KEYS.PASSWORD_AUTH_DEV,
            isNoClose: true
        },
    }),
    target: modalsStore.openModal
});

// sample({
//     clock: router.$query,
//     fn: ({utm_source}) => utm_source,
//     target: nickname.$value 
// })

sample({
    clock: submitted,
    source: {
        password: password.$value,
        nickname: nickname.$value
    },
    filter: ({password}: {password: string}) => password === __VITE_DEV_AUTH__,
    fn: ({nickname}: {nickname: string}) => ({
        modal: {
            id: MODAL_KEYS.PASSWORD_AUTH_DEV,
        },
        nickname
    }),
    target: spread({
        modal: [autthed, modalsStore.closeModal],
        nickname: $nicknameDev
    })
});

sample({
    clock: submitted,
    source: {
        password: password.$value,
    },
    filter: ({password}: {password: string}) => password !== __VITE_DEV_AUTH__,
    fn: () => ({ 
        message: 'Incorrect password!', 
        options: { type: 'error' } 
    } as ShowToastParams),
    target: showToastFx
});

const saveNicknameFx = createEffect((nickname: string) => {
    if ((window as any).ym) {
      (window as any).ym(__YOUR_ID__, 'setUserID', nickname);
    }
});

sample({
    clock: $nicknameDev,
    filter: Boolean, 
    target: saveNicknameFx
})

querySync({
  source: { utm_source: $nicknameDev },
  controls,
});