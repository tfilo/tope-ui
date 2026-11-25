import type { Meta, StoryObj } from '@storybook/react-vite';

import { Button } from '../../general';
import { Flex } from './Flex';

const meta = {
    title: 'Layout/Flex',
    component: Flex,
    tags: ['autodocs'],
    argTypes: {
        children: { control: 'text' },
        direction: {
            control: 'select',
            options: ['row', 'column']
        },
        gap: {
            control: 'select',
            options: ['sm', 'md', 'lg', 'xl']
        }
    }
} satisfies Meta<typeof Flex>;

export default meta;
type Story = StoryObj<typeof meta>;

export const DirectionRow: Story = {
    args: {
        direction: 'row',
        gap: 'md',
        justify: 'end',
        children: [
            <Button
                key='b1'
                variant='primary'
            >
                Button 1
            </Button>,
            <Button
                key='b2'
                variant='secondary'
            >
                Button 2
            </Button>,
            <Button
                key='b3'
                variant='outline'
            >
                Button 3
            </Button>
        ]
    }
};

export const DirectionRowCenter: Story = {
    args: {
        direction: 'row',
        gap: 'md',
        justify: 'center',
        children: DirectionRow.args?.children
    }
};

export const DirectionRowBetween: Story = {
    args: {
        direction: 'row',
        gap: 'md',
        justify: 'between',
        children: DirectionRow.args?.children
    }
};

export const DirectionColumn: Story = {
    args: {
        direction: 'column',
        gap: 'md',
        children: DirectionRow.args?.children
    }
};
