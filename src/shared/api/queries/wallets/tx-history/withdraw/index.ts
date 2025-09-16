import { invoke } from "@withease/factories";
import { txHistoryFactory } from "../factory";

export const withdraw = invoke(txHistoryFactory, {
    sorting_filter: 'withdraw'
})