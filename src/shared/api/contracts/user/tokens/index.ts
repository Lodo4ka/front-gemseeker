import { array } from 'zod';
import { token } from 'shared/api/contracts/token';

export const tokens = array(token.created);
