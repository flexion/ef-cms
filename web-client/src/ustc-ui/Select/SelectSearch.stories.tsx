import { SelectSearch } from './SelectSearch';
import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof SelectSearch> = {
  component: SelectSearch,
  parameters: {
    docs: {
      description: {
        component: `This dropdown allows for searching through its options. 
            Options who start with the search query are pushed to the top of the list.`,
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof SelectSearch>;

export default meta;
type Story = StoryObj<typeof meta>;

export const FlatOptions: Story = {
  args: {
    options: [
      {
        label: 'Gannon Byers',
        value: 'Gannon Byers',
      },
      {
        label: 'Stephen Keith',
        value: 'Stephen Keith',
      },
      {
        label: 'Blossom Pena',
        value: 'Blossom Pena',
      },
      {
        label: 'Nora Witt',
        value: 'Nora Witt',
      },
      {
        label: 'Reece Rodriguez',
        value: 'Reece Rodriguez',
      },
    ],
  },
  parameters: {
    docs: {
      description: {
        story: '',
      },
    },
  },
};

export const WithSearchableOptions: Story = {
  args: {
    options: [
      {
        label: 'Group 1',
        options: [
          { label: 'Group 1, option 1', value: 'value_1' },
          { label: 'Group 1, option 2', value: 'value_2' },
        ],
      },
      { label: 'A root option', value: 'value_3' },
      { label: 'Another root option', value: 'value_4' },
      {
        label: 'Group 2',
        options: [
          { label: 'Group 2, option 1', value: 'value_5' },
          { label: 'Group 2, option 2', value: 'value_6' },
        ],
      },
    ],
    searchableOptions: [
      { label: 'Group 1, option 1', value: 'value_1' },
      { label: 'Group 1, option 2', value: 'value_2' },
      { label: 'A root option', value: 'value_3' },
      { label: 'Another root option', value: 'value_4' },
      { label: 'Group 2, option 1', value: 'value_5' },
      { label: 'Group 2, option 2', value: 'value_6' },
    ],
  },
  parameters: {
    docs: {
      description: {
        story: `Searchable options are shown in the dropdown when input is added to the search box. 
          This is useful if, for example, the initially-displayed options are categorized.`,
      },
    },
  },
};
