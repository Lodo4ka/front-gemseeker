import { trackMediaQuery } from '@withease/web-api';
import { appStarted } from 'shared/config/init';

export const { desktop } = trackMediaQuery({ desktop: '(min-width: 1300px)' }, { setup: appStarted });
