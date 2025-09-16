import { useEffect, useState, FC } from 'react';

type TimeAgoProps = {
  unixTimestamp: number; // In seconds
};

const formatElapsed = (seconds: number): string => {
  if (seconds < 60) {
    return `${seconds} second${seconds !== 1 ? 's' : ''}`;
  } else if (seconds < 3600) {
    const mins = Math.floor(seconds / 60);
    return `${mins} minute${mins !== 1 ? 's' : ''}`;
  } else if (seconds < 86400) {
    const hrs = Math.floor(seconds / 3600);
    return `${hrs} hour${hrs !== 1 ? 's' : ''}`;
  } else {
    const days = Math.floor(seconds / 86400);
    return `${days} day${days !== 1 ? 's' : ''}`;
  }
};

export const TimeAgo: FC<TimeAgoProps> = ({ unixTimestamp }) => {
  const initialElapsed = Math.floor(Date.now() / 1000) - unixTimestamp;
  const [elapsed, setElapsed] = useState(initialElapsed);

  useEffect(() => {
    const interval = setInterval(() => {
      setElapsed((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return <>{formatElapsed(elapsed)}</>;
};

