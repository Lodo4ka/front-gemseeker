import { RoutePath } from 'shared/config/router';

const { href } = window.location;
const hrefUrl = href.replace(/\/$/, '').replace(RoutePath.refer, '');
export const referralLink = `${hrefUrl}?ref_id=`;
