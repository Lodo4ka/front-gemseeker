import { ReactNode } from 'react';

import { ErrorBoundary } from './ui';

export const withErrorBoundary = (component: () => ReactNode) => () => (
  <ErrorBoundary>{component()}</ErrorBoundary>
);
