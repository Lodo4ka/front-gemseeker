import { trackMediaQuery } from "@withease/web-api";
import { appStarted } from "shared/config/init";

export const { isDesktop } = trackMediaQuery( 
  { isDesktop: '(min-width: 1024px)' }, 
  { setup: appStarted }
);