import { ConsolidatedCaseIcon } from './ConsolidatedCaseIcon';
import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof ConsolidatedCaseIcon> = {
  component: ConsolidatedCaseIcon,
  tags: ['autodocs'],
} satisfies Meta<typeof ConsolidatedCaseIcon>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Standard: Story = {
  args: {},
};
