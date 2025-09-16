import { createEvent, sample } from "effector";
import { $token, $tokenIsFavourite } from "entities/token";
import { api } from "shared/api";

const addFavouriteMutation = api.mutations.token.addFavourite;
const removeFavouriteMutation = api.mutations.token.removeFavourite;

export const clickedFavourite = createEvent();
export const actionFavourite = createEvent<boolean>();

sample({
    clock: clickedFavourite,
    source: {
        token: $token,
        tokenIsFavourite: $tokenIsFavourite
    },
    filter: ({tokenIsFavourite}) => !tokenIsFavourite,
    fn: ({token}) => ({
        token_address: token?.address ?? ''
    }),
    target: addFavouriteMutation.start
});

sample({
    clock: clickedFavourite,
    source: {
        token: $token,
        tokenIsFavourite: $tokenIsFavourite
    },
    filter: ({tokenIsFavourite}) => !!tokenIsFavourite,
    fn: ({token}) => ({
        token_address: token?.address ?? ''
    }),
    target: removeFavouriteMutation.start
});

sample({
    clock: clickedFavourite,
    source: $tokenIsFavourite,
    fn: (tokenIsFavourite) => !tokenIsFavourite,
    target: [$tokenIsFavourite, actionFavourite]
});

// sample({
//     clock: [
//         addFavouriteMutation.finished.success, 
//         removeFavouriteMutation.finished.success
//     ],
//     source: $tokenIsFavourite,
//     fn: (tokenIsFavourite) => !tokenIsFavourite,
//     target: $tokenIsFavourite
// });