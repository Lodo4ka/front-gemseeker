import { RoutePath } from 'shared/config/router';

const { href } = window.location;

const hrefUrl = href
    .replace(/\/$/, '')
    .replace(RoutePath.refer, '');

export const shareTokenLink = `${hrefUrl}${hrefUrl.includes('?') ? '&' : '?'}ref_id=`;
