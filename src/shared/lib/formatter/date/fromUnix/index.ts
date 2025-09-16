export const fromUnix = (unixTimestamp: number): string => {
  const date = new Date(unixTimestamp * 1000);

  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZoneName: 'short',
  };

  return date.toLocaleString('en-US', options);
};
