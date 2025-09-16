export const getFullUrlImg = (hashImg: string | null, username: string) => {
  if (!hashImg) return `${__AVATAR_URL__}/${username}`;
  return `${__PINATA_URL__}${hashImg}`;
};
