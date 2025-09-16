import { Typography } from 'shared/ui/typography';
import { Column, Table } from 'shared/ui/table';
import { Maker } from 'shared/ui/maker';
// import { onLoaded } from '../model';

export const columns: Column<any>[] = [
  {
    key: 'Holders',
    title: 'Holders',
    className: 'w-[30%]',
    render: ({user, type, maker}) => <Maker 
      type={type} 
      user_id={user.user_id} 
      maker={maker ?? ''} 
    />,
  },
  {
    key: '%Owned',
    title: '%Owned',
    className: 'w-[30%]',
    render: () => <Typography weight="regular">00.00%</Typography>,
  },
  {
    key: 'Amount',
    title: 'Amount',
    className: 'w-[30%]',
    render: () => <Typography weight="regular">00M</Typography>,
  },
  {
    key: 'Value',
    title: 'Value',
    className: 'w-[20%]',
    render: () => <Typography weight="regular">$00.000</Typography>,
  },
];
export const Holders = () => {
  // onLoaded={onLoaded}
  return <Table columns={columns} isOnce={false} rowsCount={4} data={[1, 2, 3, 4, 5]} />;
};
