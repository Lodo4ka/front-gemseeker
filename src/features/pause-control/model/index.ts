import { createEvent, createStore } from 'effector';
import { PauseState } from '../types';

export const changedPause = createEvent<PauseState>();

export const $isPausedNewData = createStore<PauseState>(null).on(changedPause, (_, payload) => payload);
