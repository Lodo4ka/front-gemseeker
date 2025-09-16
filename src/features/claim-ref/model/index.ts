import { createEvent, sample } from "effector";
import { api } from "shared/api";

const claimRefBalanceMutation = api.mutations.user.claimRefBalance;

export const claimed = createEvent();

sample({
    clock: claimed,
    fn: () => undefined,
    target: claimRefBalanceMutation.start,
});



