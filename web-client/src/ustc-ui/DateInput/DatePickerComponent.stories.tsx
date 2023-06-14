import { DatePickerComponent } from './DatePickerComponent';
import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof DatePickerComponent> = {
  component: DatePickerComponent,
  tags: ['autodocs'],
} satisfies Meta<typeof DatePickerComponent>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Standard: Story = {
  args: {},
};
