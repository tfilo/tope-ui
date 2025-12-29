import type { Meta, StoryObj } from '@storybook/react-vite';

import { fn } from 'storybook/test';

import { Input } from './Input';
import { UserIcon, PlayIcon, TrashIcon, PlusCircleIcon, MagnifyingGlassIcon, EyeIcon } from '@heroicons/react/16/solid';

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
    }
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
    args: {
        label: 'Some basic input',
        name: 'basic'
    }
};

export const Required: Story = {
    args: {
        label: 'This is required input',
        required: true
    }
};

export const Placeholder: Story = {
    args: {
        label: 'Some basic input',
        placeholder: 'This is placeholder...'
    }
};

export const WithStartAction: Story = {
    args: {
        label: 'Input with action',
        placeholder: 'This is placeholder...',
        startAction: { icon: MagnifyingGlassIcon, title: 'User' }
    }
};

export const WithEndAction: Story = {
    args: {
        label: 'Input with action',
        placeholder: 'This is placeholder...',
        endAction: { icon: EyeIcon, title: 'User' }
    }
};

export const WithMultipleActions: Story = {
    args: {
        label: 'Input Label',
        startAction: [
            { icon: MagnifyingGlassIcon, title: 'I am just icon' },
            {
                icon: PlusCircleIcon,
                onClick: () => {
                    alert('Add item was clicked');
                },
                title: 'Click me'
            }
        ],
        endAction: [
            { icon: EyeIcon, onClick: fn(), title: 'I am button but do nothing' },
            {
                icon: UserIcon,
                onClick: () => {
                    return new Promise<void>((resolve) => {
                        setTimeout(() => resolve(), 2000);
                    });
                },
                title: 'I will be disabled after click for 2 seconds'
            }
        ]
    }
};

export const Error: Story = {
    args: {
        label: 'Label',
        required: true,
        placeholder: 'This is placeholder...',
        error: 'This field is required!'
    }
};

export const InputOnly: Story = {
    args: {}
};
