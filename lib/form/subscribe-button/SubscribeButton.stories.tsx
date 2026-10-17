import { expect, fn } from 'storybook/test';
import type { Meta, StoryObj } from '@storybook/react-vite';

import { useAppForm } from '../../hooks/form';
import { SubscribeButton } from './SubscribeButton';

type SubscribeButtonProps = React.ComponentProps<typeof SubscribeButton>;

const meta = {
    title: 'Form/SubscribeButton',
    component: SubscribeButton,
    tags: ['autodocs'],
    argTypes: {
        disabled: { control: 'boolean' }
    },
    render: (args: SubscribeButtonProps, { parameters }) => {
        const form = useAppForm({
            defaultValues: { basic: '' },
            onSubmit: ({ value }) => {
                parameters.onSubmit?.(value);
            }
        });

        return (
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    form.handleSubmit();
                }}
            >
                <h1>Simple form</h1>
                <form.AppField
                    name='basic'
                    children={(field) => <field.Input />}
                />
                <br />
                <form.AppForm>
                    <form.SubscribeButton {...args} />
                </form.AppForm>
            </form>
        );
    }
} satisfies Meta<typeof SubscribeButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
    play: async ({ parameters, canvas, userEvent }) => {
        await expect(canvas.getByText('Submit')).toBeVisible();
        await expect(canvas.getByText('Submit').tagName).toBe('BUTTON');
        await expect(parameters.onSubmit).toHaveBeenCalledTimes(0);
        await userEvent.click(canvas.getByText('Submit'));
        await expect(parameters.onSubmit).toHaveBeenCalledTimes(1);
        await expect(parameters.onSubmit).toHaveBeenCalledWith({ basic: '' });

        await userEvent.type(canvas.getByRole('textbox'), 'This is some text');
        await userEvent.click(canvas.getByText('Submit'));
        await expect(parameters.onSubmit).toHaveBeenCalledTimes(2);
        await expect(parameters.onSubmit).toHaveBeenCalledWith({ basic: 'This is some text' });
    },
    args: {
        children: 'Submit'
    },
    parameters: {
        onSubmit: fn()
    }
};

export const Disabled: Story = {
    play: async ({ parameters, canvas, userEvent }) => {
        await expect(canvas.getByText('Submit')).toBeVisible();
        await expect(canvas.getByText('Submit').tagName).toBe('BUTTON');
        await expect(parameters.onSubmit).toHaveBeenCalledTimes(0);
        await userEvent.click(canvas.getByText('Submit'));
        await expect(parameters.onSubmit).toHaveBeenCalledTimes(0);
    },
    args: {
        children: 'Submit',
        disabled: true
    },
    parameters: {
        onSubmit: fn()
    }
};
