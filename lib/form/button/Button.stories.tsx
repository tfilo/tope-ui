import type { Meta, StoryObj } from '@storybook/react-vite';

import { fn } from 'storybook/test';

import { Button } from './Button';
import { UserIcon, PlayIcon, TrashIcon } from '@heroicons/react/16/solid';

const meta = {
    title: 'Form/Button',
    component: Button,
    tags: ['autodocs'],
    argTypes: {
        children: { control: 'text' },
        disabled: { control: 'boolean' },
        as: { control: 'select', options: [undefined, 'button', 'a'] },
        variant: {
            control: 'select',
            options: ['primary', 'secondary', 'danger', 'outline', 'transparent']
        },
        icon: {
            control: 'select',
            options: [undefined, 'UserIcon', 'PlayIcon', 'TrashIcon'],
            mapping: { UserIcon: UserIcon, PlayIcon: PlayIcon, TrashIcon: TrashIcon }
        },
        hideChildren: { control: 'boolean' },
        underline: { control: 'boolean' }
    },
    args: { onClick: fn() }
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
    args: {
        children: 'Button',
        variant: 'primary',
        disabled: false
    }
};

export const Secondary: Story = {
    args: {
        children: 'Button',
        variant: 'secondary',
        disabled: false
    }
};

export const Danger: Story = {
    args: {
        children: 'Button',
        variant: 'danger',
        disabled: false
    }
};

export const Outline: Story = {
    args: {
        children: 'Button',
        variant: 'outline',
        disabled: false
    }
};

export const Transparent: Story = {
    args: {
        children: 'Button',
        variant: 'transparent',
        disabled: false
    }
};

export const PrimaryWithIcon: Story = {
    args: {
        children: 'Button',
        variant: 'primary',
        disabled: false,
        icon: UserIcon
    }
};

export const TransparentIconOnly: Story = {
    args: {
        children: 'Button',
        variant: 'transparent',
        disabled: false,
        icon: UserIcon,
        hideChildren: true
    }
};
