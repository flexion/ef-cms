import { Icon } from './Icon';
import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof Icon> = {
  component: Icon,
  tags: ['autodocs'],
} satisfies Meta<typeof Icon>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Standard: Story = {
  args: {},
};
