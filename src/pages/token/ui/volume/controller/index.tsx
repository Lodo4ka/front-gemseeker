import { formatter } from 'shared/lib/formatter';
import { Typography } from 'shared/ui/typography';

type VolumeControllerProps = {
  label: string;
  value: number;
};

export const VolumeController = ({ label, value }: VolumeControllerProps) => {
  return (
    <>
      <Typography weight="regular" color="secondary">
        {label}
      </Typography>
      <Typography color={value >= 0 ? 'green' : 'red'}>{formatter.number.formatSmallNumber(value)}%</Typography>
    </>
  );
};
