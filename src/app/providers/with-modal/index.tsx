import { ReactNode } from 'react';

import { ModalComponent } from './ui';

export const withModal = (component: () => ReactNode) => () => (
  <>
    {component()}

    <ModalComponent />
  </>
);
