import type { Meta, StoryObj } from '@storybook/react-vite';

import { Tag } from './Tag';
import { expect, fn } from 'storybook/test';

const meta = {
    title: 'Visual/Tag',
    component: Tag,
    tags: ['autodocs'],
    argTypes: {
        label: { control: 'text' },
        disabled: { control: 'boolean' },
        variant: {
            control: 'select',
            options: ['primary', 'secondary', 'danger', 'outline']
        }
    }
} satisfies Meta<typeof Tag>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
    play: async ({ args, canvas, userEvent }) => {
        await expect(canvas.getByText('Primary Tag').tagName).toBe('BUTTON');
        await expect(canvas.getByText('Primary Tag')).toHaveClass('cursor-pointer');
        await userEvent.click(canvas.getByText('Primary Tag'));
        await expect(canvas.getByText('Primary Tag')).not.toBeDisabled();
        await expect(args.onClick).toHaveBeenCalled();

        await expect(canvas.getByLabelText('Remove Primary Tag').tagName).toBe('BUTTON');
        await userEvent.click(canvas.getByLabelText('Remove Primary Tag'));
        await expect(args.onRemove).toHaveBeenCalled();
    },
    args: {
        label: 'Primary Tag',
        onRemove: fn(),
        disabled: false,
        variant: 'primary',
        onClick: fn()
    }
};

export const Secondary: Story = {
    args: {
        label: 'Secondary Tag',
        onRemove: fn(),
        disabled: false,
        variant: 'secondary',
        onClick: fn()
    }
};

export const Danger: Story = {
    args: {
        label: 'Danger Tag',
        onRemove: fn(),
        disabled: false,
        variant: 'danger',
        onClick: fn()
    }
};

export const Outline: Story = {
    args: {
        label: 'Outline Tag',
        onRemove: fn(),
        disabled: false,
        variant: 'outline',
        onClick: fn()
    }
};

export const Disabled: Story = {
    play: async ({ args, canvas, userEvent }) => {
        await expect(canvas.getByText('Disabled Tag').tagName).toBe('BUTTON');
        await expect(canvas.getByText('Disabled Tag')).toHaveClass('cursor-pointer');
        await userEvent.click(canvas.getByText('Disabled Tag'));
        await expect(canvas.getByText('Disabled Tag')).toBeDisabled();
        await expect(args.onClick).not.toHaveBeenCalled();
        await expect(canvas.queryByLabelText('Remove Disabled Tag')).toBe(null);
    },
    args: {
        label: 'Disabled Tag',
        onRemove: fn(),
        disabled: true,
        variant: 'primary',
        onClick: fn()
    }
};

export const WithoutRemove: Story = {
    play: async ({ canvas }) => {
        await expect(canvas.queryByLabelText('No Remove Tag')).toBe(null);
    },
    args: {
        label: 'No Remove Tag',
        disabled: false,
        variant: 'primary',
        onClick: fn()
    }
};

export const WithoutInteraction: Story = {
    play: async ({ canvas }) => {
        await expect(canvas.getByText('No interaction Tag').tagName).toBe('BUTTON');
        await expect(canvas.getByText('No interaction Tag')).not.toHaveClass('cursor-pointer');
        await expect(canvas.queryByLabelText('No interaction Tag')).toBe(null);
    },
    args: {
        label: 'No interaction Tag',
        disabled: false,
        variant: 'primary'
    }
};
