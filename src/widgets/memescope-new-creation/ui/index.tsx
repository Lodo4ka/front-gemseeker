import { QuickBuyButton } from "features/quick-buy";
import { formatter } from "shared/lib/formatter";
import { ColumnToken } from "shared/ui/column-token";
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
    key: 'Status',
    title: 'Status',
    className: 'min-w-[200px]',
    render: () => (
      <Typography size="subheadline2" weight="regular">
        {formatter.number.uiDefault(0)}%
      </Typography>
    ),
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
    key: 'SOLBal',
    title: 'SOL Bal',
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
    key: '1hTXs',
    title: '1h TXs',
    className: 'min-w-[100px]',
    render: () => (
      <Typography size="subheadline2" weight="regular">
        {formatter.number.uiDefault(244)}
      </Typography>
    ),
  },
  {
    key: '1hVol',
    title: '1h Vol',
    className: 'min-w-[100px]',
    render: () => (
      <Typography size="subheadline2" weight="regular" color="secondary">
        {formatter.number.uiDefault(664)}
      </Typography>
    ),
  },
  {
    key: 'MCap',
    title: 'M. Cap',
    className: 'min-w-[100px]',
    render: () => (
      <Typography size="subheadline2" weight="regular" color="secondary">
        {formatter.number.uiDefault(19_943)}
      </Typography>
    ),
  },
  {
    key: 'Last',
    title: 'Last',
    className: 'min-w-[100px]',
    render: () => (
      <Typography size="subheadline2" weight="regular" color="green">
        4s 
      </Typography>
    ),
  },
  {
    key: 'Dev',
    title: 'Dev',
    className: 'min-w-[100px]',
    render: () => (
      <Typography size="subheadline2" weight="regular" color="red">
        
      </Typography>
    ),
  },
  {
    key: 'QuickBuy',
    title: 'Quick Buy',
    render: () => <QuickBuyButton address={''} />,
  },
];

export const MemescopeNewCreation = () => {
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