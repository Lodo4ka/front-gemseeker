import { Task } from './tasks';

export type CreateStreamFxParams = {
  name: string;
  tasks: Task[];
  address: string | null;
};
