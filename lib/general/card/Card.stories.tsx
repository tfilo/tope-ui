import { TrashIcon } from '@heroicons/react/16/solid';
import { expect, fn } from 'storybook/test';
import type { Meta, StoryObj } from '@storybook/react-vite';

import { Card } from './Card';
import { Grid } from '../../layout/grid';

const meta = {
    title: 'General/Card',
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
        const edit = canvas.getByTitle('Upraviť');
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
        await expect(canvas.queryByTitle('Upraviť')).toBeNull();
    },
    args: {
        description:
            'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Commodi alias, sed soluta non mollitia laborum necessitatibus officiis ...'
    }
};

export const WithTitle: Story = {
    args: {
        ...Default.args,
        title: 'Project overview'
    }
};

export const TitleOnly: Story = {
    args: {
        title: 'Project overview'
    }
};

export const RemoveAction: Story = {
    args: { title: 'Recipe photo', actionIcon: TrashIcon, actionLabel: 'Remove photo', onAction: fn() },
    play: async ({ args, canvas, userEvent }) => {
        const remove = canvas.getByRole('button', { name: 'Remove photo' });
        await userEvent.click(remove);
        await expect(args.onAction).toHaveBeenCalledOnce();
    }
};

export const ResponsiveLayout: Story = {
    args: { onClick: fn(), onAction: fn() },
    render: (args) => (
        <>
            <Card
                {...args}
                title='Raňajky'
                description='Jednoduchý začiatok dňa.'
            />
            <Card
                {...args}
                title='Domáci chlieb s bylinkovým maslom a čerstvou zeleninou'
                description='Chrumkavý chlieb podávame ešte teplý.'
            />
            <Card
                {...args}
                title='Zeleninová polievka'
                description='Mrkvu, zemiaky a sezónnu zeleninu pomaly varíme v domácom vývare. Na záver pridáme čerstvé bylinky a podávame s krajcom domáceho chleba.'
            />
        </>
    )
};

export const OriginalLayout: Story = {
    args: {
        compactOnMobile: false,
        title: 'Fotografia receptu',
        description: 'Pôvodný štvorcový vzhľad aj na mobile.',
        ariaLabel: 'Zobraziť fotografiu',
        onClick: fn(),
        onAction: fn()
    },
    play: async ({ args, canvas, userEvent }) => {
        const card = canvas.getByRole('button', { name: 'Zobraziť fotografiu' });
        const size = card.getBoundingClientRect();
        await expect(size.width).toBe(size.height);
        await userEvent.click(canvas.getByRole('button', { name: 'Upraviť' }));
        await expect(args.onAction).toHaveBeenCalledOnce();
        await expect(args.onClick).not.toHaveBeenCalled();
        await userEvent.click(card);
        await expect(args.onClick).toHaveBeenCalledOnce();
    }
};
