export function baseUrl(path: string) {
  return `${__API_URL__}${path}`;
}

export const pinataUrl = (path: string | undefined | null) => {
  if (!path) return;
  return `${__PINATA_URL__}${path}`;
};

export const socketUrl = (path: string) => {
  return `${__VITE_API_WS_URL__}${path}`;
};
