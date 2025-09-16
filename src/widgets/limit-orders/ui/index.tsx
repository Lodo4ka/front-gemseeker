import { Typography } from 'shared/ui/typography';
import { Column, Table } from 'shared/ui/table';
import { useUnit } from 'effector-react';
import { $isEndReached, $orders, canceled, dataRanedOut, onLoadedFirst } from '../model';
import { formatter } from 'shared/lib/formatter';
import { LimitOrdersActiveResponse } from 'shared/api/queries/order-limits/active';
import { $rate } from 'features/exchange-rate';
import { $token } from 'entities/token';
import { $selectWallet } from 'entities/wallet/model';
import { Icon } from 'shared/ui/icon';
import { Button } from 'shared/ui/button';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';

function capitalizeFirstLetter(str:string) {
  if (!str) return str; // Если строка пустая, возвращаем её
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

const TokenName = () => {
  const token = useUnit($token);

  return (
    <Typography size='captain1'>
      {token?.name.toUpperCase()}
    </Typography>
  )
}

const Cancel = ({order_pubkey}:{order_pubkey:string}) => {
  const cancel = useUnit(canceled);

  return (
    <Button 
      theme='quaternary'
      icon={{
        name: 'delete',
        size: 16,
        position: 'left'
      }}
      onClick={() => cancel({order_pubkey})} 
    />
  )
}

const Wallet = () => {
  const selectWallet = useUnit($selectWallet);

  return (
    <div className='flex flex-col gap-[2px]'>
      <Typography size='captain1'>
        {selectWallet?.name}
      </Typography>

      <Typography
        color='secondary'
        size='captain1'
        className='gap-[4px]'
        icon={{
          name: 'copy',
          position: 'right',
          size: 12,
        }}
      >
        {selectWallet?.name}
      </Typography>
    </div>
  )
}

export const columns: Column<LimitOrdersActiveResponse[0]>[] = [
  {
    key: 'Wallets',
    title: 'Wallets',
    className: 'min-w-[90px] px-[12px] py-[8px]',
    render: ({  }) => <Wallet />,
  },
  {
    key: 'Token',
    title: 'Token',
    className: 'min-w-[60px] px-[12px] py-[8px]',
    render: () => <TokenName />,
  },
  {
    key: 'Amount',
    title: 'Amount',
    className: 'min-w-[60px] px-[12px] py-[8px]',
    render: ({ making_amount }) => (
      <Typography size='captain1'>
        {formatter.number.formatSmallNumber(making_amount / LAMPORTS_PER_SOL)}  
      </Typography>
    ),
  },
  {
    key: 'Condition',
    title: 'Condition',
    className: 'min-w-[150px] px-[12px] py-[8px]',
    render: ({ order_type, start_mcap, target_mcap }) => {
      // защита от деления на ноль
      const percentDiff =
        start_mcap > 0
          ? ((target_mcap - start_mcap) / start_mcap) * 100
          : 0;

      let conditionText = '';
      switch (order_type) {
        case 'BUY_DIP':
          // Покупка при падении цены
          conditionText = `Buy dip at ≤ ${percentDiff.toFixed(1)}%`;
          break;
        case 'STOP_LOSS':
          // Продажа при падении ниже указанного уровня
          conditionText = `Stop loss at ≤ ${percentDiff.toFixed(1)}%`;
          break;
        case 'TAKE_PROFIT':
          // Продажа при достижении прибыли
          conditionText = `Take profit at ≥ ${percentDiff.toFixed(1)}%`;
          break;
        default:
          conditionText = '-';
      }

      return (
        <Typography size='captain1'>
          {conditionText}
        </Typography>
      );
    },
  },
  {
    key: 'Created with',
    title: 'Created with',
    className: 'min-w-[90px] px-[12px] py-[8px]',
    render: ({ start_mcap }, {rate}) => (
      <div className='flex flex-col gap-[2px]'>
        <Typography
          className='gap-[8px]'
          icon={{
            name: 'solana',
            position: 'left',
            size: 12,
          }}
          size='captain1'
        >
          {formatter.number.formatSmallNumber(start_mcap)}
        </Typography>

        <Typography color='secondary' size='captain1'>
          MC ${formatter.number.formatSmallNumber(start_mcap * rate)}
        </Typography>
      </div>
    ),
  },
  {
    key: 'Target price',
    title: 'Target_price',
    className: 'min-w-[90px] px-[12px] py-[8px]',
    render: ({ target_mcap }, {rate}) => (
      <div className='flex flex-col gap-[2px]'>
        <Typography 
          className='gap-[8px]'
          icon={{
            name: 'solana',
            position: 'left',
            size: 12,
          }}
          size='captain1'
        >
          {formatter.number.formatSmallNumber(target_mcap)}
        </Typography>

        <Typography color='secondary' size='captain1' >
          MC ${formatter.number.formatSmallNumber(target_mcap * rate)}
        </Typography>
      </div>
    ),
  },
  {
    key: 'Triggered AT',
    title: 'Triggered AT',
    className: 'min-w-[90px] px-[12px] py-[8px]',
    render: ({ triggered_at }) => {
      const value = triggered_at
        ? new Date(triggered_at * 1000).toLocaleString()
        : 'N/A';

      return (
        <Typography
          color={triggered_at ? 'green' : 'secondary'}
          weight='regular'
          size='captain1'
        >
          {value}
        </Typography>
      );
    },
  },
  {
    key: 'Status',
    title: 'Status',
    className: 'min-w-[60px] px-[12px] py-[8px]',
    render: ({ status }) => (
      <Typography color='green' weight='regular' size='captain1'>
        {capitalizeFirstLetter(status)}
      </Typography>
    ),
  },
  {
    key: 'Slippage',
    title: 'Slippage',
    className: 'min-w-[60px] px-[12px] py-[8px]',
    render: ({ slippage, taking_amount}, {rateUsd, rate}) => {
      const slippageUsd = (taking_amount * rate * rateUsd) * (slippage / 100);
      
      return (
        <Typography color='green' weight='regular' size='captain1'>
          {formatter.number.formatSmallNumber(slippageUsd)}$
          {/* 30$ */}
        </Typography>
      )
    },
  },
  {
    key: 'cancel',
    title: <></>,
    className: 'min-w-[60px] px-[12px] py-[8px]',
    render: ({ order_pubkey }) => <Cancel order_pubkey={order_pubkey} />,
  }
];

export const LimitOrders = () => {
  const [orders, rateUsd, token] = useUnit([$orders, $rate, $token]);

  return (
    <Table
      columns={columns}
      isOnce
      onLoaded={onLoadedFirst}
      rowsCount={7}
      data={orders}
      uniqueKey={({ id }) => id}
      reachedEndOfList={dataRanedOut}
      $isDataRanedOut={$isEndReached}
      additionalInfo={{ rate: token?.rate ?? 0, rateUsd: rateUsd ?? 0 }}
      noData={
        <div className="mt-[136px] flex h-full w-full flex-col items-center justify-center">
          <Icon name="no_transactions" size={55} />
          <Typography size="subheadline2" className="text-center" weight="regular" color="secondary">
            There are currently <br /> no order limits.
          </Typography>
        </div>
      }
    />
  );
};
