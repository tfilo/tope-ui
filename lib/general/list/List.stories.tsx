import type { Meta, StoryObj } from '@storybook/react-vite';

import { List } from './List';

const meta = {
    title: 'General/List',
    component: List,
    tags: ['autodocs'],
    argTypes: {
        listType: {
            control: 'select',
            options: ['unordered', 'ordered']
        }
    }
} satisfies Meta<typeof List>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Unordered: Story = {
    args: {
        items: ['Item 1', 'Item 2', 'Item 3'],
        listType: 'unordered'
    }
};

export const Ordered: Story = {
    args: {
        items: ['Item 1', 'Item 2', 'Item 3'],
        listType: 'ordered'
    }
};
