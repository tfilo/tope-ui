import type { Meta, StoryObj } from '@storybook/react-vite';

import { Card } from './Card';
import { expect, fn } from 'storybook/test';
import { Grid } from '../Grid';

const meta = {
    title: 'Layout/Card',
    component: Card,
    tags: ['autodocs'],
    decorators: [
        (Story) => (
            <Grid>
                <Story />
            </Grid>
        )
    ]
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    play: async ({ args, canvas, userEvent }) => {
        const edit = canvas.getByTitle('Edit');
        await expect(edit.tagName).toBe('BUTTON');
        await userEvent.click(edit);
        await expect(args.onAction).toHaveBeenCalled();

        await expect(args.onClick).not.toHaveBeenCalled();
        const card = canvas.getByText('Lorem ipsum dolor sit amet', { exact: false }).parentElement!.parentElement!;
        await expect(card.tagName).toBe('BUTTON');
        await userEvent.click(card);
        await expect(args.onClick).toHaveBeenCalled();
    },
    args: {
        description:
            'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Commodi alias, sed soluta non mollitia laborum necessitatibus officiis ...',
        onClick: fn(),
        onAction: fn()
    }
};

export const NonInteractiveCard: Story = {
    play: async ({ canvas }) => {
        const card = canvas.getByText('Lorem ipsum dolor sit amet', { exact: false }).parentElement!.parentElement!;
        await expect(card.tagName).toBe('DIV');
        await expect(canvas.queryByTitle('Edit')).toBeNull();
    },
    args: {
        description:
            'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Commodi alias, sed soluta non mollitia laborum necessitatibus officiis ...'
    }
};
