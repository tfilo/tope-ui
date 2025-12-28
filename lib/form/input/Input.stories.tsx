import type { Meta, StoryObj } from '@storybook/react-vite';

import { fn } from 'storybook/test';

import { Input } from './Input';
import { UserIcon, PlayIcon, TrashIcon } from '@heroicons/react/16/solid';

const meta = {
    title: 'Form/Input',
    component: Input,
    tags: ['autodocs'],
    argTypes: {
        disabled: { control: 'boolean' },
        startAction: {
            control: 'select',
            options: [undefined, 'UserIcon', 'PlayIcon', 'TrashIcon'],
            mapping: { UserIcon: UserIcon, PlayIcon: PlayIcon, TrashIcon: TrashIcon }
        },
        endAction: {
            control: 'select',
            options: [undefined, 'UserIcon', 'PlayIcon', 'TrashIcon'],
            mapping: { UserIcon: UserIcon, PlayIcon: PlayIcon, TrashIcon: TrashIcon }
        }
    },
    args: { onClick: fn() }
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Base: Story = {
    args: {
        disabled: false,
    }
};
