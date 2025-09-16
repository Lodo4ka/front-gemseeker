import { Meta, StoryObj } from '@storybook/react';
import { CenterDecorator } from 'shared/config/storybook';

import { Logo } from '.';

const meta: Meta<typeof Logo> = {
  title: 'shared/Logo',
  decorators: [CenterDecorator],
  tags: ['autodocs'],
  component: Logo,
  args: {
    className: '',
    size: 'full'
  },
  argTypes: {
    size: {
      options: ['small', 'full'],
      control: 'select',
      defaultValue: 'full',
      description: 'Размер'
    },
    className: {
      description: 'Сторонний класс'
    }
  }
};

export default meta;

type Story = StoryObj<typeof Logo>;

export const Default: Story = {};
