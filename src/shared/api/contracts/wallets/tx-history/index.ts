import { array } from 'zod';
import { tx } from '../tx';

export const txHistory = array(tx);
