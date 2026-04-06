import type { Meta, StoryObj } from '@storybook/react-vite';

import { Column } from './Column';
import { Grid } from '../Grid';
import { Input, TextArea } from '../../form';

const meta = {
    title: 'Layout/Column',
    component: Column,
    tags: ['autodocs'],
    decorators: [
        (Story) => (
            <Grid>
                <Story />
            </Grid>
        )
    ]
} satisfies Meta<typeof Column>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        children:
            'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Commodi alias, sed soluta non mollitia laborum necessitatibus officiis veniam nesciunt dolor sint natus, sequi doloremque. Provident expedita excepturi eum ratione sequi.'
    }
};

export const ColSpan2: Story = {
    args: {
        children: Default.args?.children,
        colspan: 2
    }
};

export const ColSpan3: Story = {
    args: {
        children: Default.args?.children,
        colspan: 3
    }
};

export const ColSpan4: Story = {
    args: {
        children: Default.args?.children,
        colspan: 4
    }
};

export const ColumnWithInput: Story = {
    args: {
        children: <Input label='Test input' />,
        colspan: 1
    }
};

export const ColumnWithTextarea: Story = {
    args: {
        children: <TextArea label='Test input' />,
        colspan: 1
    }
};
