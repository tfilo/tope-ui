import type { Meta, StoryObj } from '@storybook/react-vite';

import { Grid } from './Grid';
import { Column } from '../Column';
import { Input, Select, TextArea } from '../../form';

const meta = {
    title: 'Layout/Grid',
    component: Grid,
    tags: ['autodocs'],
    argTypes: {
        maxRows: { control: 'select', options: [1, 2, 4] }
    }
} satisfies Meta<typeof Grid>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        children: [
            <Column key='1'>
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Commodi alias, sed soluta non mollitia laborum necessitatibus
                officiis veniam nesciunt dolor sint natus, sequi doloremque.
            </Column>,
            <Column
                key='2'
                colspan={2}
            >
                <TextArea label='Test textarea' />
            </Column>,
            <Column key='3'>
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Commodi alias, sed soluta non mollitia laborum necessitatibus
                officiis veniam nesciunt dolor sint natus, sequi doloremque.
            </Column>,
            <Column
                key='4'
                colspan={3}
                className='bg-warning-light'
            >
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Commodi alias, sed soluta non mollitia laborum necessitatibus
                officiis veniam nesciunt dolor sint natus, sequi doloremque.
            </Column>,
            <Column key='5'>
                <Input label='Test input' />
            </Column>,
            <Column
                key='6'
                colspan={4}
                className='bg-danger-light'
            >
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Commodi alias, sed soluta non mollitia laborum necessitatibus
                officiis veniam nesciunt dolor sint natus, sequi doloremque.
            </Column>,
            <Column key='7'>
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Commodi alias, sed soluta non mollitia laborum necessitatibus
                officiis veniam nesciunt dolor sint natus, sequi doloremque.
            </Column>,
            <Column key='8'>
                <Select
                    label='Test select'
                    options={[
                        { label: 'Option 1', value: '1' },
                        { label: 'Option 2', value: '2' },
                        { label: 'Option 3', value: '3' }
                    ]}
                />
            </Column>,
            <Column key='9'>
                <Input label='Test input' />
            </Column>,
            <Column key='10'>
                <TextArea
                    label='Test textarea'
                    maxLength={100}
                    rows={8}
                />
            </Column>,
            <Column
                key='11'
                colspan={4}
                className='text-justify'
            >
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Commodi alias, sed soluta non mollitia laborum necessitatibus
                officiis veniam nesciunt dolor sint natus, sequi doloremque.
            </Column>
        ]
    }
};
