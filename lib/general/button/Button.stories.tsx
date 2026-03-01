import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn } from 'storybook/test';
import { UserIcon, PlayIcon, TrashIcon } from '@heroicons/react/16/solid';

import { Button } from './Button';

const meta = {
    title: 'General/Button',
    component: Button,
    tags: ['autodocs'],
    argTypes: {
        children: { control: 'text' },
        variant: {
            control: 'select',
            options: ['primary', 'secondary', 'danger', 'outline', 'transparent']
        },
        icon: {
            control: 'select',
            options: [undefined, 'UserIcon', 'PlayIcon', 'TrashIcon'],
            mapping: { UserIcon: UserIcon, PlayIcon: PlayIcon, TrashIcon: TrashIcon }
        },
        textDecoration: { control: 'boolean' },
        showChildren: { control: 'boolean' },
        additionalClassName: { control: 'text' },
        disabled: { control: 'boolean' },
        as: { control: 'select', options: [undefined, 'button', 'a'] }
    },
    args: { onClick: fn() }
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
    play: async ({ args, canvas, userEvent }) => {
        await expect(canvas.getByText('Button').tagName).toBe('BUTTON');
        await expect(canvas.getByText('Button')).toHaveClass('min-w-[32px] min-h-[32px]');
        await userEvent.click(canvas.getByText('Button'));
        await expect(canvas.getByText('Button')).not.toBeDisabled();
        await expect(args.onClick).toHaveBeenCalled();
    },
    args: {
        children: 'Button',
        variant: 'primary',
        disabled: false,
        onClick: fn()
    }
};

export const Disabled: Story = {
    play: async ({ args, canvas, userEvent }) => {
        await userEvent.click(canvas.getByText('Button'));
        await expect(canvas.getByText('Button')).toBeDisabled();
        await expect(args.onClick).not.toHaveBeenCalled();
    },
    args: {
        children: 'Button',
        variant: 'primary',
        disabled: true,
        onClick: fn()
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
    play: async ({ canvas }) => {
        await expect(canvas.getByTitle('Button')).toBeVisible();
    },
    args: {
        children: 'Button',
        variant: 'transparent',
        disabled: false,
        icon: UserIcon,
        showChildren: false
    }
};

export const PrimaryAsLink: Story = {
    play: async ({ canvas }) => {
        await expect(canvas.getByText('Button').tagName).toBe('A');
        await expect(canvas.getByText('Button')).toHaveAttribute('href', '#');
    },
    args: {
        as: 'a',
        children: 'Button',
        variant: 'primary',
        disabled: false,
        href: '#'
    }
};

export const IconWithCustomWidth: Story = {
    play: async ({ canvas }) => {
        await expect(canvas.getByTitle('Button')).toHaveClass('min-w-[24px] min-h-[24px]');
        await expect(canvas.getByTitle('Button')).not.toHaveClass('min-w-[32px] min-h-[32px]');
    },
    args: {
        children: 'Button',
        variant: 'outline',
        disabled: false,
        icon: UserIcon,
        showChildren: false,
        additionalClassName: 'min-w-[24px] min-h-[24px]'
    }
};
