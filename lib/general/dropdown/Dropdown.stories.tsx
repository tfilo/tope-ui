import type { Meta, StoryObj } from '@storybook/react-vite';

import { Dropdown } from './Dropdown';
import { MapIcon, UserIcon } from '@heroicons/react/16/solid';

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
        children: 'Button',
        options: [
            { value: 'option1', label: 'Option 1', icon: UserIcon },
            { value: 'option2', label: 'Option 2', icon: MapIcon },
            { value: 'option3', label: 'Option 3', disabled: true }
        ],
        buttonProps: {
            variant: 'primary'
        }
    }
};
