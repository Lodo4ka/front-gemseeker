import { QuickBuyButton } from "features/quick-buy";
import { formatter } from "shared/lib/formatter";
import { ColumnToken } from "shared/ui/column-token";
import { Icon } from "shared/ui/icon";
import { Column, Table } from "shared/ui/table"
import { Typography } from "shared/ui/typography";

export const columns: Column<number>[] = [
  {
    key: 'PairInfo',
    title: 'Pair Info',
    className: 'min-w-[200px]',
    render: () => {
      const props = {
        photo_hash: '', 
        name: 'Name', 
        symbol: 'NME', 
        address: '',
        twitter: '',
        website: '',
        telegram: '',
        bounding_curve: 0,
        isPlay:false
      }
        
      return <ColumnToken {...props} />
    },
  },
  {
    key: 'Age',
    title: 'Age',
    className: 'min-w-[200px]',
    render: () => (
      <Typography size="subheadline2" weight="regular" color='green'>
        12s
      </Typography>
    ),
  },
  {
    key: 'Liq/Initial',
    title: 'Liq/Initial',
    className: 'min-w-[200px]',
    render: () => (
      <div className="flex flex-col gap-[4px]">
        <Typography
          icon={{name: "solana", size: 16, position: 'left'}}
          weight="regular"
        >
          701.9/79
        </Typography>
        <Typography color="green" weight="regular" size="captain1">+795.5%</Typography>
      </div> 
    ),
  },
  {
    key: 'M.Cap',
    title: 'M.Cap',
    className: 'min-w-[100px]',
    render: () => (
      <Typography size="subheadline2" weight="regular">
        {formatter.number.uiDefault(7.5)}
      </Typography>
    ),
  },
  {
    key: 'Holders',
    title: 'Holders',
    className: 'min-w-[100px]',
    render: () => (
      <Typography size="subheadline2" weight="regular" color="secondary">
        {formatter.number.uiDefault(5554)}
      </Typography>
    ),
  },
  {
    key: '24hTXs',
    title: '24h TXs',
    className: 'min-w-[100px]',
    render: () => (
      <div className="flex flex-col gap-[4px]">
        <Typography
          weight="regular"
        >
          {formatter.number.uiDefault(2871)}
        </Typography>
        <div className="flex gap-[2.5px]">
          <Typography color="green" weight="regular" size="captain1">{formatter.number.uiDefault(1554)} /</Typography>
          <Typography color="red" weight="regular" size="captain1"> {formatter.number.uiDefault(1617)}</Typography>
        </div>
      </div> 
    ),
  },
  {
    key: '24hVol',
    title: '24h Vol',
    className: 'min-w-[100px]',
    render: () => (
      <Typography size="subheadline2" weight="regular" color="secondary">
        {formatter.number.uiDefault(1_200_000)}
      </Typography>
    ),
  },
  {
    key: 'Price',
    title: 'Price',
    className: 'min-w-[100px]',
    render: () => (
      <Typography size="subheadline2" weight="regular" color="secondary">
        $0.0₅2924
      </Typography>
    ),
  }, 
  {
    key: '1m%',
    title: '1m%',
    className: 'min-w-[100px]',
    render: () => (
      <Typography size="subheadline2" weight="regular" color="green">
        +5.9%
      </Typography>
    ),
  },
  {
    key: '5m%',
    title: '5m%',
    className: 'min-w-[100px]',
    render: () => (
      <Typography size="subheadline2" weight="regular" color="green">
        +5.9%
      </Typography>
    ),
  },
  {
    key: '1h%',
    title: '1h%',
    className: 'min-w-[100px]',
    render: () => (
      <Typography size="subheadline2" weight="regular" color="green">
        {'+>99k%'}
      </Typography>
    ),
  },
  {
    key: 'Degen Audit',
    title: 'DegenAudit',
    className: 'min-w-[46px] max-w-[60px]',
    render: () => (
      <div className="flex flex-col gap-[4px]">
        <Icon 
          name='successToast'
          className="text-green"
        />
        <Typography size="captain2" weight="semibold">Mint Auth Disabled</Typography>
      </div>
    ),
  },
  {
    key: 'QuickBuy',
    title: 'Quick Buy',
    render: () => <QuickBuyButton address={''} />,
  }, 
];

export const MemescopeCompleted = () => {
    const data = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

    return(
        <>
            <Table
                columns={columns}
                data={data}
            />
        </>
    )
}