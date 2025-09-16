import { Typography } from 'shared/ui/typography';
import { Skeleton } from 'shared/ui/skeleton';
import { useUnit } from 'effector-react';
import { $token } from 'entities/token/model';
import { formatter } from 'shared/lib/formatter';

import { copied } from '../../model';
import { $tokensDopInfo } from '../../model/dop-info';
import { $rate } from 'features/exchange-rate';
import { Button } from 'shared/ui/button';
import { Icon } from 'shared/ui/icon';

type DetailsProps = {
  isFallback?: boolean;
};

export const Details = ({ isFallback = false }: DetailsProps) => {
  const [token, dopInfo, rate] = useUnit([$token, $tokensDopInfo, $rate]);
  const copy = useUnit(copied);

  const currentDopInfo = dopInfo?.[token?.address ?? ''];
  const pooledToken = token?.virtual_tokens ?? 0;
  const pooledSol = token?.virtual_sol ?? 0;

  if (isFallback) return <DetailsFallback />;

  return (
    <div className="bg-darkGray-1 relative flex w-full flex-col gap-3 rounded-xl p-4">
      <div className="border-b-separator flex w-full items-center justify-between border-b-[0.5px] pb-3">
        <Typography color="secondary" weight="regular">
          Mint Authority
        </Typography>
        <Typography color="green">Disabled</Typography>
      </div>
      <div className="border-b-separator flex w-full items-center justify-between border-b-[0.5px] pb-3">
        <Typography color="secondary" weight="regular">
          Freeze Authority
        </Typography>
        <Typography color="green">Disabled</Typography>
      </div>
      <div className="border-b-separator flex w-full items-center justify-between border-b-[0.5px] pb-3">
        <Typography color="secondary" weight="regular">
          LP Burned
        </Typography>
        <Typography color="green">{token?.trade_finished ? '100' : '0'}%</Typography>
      </div>
      <div className="border-b-separator flex w-full items-center justify-between border-b-[0.5px] pb-3">
        <Typography color="secondary" weight="regular">
          Pooled token
        </Typography>
        <Typography>
          {formatter.number.uiDefault(pooledToken)} $
          {formatter.number.uiDefault(pooledToken * (token?.rate ?? 0) * rate)}
        </Typography>
      </div>
      <div className="border-b-separator flex w-full items-center justify-between border-b-[0.5px] pb-3">
        <Typography color="secondary" weight="regular">
          Pooled SOL
        </Typography>
        <Typography>
          {formatter.number.uiDefault(pooledSol)} ${formatter.number.uiDefault(pooledSol * rate)}
        </Typography>
      </div>
      {typeof currentDopInfo?.topHolders === 'number' ? (
        <div className="border-b-separator flex w-full items-center justify-between border-b-[0.5px] pb-3">
          <Typography color="secondary" weight="regular">
            Top 10 Holders
          </Typography>
          <Typography color={currentDopInfo.topHolders >= 10 ? 'red' : 'green'}>
            {formatter.number.round(currentDopInfo.topHolders, 1)}%
          </Typography>
        </div>
      ) : (
        <div className="border-b-separator flex w-full items-center border-b-[0.5px] pb-3">
          <Skeleton isLoading className="h-4 w-32 rounded" />
          <Skeleton isLoading className="ml-auto h-4 w-20 rounded" />
        </div>
      )}
      {typeof currentDopInfo?.creator === 'number' ? (
        <div className="border-b-separator flex w-full items-center justify-between border-b-[0.5px] pb-3">
          <Typography color="secondary" weight="regular">
            Dev percent
          </Typography>
          <Typography color={currentDopInfo.creator >= 1 ? 'red' : 'green'}>
            {formatter.number.round(currentDopInfo.creator, 1)}%
          </Typography>
        </div>
      ) : (
        <div className="border-b-separator flex w-full items-center border-b-[0.5px] pb-3">
          <Skeleton isLoading className="h-4 w-32 rounded" />
          <Skeleton isLoading className="ml-auto h-4 w-20 rounded" />
        </div>
      )}

      {typeof currentDopInfo?.snipers === 'number' ? (
        <div className="border-b-separator flex w-full items-center justify-between border-b-[0.5px] pb-3">
          <Typography color="secondary" weight="regular">
            Snipers
          </Typography>
          <Typography color={currentDopInfo.snipers >= 10 ? 'red' : 'green'}>
            {formatter.number.round(currentDopInfo.snipers, 1)}%
          </Typography>
        </div>
      ) : (
        <div className="border-b-separator flex w-full items-center border-b-[0.5px] pb-3">
          <Skeleton isLoading className="h-4 w-32 rounded" />
          <Skeleton isLoading className="ml-auto h-4 w-20 rounded" />
        </div>
      )}
      {typeof currentDopInfo?.insiders === 'number' ? (
        <div className="border-b-separator flex w-full items-center justify-between border-b-[0.5px] pb-3">
          <Typography color="secondary" weight="regular">
            Insiders
          </Typography>
          <Typography color={currentDopInfo.insiders >= 10 ? 'red' : 'green'}>
            {formatter.number.round(currentDopInfo.insiders, 1)}%
          </Typography>
        </div>
      ) : (
        <div className="border-b-separator flex w-full items-center border-b-[0.5px] pb-3">
          <Skeleton isLoading className="h-4 w-32 rounded" />
          <Skeleton isLoading className="ml-auto h-4 w-20 rounded" />
        </div>
      )}

      <div
        onClick={() => copy(token?.deployer_wallet ?? '')}
        className="border-b-separator flex w-full cursor-pointer items-center justify-between border-b-[0.5px] pb-3">
        <Typography color="secondary" weight="regular">
          Deployer
        </Typography>

        <Typography>
          {formatter.address(token?.deployer_wallet)}

          <Button
            className={{
              button: '!shadow-0 relative z-1 !border-0 !bg-transparent !p-0',
              icon: '!text-primary',
            }}
            icon={{
              name: 'copy',
              size: 17,
              position: 'left',
            }}
          />
        </Typography>
      </div>
      <div className="flex w-full items-center justify-between">
        <Typography color="secondary" weight="regular">
          Open Trading
        </Typography>
        <Typography>
          {token?.trade_started ? 
            <Icon 
              name='tick'
              className='>& fill-green'
              size={16} 
            />
          : 
            <Icon 
              name='x'
              className='>& fill-red'
              size={16} 
            />
          }
        </Typography>
      </div>
    </div>
  );
};

const DetailsFallback = () => {
  return (
    <div className="bg-darkGray-1 flex w-full flex-col gap-3 rounded-xl p-4">
      {[...Array(8)].map((_, i) => (
        <div
          key={i}
          className={
            i !== 7 ? 'border-b-separator flex w-full items-center border-b-[0.5px] pb-3' : 'flex w-full items-center'
          }>
          <Skeleton isLoading className="h-4 w-32 rounded" />
          <Skeleton isLoading className="ml-auto h-4 w-20 rounded" />
        </div>
      ))}
    </div>
  );
};
