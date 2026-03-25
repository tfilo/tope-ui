import type { Meta, StoryObj } from '@storybook/react-vite';

import { Dropdown } from './Dropdown';
import { MapIcon, UserIcon } from '@heroicons/react/16/solid';
import { expect, fn } from 'storybook/test';

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
    play: async ({ args, canvas, userEvent }) => {
        await expect(canvas.getByText('Button').tagName).toBe('BUTTON');
        await userEvent.click(canvas.getByText('Button'));
        await new Promise((resolve) => setTimeout(resolve, 800));

        await expect(canvas.queryAllByRole('button').length).toBe(4);
        canvas
            .queryAllByRole('button')
            .find((item) => item.textContent === 'Option 1')
            ?.click();

        await expect(args.options[0].action).toHaveBeenCalled();
        await new Promise((resolve) => setTimeout(resolve, 800));
        await expect(canvas.queryAllByRole('button').length).toBe(1);

        await userEvent.click(canvas.getByText('Button'));
        await new Promise((resolve) => setTimeout(resolve, 800));
        canvas
            .queryAllByRole('button')
            .find((item) => item.textContent === 'Option 2')
            ?.click();

        await expect(args.options[1].action).toHaveBeenCalled();
        await new Promise((resolve) => setTimeout(resolve, 800));
        await expect(canvas.queryAllByRole('button').length).toBe(1);

        await userEvent.click(canvas.getByText('Button'));
        await new Promise((resolve) => setTimeout(resolve, 800));
        canvas
            .queryAllByRole('button')
            .find((item) => item.textContent === 'Option 3')
            ?.click();

        await expect(args.options[2].action).not.toHaveBeenCalled();
        await new Promise((resolve) => setTimeout(resolve, 800));
        await expect(canvas.queryAllByRole('button').length).toBe(4);
    },
    args: {
        children: 'Button',
        options: [
            {
                value: 'option1',
                label: 'Option 1',
                icon: UserIcon,
                action: fn()
            },
            {
                value: 'option2',
                label: 'Option 2',
                icon: MapIcon,
                action: fn()
            },
            {
                value: 'option3',
                label: 'Option 3',
                disabled: true,
                action: fn()
            }
        ],
        buttonProps: {
            variant: 'primary'
        }
    }
};

export const Disabled: Story = {
    play: async ({ canvas, userEvent }) => {
        await expect(canvas.getByText('Button').tagName).toBe('BUTTON');
        await userEvent.click(canvas.getByText('Button'));
        await new Promise((resolve) => setTimeout(resolve, 800));
        await expect(canvas.queryAllByRole('button').length).toBe(1);
    },
    args: {
        children: 'Button',
        options: [
            {
                value: 'option1',
                label: 'Option 1',
                icon: UserIcon,
                action: fn()
            },
            {
                value: 'option2',
                label: 'Option 2',
                icon: MapIcon,
                action: fn()
            },
            {
                value: 'option3',
                label: 'Option 3',
                disabled: true,
                action: fn()
            }
        ],
        buttonProps: {
            variant: 'primary',
            disabled: true
        }
    }
};
