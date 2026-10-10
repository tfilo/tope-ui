import type { Meta, StoryObj } from '@storybook/react-vite';

import { Select } from '../../form';
import { Column } from '../Column';
import { Grid } from './Grid';
import { useAppForm } from '../../hooks';

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
    render: () => {
        const form = useAppForm({ defaultValues: { basic1: '', basic2: '', basic3: '', basic4: '' } });
        return (
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    form.handleSubmit();
                }}
            >
                <Grid>
                    <Column key='1'>
                        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Commodi alias, sed soluta non mollitia laborum
                        necessitatibus officiis veniam nesciunt dolor sint natus, sequi doloremque.
                    </Column>
                    <Column
                        key='2'
                        colspan={2}
                    >
                        <form.AppField
                            name='basic1'
                            children={(field) => <field.TextArea label='Text textarea' />}
                        />
                    </Column>
                    <Column key='3'>
                        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Commodi alias, sed soluta non mollitia laborum
                        necessitatibus officiis veniam nesciunt dolor sint natus, sequi doloremque.
                    </Column>
                    <Column
                        key='4'
                        colspan={3}
                        className='bg-warning-light'
                    >
                        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Commodi alias, sed soluta non mollitia laborum
                        necessitatibus officiis veniam nesciunt dolor sint natus, sequi doloremque.
                    </Column>
                    <Column key='5'>
                        <form.AppField
                            name='basic3'
                            children={(field) => <field.Input label='Text input' />}
                        />
                    </Column>
                    <Column
                        key='6'
                        colspan={4}
                        className='bg-danger-light'
                    >
                        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Commodi alias, sed soluta non mollitia laborum
                        necessitatibus officiis veniam nesciunt dolor sint natus, sequi doloremque.
                    </Column>
                    <Column key='7'>
                        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Commodi alias, sed soluta non mollitia laborum
                        necessitatibus officiis veniam nesciunt dolor sint natus, sequi doloremque.
                    </Column>
                    <Column key='8'>
                        <Select
                            label='Test select'
                            options={[
                                { label: 'Option 1', value: '1' },
                                { label: 'Option 2', value: '2' },
                                { label: 'Option 3', value: '3' }
                            ]}
                        />
                    </Column>
                    <Column key='9'>
                        <form.AppField
                            name='basic4'
                            children={(field) => <field.Input label='Text input' />}
                        />
                    </Column>
                    <Column key='10'>
                        <form.AppField
                            name='basic2'
                            children={(field) => (
                                <field.TextArea
                                    label='Text textarea'
                                    maxLength={100}
                                    rows={8}
                                />
                            )}
                        />
                    </Column>
                    <Column
                        key='11'
                        colspan={4}
                        className='text-justify'
                    >
                        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Commodi alias, sed soluta non mollitia laborum
                        necessitatibus officiis veniam nesciunt dolor sint natus, sequi doloremque.
                    </Column>
                </Grid>
            </form>
        );
    }
};
