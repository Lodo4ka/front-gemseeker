import { object, string } from 'zod';

export const wsUrl = object({
  ws_url: string(),
  client_ip: string(),
});
