import { DateInput } from './DateInput';
import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof DateInput> = {
  component: DateInput,
  tags: ['autodocs'],
} satisfies Meta<typeof DateInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Standard: Story = {
  args: {
    id: 'an id',
    label: 'this is a date input',
    names: {
      day: 'irsDay',
      month: 'irsMonth',
      year: 'irsYear',
    },
    values: {
      day: 'irsDay',
      month: 'irsMonth',
      year: 'irsYear',
    },
  },
};
