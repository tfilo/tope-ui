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
        const defVal = args.multiple === true ? [] : null;

        const form = useAppForm({
            defaultValues: { basic: parameters.defaultValue ?? defVal },
            onSubmit: ({ value }) => parameters.onSubmit?.(value)
        });

        return (
            <form
                noValidate
                onSubmit={(e) => {
                    e.preventDefault();
                    form.handleSubmit();
                }}
            >
                <form.AppField
                    name='basic'
                    listeners={{
                        onChange: ({ value }) => {
                            parameters.onChange?.(value);
                        }
                    }}
                    children={(field) => <field.FileInput {...args} />}
                />
                {parameters.testControls && (
                    <>
                        <button
                            type='button'
                            onClick={() => form.reset()}
                        >
                            Reset
                        </button>
                        <button type='submit'>Submit</button>
                    </>
                )}
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
        await expect(canvas.queryByTitle('Vyberte súbor')).toBeVisible();
        await expect(canvas.queryByTitle('Vyberte súbor')).toBeEnabled();
        await userEvent.click(canvas.getByLabelText('Odstrániť example.txt'));
        await expect(parameters.onChange).toHaveBeenCalledTimes(1);
        await expect(parameters.onChange).toHaveBeenCalledWith(null);
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
        await expect(canvas.queryByLabelText('Odstrániť example.txt')).not.toBeInTheDocument();
        await expect(canvas.queryByTitle('Vyberte súbor')).toBeVisible();
        await expect(canvas.queryByTitle('Vyberte súbor')).toBeDisabled();
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
        await expect(canvas.queryByLabelText('Odstrániť example.txt')).not.toBeInTheDocument();
        await expect(canvas.queryByTitle('Vyberte súbor')).toBeVisible();
        await expect(canvas.queryByTitle('Vyberte súbor')).toBeDisabled();
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
        await userEvent.click(canvas.getByLabelText('Odstrániť example2.txt'));
        await expect(parameters.onChange).toHaveBeenCalledTimes(1);
        await userEvent.click(canvas.getByLabelText('Odstrániť example3.txt'));
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

export const ReselectSingle: Story = {
    args: { label: 'Select a file' },
    parameters: { testControls: true, onChange: fn(), onSubmit: fn() },
    play: async ({ canvasElement, canvas, parameters, userEvent }) => {
        const uploadUserEvent = import.meta.env.VITEST ? (await import('vitest/browser')).userEvent : userEvent;
        const input = canvasElement.querySelector<HTMLInputElement>('input[type="file"]')!;
        const file = new File(['same file contents'], 'repeat.txt', { type: 'text/plain' });

        await uploadUserEvent.upload(input, file);
        await expect(parameters.onChange).toHaveBeenCalledTimes(1);
        await expect(parameters.onChange).toHaveBeenLastCalledWith(file);
        await expect(input.value).toBe('');
        await userEvent.click(canvas.getByLabelText('Odstrániť repeat.txt'));
        await expect(parameters.onChange).toHaveBeenLastCalledWith(null);
        await expect(canvas.getByRole('textbox')).toBeEmptyDOMElement();

        await uploadUserEvent.upload(input, file);
        await expect(parameters.onChange).toHaveBeenCalledTimes(3);
        await expect(canvas.getByRole('textbox')).toHaveTextContent('repeat.txt');
        await userEvent.click(canvas.getByRole('button', { name: 'Submit' }));
        await expect(parameters.onSubmit).toHaveBeenLastCalledWith({ basic: file });

        await userEvent.click(canvas.getByRole('button', { name: 'Reset' }));
        await expect(canvas.getByRole('textbox')).toBeEmptyDOMElement();
        await uploadUserEvent.upload(input, file);
        await expect(parameters.onChange).toHaveBeenCalledTimes(4);
        await expect(canvas.getByRole('textbox')).toHaveTextContent('repeat.txt');
        await userEvent.click(canvas.getByRole('button', { name: 'Submit' }));
        await expect(parameters.onSubmit).toHaveBeenCalledTimes(2);
        await expect(parameters.onSubmit).toHaveBeenLastCalledWith({ basic: file });
        await expect(parameters.onSubmit.mock.lastCall[0].basic.text()).resolves.toBe('same file contents');
    }
};

export const ReselectMultiple: Story = {
    args: { label: 'Select files', multiple: true },
    parameters: { testControls: true, onChange: fn(), onSubmit: fn() },
    play: async ({ canvasElement, canvas, parameters, userEvent }) => {
        const uploadUserEvent = import.meta.env.VITEST ? (await import('vitest/browser')).userEvent : userEvent;
        const input = canvasElement.querySelector<HTMLInputElement>('input[type="file"]')!;
        const files = [new File(['first'], 'first.txt'), new File(['second'], 'second.txt')];

        await uploadUserEvent.upload(input, files);
        await expect(parameters.onChange).toHaveBeenCalledTimes(1);
        await expect(parameters.onChange).toHaveBeenLastCalledWith(files);
        await expect(input.value).toBe('');
        await userEvent.click(canvas.getByLabelText('Odstrániť first.txt'));
        await expect(parameters.onChange).toHaveBeenLastCalledWith([files[1]]);
        await expect(canvas.getByRole('textbox')).not.toHaveTextContent('first.txt');
        await expect(canvas.getByRole('textbox')).toHaveTextContent('second.txt');

        await uploadUserEvent.upload(input, files);
        await expect(parameters.onChange).toHaveBeenCalledTimes(3);
        await expect(canvas.getByRole('textbox')).toHaveTextContent('first.txt');
        await expect(canvas.getByRole('textbox')).toHaveTextContent('second.txt');
        await userEvent.click(canvas.getByRole('button', { name: 'Submit' }));
        await expect(parameters.onSubmit).toHaveBeenLastCalledWith({ basic: files });

        await userEvent.click(canvas.getByRole('button', { name: 'Reset' }));
        await expect(canvas.getByRole('textbox')).toBeEmptyDOMElement();
        await uploadUserEvent.upload(input, files);
        await expect(parameters.onChange).toHaveBeenCalledTimes(4);
        await expect(canvas.getByRole('textbox')).toHaveTextContent('first.txt');
        await expect(canvas.getByRole('textbox')).toHaveTextContent('second.txt');
        await userEvent.click(canvas.getByRole('button', { name: 'Submit' }));
        await expect(parameters.onSubmit).toHaveBeenCalledTimes(2);
        await expect(parameters.onSubmit).toHaveBeenLastCalledWith({ basic: files });
        const submittedFiles: File[] = parameters.onSubmit.mock.lastCall[0].basic;
        await expect(Promise.all(submittedFiles.map((file) => file.text()))).resolves.toEqual(['first', 'second']);
    }
};
