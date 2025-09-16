import { RoutePath } from 'shared/config/router';

const { href } = window.location;
export const hrefUrl = href.replace(/\/$/, '').replace(RoutePath.post, '');

export const IMAGE_MODAL_KEY = 'image-modal';
