import { createStore } from 'effector';
import { TokenVolume } from '../../types/volume';

export const $tokenStats = createStore<TokenVolume | null>(null);
