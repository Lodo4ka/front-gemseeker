export const timeAgo = (timestamp: number): string => {
  const now = Math.floor(Date.now() / 1000);
  const diff = now - timestamp;

  if (diff < 0) return 'just now';

  const minute = 60;
  const hour = minute * 60;
  const day = hour * 24;
  const week = day * 7;
  const month = day * 30;
  const year = day * 365;

  if (diff < 3) return 'just now';
  if (diff < minute) {
    return `${diff} sec${diff !== 1 ? 's' : ''} ago`;
  }
  if (diff < hour) {
    const value = Math.floor(diff / minute);
    return `${value} min${value !== 1 ? 's' : ''} ago`;
  }
  if (diff < day) {
    const value = Math.floor(diff / hour);
    return `${value} hour${value !== 1 ? 's' : ''} ago`;
  }
  if (diff < week) {
    const value = Math.floor(diff / day);
    return `${value} day${value !== 1 ? 's' : ''} ago`;
  }
  if (diff < month) {
    const value = Math.floor(diff / week);
    return `${value} week${value !== 1 ? 's' : ''} ago`;
  }
  if (diff < year) {
    const value = Math.floor(diff / month);
    return `${value} month${value !== 1 ? 's' : ''} ago`;
  }

  const value = Math.floor(diff / year);
  return `${value} year${value !== 1 ? 's' : ''} ago`;
};
