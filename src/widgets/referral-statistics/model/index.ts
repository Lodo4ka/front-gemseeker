import { createEvent, createStore, sample } from 'effector';
import { api } from 'shared/api';
import { RefferalsResponse } from 'shared/api/queries/user/referrals';

export const referralQuery = api.queries.user.referrals
export const referraloadded = createEvent();

export const $referral = createStore<null | RefferalsResponse>(null);
export const $referralStatus = referralQuery.$status

sample({
    clock: referraloadded,
    fn: () => undefined,
    target: referralQuery.start
});

sample({
    clock: referralQuery.$data,
    target: $referral
});