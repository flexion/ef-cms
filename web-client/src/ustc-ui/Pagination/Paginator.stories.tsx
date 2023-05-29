import { Paginator } from './Paginator';
import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof Paginator> = {
  component: Paginator,
  parameters: {
    docs: {
      description: {
        component: "hi mom, I'm on tv!",
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Paginator>;

export default meta;
type Story = StoryObj<typeof meta>;

export const MultiplePages: Story = {
  args: {
    pageCount: 10,
  },
};

export const SinglePage: Story = {
  args: {
    pageCount: 0,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Pagination control should not appear when there is one or fewer pages of results.',
      },
    },
  },
};

export const DataSetsWithMoreThan20000Results: Story = {
  args: {
    marginPagesDisplayed: 0,
    pageCount: 950,
    pageRangeDisplayed: 0,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Pagination should limit control only to previous and next pages, and handle pagination on the back end.',
      },
    },
  },
};
