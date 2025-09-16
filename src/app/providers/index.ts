import compose from 'compose-function';

import { withErrorBoundary } from './with-errorboundary';
import { withModal } from './with-modal';
import { withRouter } from './with-router';
import { withToast } from './with-toast';
import { withSolana } from './with-solana';
import { withScopeImg } from './with-scope-img';

export const withProviders = compose(
    withErrorBoundary, 
    withRouter, 
    withSolana, 
    withModal, 
    withToast,
    withScopeImg
);
