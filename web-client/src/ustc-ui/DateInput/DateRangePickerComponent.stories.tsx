import { DateRangePickerComponent } from './DateRangePickerComponent';
import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof DateRangePickerComponent> = {
  component: DateRangePickerComponent,
  tags: ['autodocs'],
} satisfies Meta<typeof DateRangePickerComponent>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Standard: Story = {
  args: {},
};
