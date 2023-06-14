import { DollarsInput } from './DollarsInput';
import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof DollarsInput> = {
  component: DollarsInput,
  tags: ['autodocs'],
} satisfies Meta<typeof DollarsInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Standard: Story = {
  args: {},
};
