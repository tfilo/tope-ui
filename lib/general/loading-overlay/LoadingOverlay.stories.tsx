import { expect, fn } from 'storybook/test';
import type { Meta, StoryObj } from '@storybook/react-vite';

import { Button } from '..';
import { localization } from '../../utils/constants';
import { Content } from '../../layout/content';
import { Header } from '../../layout/header';
import { Page } from '../../layout/page';
import { LoadingOverlay } from './LoadingOverlay';

const meta = {
    title: 'General/LoadingOverlay',
    component: LoadingOverlay,
    tags: ['autodocs'],
    parameters: { layout: 'fullscreen' },
    args: { active: true },
    decorators: [
        (Story, { args }) => (
            <div className='flex min-h-screen flex-col'>
                <Header
                    onProfile={fn()}
                    onLogout={fn()}
                />
                <main className='relative flex flex-1 flex-col'>
                    <div
                        inert={args.active}
                        aria-busy={args.active}
                    >
                        <Content>
                            <Page title='Vehicle expenses'>
                                <p>The previous page stays visible beneath the overlay.</p>
                                <Button onClick={fn()}>Save</Button>
                            </Page>
                        </Content>
                    </div>
                    <Story />
                </main>
            </div>
        )
    ]
} satisfies Meta<typeof LoadingOverlay>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    play: async ({ canvas }) => {
        const status = await canvas.findByRole('status');

        await expect(status).toBeVisible();
        await expect(status).toHaveTextContent(localization.loading);
        await expect(canvas.getByRole('button', { name: localization.profile })).toBeEnabled();
    }
};

export const Inactive: Story = {
    args: { active: false },
    play: async ({ canvas }) => {
        await expect(canvas.queryByRole('status', { hidden: true })).toBeNull();
        await expect(canvas.getByRole('button', { name: 'Save' })).toBeEnabled();
    }
};

export const CustomLabel: Story = {
    args: { label: 'Loading your vehicles…' },
    play: async ({ args, canvas }) => {
        const status = await canvas.findByRole('status');

        await expect(status).toBeVisible();
        await expect(status).toHaveTextContent(args.label!);
    }
};
