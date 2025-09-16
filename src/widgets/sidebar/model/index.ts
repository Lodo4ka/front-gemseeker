import { createEvent, createStore } from "effector";

export const setAnchored = createEvent();

export const $isAnchored = createStore<boolean>(false)
    .on(setAnchored, (state) => !state);