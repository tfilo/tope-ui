import type { Meta, StoryObj } from '@storybook/react-vite';

import { List } from './List';
import { expect } from 'storybook/test';

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
    play: async ({ canvas }) => {
        await expect(canvas.getByText('Item 1').tagName).toBe('LI');
        await expect(canvas.getByText('Item 2').tagName).toBe('LI');
        await expect(canvas.getByText('Item 3').tagName).toBe('LI');

        await expect(canvas.getByText('Item 1').parentElement?.tagName).toBe('UL');
    },
    args: {
        items: ['Item 1', 'Item 2', 'Item 3'],
        listType: 'unordered'
    }
};

export const Ordered: Story = {
    play: async ({ canvas }) => {
        await expect(canvas.getByText('Item 1').tagName).toBe('LI');
        await expect(canvas.getByText('Item 2').tagName).toBe('LI');
        await expect(canvas.getByText('Item 3').tagName).toBe('LI');

        await expect(canvas.getByText('Item 1').parentElement?.tagName).toBe('OL');
    },
    args: {
        items: ['Item 1', 'Item 2', 'Item 3'],
        listType: 'ordered'
    }
};
