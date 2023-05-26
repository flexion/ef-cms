import { Button } from './Button';
import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof Button> = {
  argTypes: {
    children: { control: 'label' },
    tooltip: { control: 'tool tip' },
  },
  component: Button,
  tags: ['autodocs'],
  title: 'Button',
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Active: Story = {
  args: {
    children: 'Submit',
  },
};

export const Disabled: Story = {
  args: {
    ...Active.args,
    disabled: true,
  },
};
