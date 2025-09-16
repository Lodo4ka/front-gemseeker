import { array } from 'zod';

import {contracts} from 'shared/client'

export const list = array(contracts.SPLTokenResponse);