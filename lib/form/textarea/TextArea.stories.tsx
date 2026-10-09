import { expect, fn } from 'storybook/test';
import type { Meta, StoryObj } from '@storybook/react-vite';

import TextArea from './TextArea';
import type { TextAreaProps } from './TextArea.types';
import { useAppForm } from '../../hooks/form';

const meta = {
    title: 'Form/TextArea',
    component: TextArea,
    tags: ['autodocs'],
    argTypes: {
        disabled: { control: 'boolean' }
    },
    render: (args: TextAreaProps, { parameters }) => {
        const form = useAppForm({ defaultValues: { basic: parameters.defaultValue ?? '' } });

        return (
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    form.handleSubmit();
                }}
            >
                <form.AppField
                    name='basic'
                    listeners={{
                        onChange: parameters.onChange
                    }}
                    children={(field) => <field.TextArea {...args} />}
                />
            </form>
        );
    }
} satisfies Meta<typeof TextArea>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
    play: async ({ parameters, canvas, userEvent }) => {
        await expect(canvas.getByRole('textbox')).toBeVisible();
        await expect(canvas.getByLabelText('Some basic textarea')).toBeVisible();
        await expect(canvas.getByLabelText('Some basic textarea').tagName).toBe('TEXTAREA');
        await userEvent.type(canvas.getByRole('textbox'), 'This is some text');
        await expect(parameters.onChange).toHaveBeenCalledTimes(17);
    },
    args: {
        label: 'Some basic textarea'
    },
    parameters: {
        onChange: fn()
    }
};

export const WithMaxLength: Story = {
    play: async ({ canvas, userEvent }) => {
        await expect(canvas.getByRole('textbox').nextSibling).toHaveTextContent('0/160');
        await userEvent.type(canvas.getByRole('textbox'), 'This is some text');
        await expect(canvas.getByRole('textbox').nextSibling).toHaveTextContent('17/160');
    },
    args: {
        label: 'Some basic textarea',
        maxLength: 160
    }
};

export const Disabled: Story = {
    play: async ({ parameters, canvas, userEvent }) => {
        await userEvent.type(canvas.getByRole('textbox'), 'This is some text');
        await expect(parameters.onChange).not.toHaveBeenCalled();
    },
    args: {
        label: 'Some disabled textarea',
        disabled: true
    },
    parameters: {
        onChange: fn()
    }
};

export const Required: Story = {
    play: async ({ canvas }) => {
        await expect(
            canvas.getByLabelText('This is required textarea', {
                exact: false
            })
        ).toBeRequired();
        await expect(
            canvas.getByText('This is required textarea', {
                exact: false
            }).tagName
        ).toBe('LABEL');
        await expect(
            canvas.getByText('This is required textarea', {
                exact: false
            })
        ).toHaveTextContent('*');
    },
    args: {
        label: 'This is required textarea',
        required: true
    }
};

export const Placeholder: Story = {
    play: async ({ canvas }) => {
        await expect(canvas.getByRole('textbox')).toHaveAttribute('placeholder', 'This is placeholder...');
    },
    args: {
        label: 'Some basic textarea',
        placeholder: 'This is placeholder...'
    }
};

export const Error: Story = {
    play: async ({ canvas }) => {
        const byLabel = canvas.getByLabelText('Label', { exact: false });
        const byError = canvas.getByLabelText('This field is required!');
        await expect(canvas.getByRole('textbox')).toBeVisible();
        await expect(byLabel).toBeVisible();
        await expect(byError).toBeVisible();
        // Element retrieved by its label should be same as element retrieved by error label
        await expect(byLabel).toStrictEqual(byError);

        // Check that label is before and error after element
        await expect(canvas.getByRole('textbox').parentElement?.parentElement?.previousSibling).toHaveTextContent('Label');
        await expect(canvas.getByRole('textbox').parentElement?.parentElement?.nextSibling).toHaveTextContent('This field is required!');
    },
    args: {
        label: 'Label',
        required: true,
        placeholder: 'This is placeholder...',
        error: 'This field is required!'
    }
};

export const TextAreaOnly: Story = {
    play: async ({ canvas }) => {
        await expect(canvas.getByRole('textbox')).toHaveAttribute('aria-label', 'Labelless textarea');
    },
    args: {
        'aria-label': 'Labelless textarea'
    }
};
