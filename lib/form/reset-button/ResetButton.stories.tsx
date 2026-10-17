import { expect, fn } from 'storybook/test';
import type { Meta, StoryObj } from '@storybook/react-vite';

import { useAppForm } from '../../hooks/form';
import { ResetButton } from './ResetButton';
import { Flex } from '../../layout';

type ResetButtonProps = React.ComponentProps<typeof ResetButton>;

const meta = {
    title: 'Form/ResetButton',
    component: ResetButton,
    tags: ['autodocs'],
    argTypes: {
        disabled: { control: 'boolean' }
    },
    render: (args: ResetButtonProps, { parameters }) => {
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
                <Flex>
                    <form.AppForm>
                        <form.SubscribeButton>Submit</form.SubscribeButton>
                    </form.AppForm>
                    <form.AppForm>
                        <form.ResetButton {...args} />
                    </form.AppForm>
                </Flex>
            </form>
        );
    }
} satisfies Meta<typeof ResetButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
    play: async ({ parameters, canvas, userEvent }) => {
        await expect(canvas.getByText('Submit')).toBeVisible();
        await expect(canvas.getByText('Submit').tagName).toBe('BUTTON');
        await userEvent.type(canvas.getByRole('textbox'), 'This is some text');
        await userEvent.click(canvas.getByText('Submit'));
        await expect(parameters.onSubmit).toHaveBeenCalledTimes(1);
        await expect(parameters.onSubmit).toHaveBeenCalledWith({ basic: 'This is some text' });

        await expect(canvas.getByText('Reset')).toBeVisible();
        await expect(canvas.getByText('Reset').tagName).toBe('BUTTON');
        await expect(canvas.getByRole('textbox')).toHaveValue('This is some text');
        await userEvent.click(canvas.getByText('Reset'));
        await expect(canvas.getByRole('textbox')).toHaveValue('');

        await userEvent.click(canvas.getByText('Submit'));
        await expect(parameters.onSubmit).toHaveBeenCalledTimes(2);
        await expect(parameters.onSubmit).toHaveBeenCalledWith({ basic: '' });
    },
    args: {
        children: 'Reset'
    },
    parameters: {
        onSubmit: fn()
    }
};

export const Disabled: Story = {
    play: async ({ canvas, userEvent }) => {
        await expect(canvas.getByText('Reset')).toBeVisible();
        await expect(canvas.getByText('Reset').tagName).toBe('BUTTON');
        await userEvent.type(canvas.getByRole('textbox'), 'This is some text');

        await expect(canvas.getByRole('textbox')).toHaveValue('This is some text');
        await userEvent.click(canvas.getByText('Reset'));
        await expect(canvas.getByRole('textbox')).toHaveValue('This is some text');
    },
    args: {
        children: 'Reset',
        disabled: true
    }
};
