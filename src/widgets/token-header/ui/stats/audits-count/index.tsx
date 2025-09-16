import { useUnit } from 'effector-react';
import { $token, $tokensDopInfo } from 'entities/token';
import { useMemo } from 'react';
import { Typography } from 'shared/ui/typography';

export const AuditsCount = () => {
  const [dopInfo, token] = useUnit([$tokensDopInfo, $token]);
  const currentDopInfo = useMemo(() => dopInfo?.[token?.address ?? ''], [dopInfo, token]);
  let countAudits = 3;
  if((currentDopInfo?.topHolders ?? 0) < 10) countAudits++;
  if((currentDopInfo?.creator ?? 0) < 10) countAudits++;
  if((currentDopInfo?.insiders ?? 0) < 10) countAudits++;
  if((currentDopInfo?.snipers ?? 0) < 10) countAudits++;

  return (
    <Typography
      className="!gap-1"
      color="green"
      icon={{ position: 'left', name: 'successToast', size: 16 }}
      size="subheadline1">
      {countAudits}/7
    </Typography>
  );
};
