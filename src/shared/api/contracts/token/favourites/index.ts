import { array } from 'zod';

import {contracts} from 'shared/client'

export const favourites = array(contracts.FavouriteSPLTokenResponse);