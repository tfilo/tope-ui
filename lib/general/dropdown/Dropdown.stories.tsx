import type { Meta, StoryObj } from '@storybook/react-vite';

import { Dropdown } from './Dropdown';

const meta = {
    title: 'General/Dropdown',
    component: Dropdown,
    tags: ['autodocs'],
    argTypes: {
        children: { control: 'text' }
    }
} satisfies Meta<typeof Dropdown>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
    args: {
        children: 'TODO'
    }
};
