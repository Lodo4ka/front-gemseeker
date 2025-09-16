import { array } from 'zod';
import { transaction } from 'shared/api/contracts/transaction';

export const transactions = array(transaction.byUser);
