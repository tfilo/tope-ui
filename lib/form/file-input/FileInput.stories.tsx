import { expect, fn } from 'storybook/test';
import type { Meta, StoryObj } from '@storybook/react-vite';

import type { FileInputProps } from './FileInput.types';
import { FileInput } from './FileInput';
import { useAppForm } from '../../hooks/form';

const meta = {
    title: 'Form/FileInput',
    component: FileInput,
    tags: ['autodocs'],
    argTypes: {
        disabled: { control: 'boolean' }
    },
    render: (args: FileInputProps, { parameters }) => {
        const defVal = args.multiple === true ? [] : '';

        const form = useAppForm({ defaultValues: { basic: parameters.defaultValue ?? defVal } });

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
                    children={(field) => <field.FileInput {...args} />}
                />
            </form>
        );
    }
} satisfies Meta<typeof FileInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
    play: async ({ parameters, canvas, userEvent }) => {
        await expect(canvas.getByRole('textbox')).toBeVisible();
        await expect(canvas.getByLabelText('Some basic input')).toBeVisible();
        await expect(canvas.getByLabelText('Some basic input').tagName).toBe('DIV');
        await expect(canvas.getByLabelText('Some basic input')).toHaveTextContent('example.txt');
        await expect(canvas.queryByTitle('Select file')).toBeVisible();
        await expect(canvas.queryByTitle('Select file')).toBeEnabled();
        await userEvent.click(canvas.getByLabelText('Remove example.txt'));
        await expect(parameters.onChange).toHaveBeenCalledTimes(1);
    },
    args: {
        label: 'Some basic input'
    },
    parameters: {
        onChange: fn(),
        defaultValue: new File([], 'example.txt')
    }
};

export const Disabled: Story = {
    play: async ({ canvas }) => {
        await expect(canvas.getByRole('textbox')).toBeVisible();
        await expect(canvas.getByLabelText('Some basic input')).toBeVisible();
        await expect(canvas.getByLabelText('Some basic input').tagName).toBe('DIV');
        await expect(canvas.getByLabelText('Some basic input')).toHaveTextContent('example.txt');
        await expect(canvas.queryByLabelText('Remove example.txt')).not.toBeInTheDocument();
        await expect(canvas.queryByTitle('Select file')).toBeVisible();
        await expect(canvas.queryByTitle('Select file')).toBeDisabled();
    },
    args: {
        label: 'Some basic input',
        disabled: true
    },
    parameters: {
        onChange: fn(),
        defaultValue: new File([], 'example.txt')
    }
};

export const Readonly: Story = {
    play: async ({ canvas }) => {
        await expect(canvas.getByRole('textbox')).toBeVisible();
        await expect(canvas.getByLabelText('Some basic input')).toBeVisible();
        await expect(canvas.getByLabelText('Some basic input').tagName).toBe('DIV');
        await expect(canvas.getByLabelText('Some basic input')).toHaveTextContent('example.txt');
        await expect(canvas.queryByLabelText('Remove example.txt')).not.toBeInTheDocument();
        await expect(canvas.queryByTitle('Select file')).toBeVisible();
        await expect(canvas.queryByTitle('Select file')).toBeDisabled();
    },
    args: {
        label: 'Some basic input',
        readOnly: true
    },
    parameters: {
        onChange: fn(),
        defaultValue: new File([], 'example.txt')
    }
};

export const Required: Story = {
    play: async ({ canvas }) => {
        await expect(
            canvas.getByText('This is required fileinput', {
                exact: false
            }).tagName
        ).toBe('LABEL');
        await expect(
            canvas.getByText('This is required fileinput', {
                exact: false
            })
        ).toHaveTextContent('*');
    },
    args: {
        label: 'This is required fileinput',
        required: true
    },
    parameters: {
        onChange: fn(),
        defaultValue: new File([], 'example.txt')
    }
};

export const Multiple: Story = {
    play: async ({ parameters, canvas, userEvent }) => {
        await expect(canvas.getByRole('textbox')).toBeVisible();
        await expect(canvas.getByLabelText('Some basic input')).toHaveTextContent('example1.txt');
        await expect(canvas.getByLabelText('Some basic input')).toHaveTextContent('example2.txt');
        await expect(canvas.getByLabelText('Some basic input')).toHaveTextContent('example3.txt');
        await userEvent.click(canvas.getByLabelText('Remove example2.txt'));
        await expect(parameters.onChange).toHaveBeenCalledTimes(1);
        await userEvent.click(canvas.getByLabelText('Remove example3.txt'));
        await expect(parameters.onChange).toHaveBeenCalledTimes(2);
        await expect(canvas.getByLabelText('Some basic input')).toHaveTextContent('example1.txt');
        await expect(canvas.getByLabelText('Some basic input')).not.toHaveTextContent('example2.txt');
        await expect(canvas.getByLabelText('Some basic input')).not.toHaveTextContent('example3.txt');
    },
    args: {
        label: 'Some basic input',
        multiple: true
    },
    parameters: {
        onChange: fn(),
        defaultValue: [new File([], 'example1.txt'), new File([], 'example2.txt'), new File([], 'example3.txt')]
    }
};

export const Error: Story = {
    play: async ({ canvas }) => {
        const byLabel = canvas.getByLabelText('This is required fileinput', { exact: false });
        const byError = canvas.getByLabelText('This field is required!');
        await expect(byLabel).toBeVisible();
        await expect(byError).toBeVisible();
        // Element retrieved by its label should be same as element retrieved by error label
        await expect(byLabel).toStrictEqual(byError);

        // Check that label is before and error after element
        await expect(canvas.getByRole('textbox').parentElement?.previousSibling).toHaveTextContent('This is required fileinput');
        await expect(canvas.getByRole('textbox').parentElement?.nextSibling).toHaveTextContent('This field is required!');
    },
    args: {
        label: 'This is required fileinput',
        required: true,
        error: 'This field is required!'
    },
    parameters: {
        onChange: fn(),
        defaultValue: new File([], 'example.txt')
    }
};
