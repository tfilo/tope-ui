import type { Meta, StoryObj } from '@storybook/react-vite';

import { Flex } from './Flex';
import { Button } from '../../form';

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
    render: (args) => (
        <Flex {...args}>
            <Button variant='primary'>Button 1</Button>
            <Button variant='secondary'>Button 2</Button>
            <Button variant='outline'>Button 3</Button>
        </Flex>
    ),
    args: {
        direction: 'row',
        gap: 'md',
        justify: 'end'
    }
};

export const DirectionRowCenter: Story = {
    render: (args) => (
        <Flex {...args}>
            <Button variant='primary'>Button 1</Button>
            <Button variant='secondary'>Button 2</Button>
            <Button variant='outline'>Button 3</Button>
        </Flex>
    ),
    args: {
        direction: 'row',
        gap: 'md',
        justify: 'center'
    }
};

export const DirectionRowBetween: Story = {
    render: (args) => (
        <Flex {...args}>
            <Button variant='primary'>Button 1</Button>
            <Button variant='secondary'>Button 2</Button>
            <Button variant='outline'>Button 3</Button>
        </Flex>
    ),
    args: {
        direction: 'row',
        gap: 'md',
        justify: 'between'
    }
};

export const DirectionColumn: Story = {
    render: (args) => (
        <Flex {...args}>
            <Button variant='primary'>Button 1</Button>
            <Button variant='secondary'>Button 2</Button>
            <Button variant='outline'>Button 3</Button>
        </Flex>
    ),
    args: {
        direction: 'column',
        gap: 'md'
    }
};
