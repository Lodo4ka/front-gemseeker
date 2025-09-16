import { create } from "./create";
import { deleteOrder } from "./delete";

export const orderLimits = {
    create,
    delete:deleteOrder
}