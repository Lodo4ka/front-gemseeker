import { invoke } from "@withease/factories";
import { txHistoryFactory } from "../factory";

export const deposit = invoke(txHistoryFactory, {
    sorting_filter: 'deposit'
})