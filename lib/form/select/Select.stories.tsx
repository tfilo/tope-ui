import { expect, fn, within } from 'storybook/test';
import type { Meta, StoryObj } from '@storybook/react-vite';

import { useAppForm } from '../../hooks/form';
import type { SelectProps } from './Select.types';
import { Select } from './Select';

const meta = {
    title: 'Form/Select',
    component: Select,
    tags: ['autodocs'],
    argTypes: {
        disabled: { control: 'boolean' }
    },
    render: (args: SelectProps, { parameters }) => {
        const defVal = args.multiple === true ? [] : '';

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
                    validators={parameters.validators}
                    listeners={{
                        onChange: parameters.onChange
                    }}
                    children={(field) => <field.Select {...args} />}
                />
                {parameters.testSubmission && (
                    <div className='mt-[20px] flex flex-wrap gap-xl'>
                        <button type='submit'>Submit</button>
                    </div>
                )}
                {parameters.testControls && (
                    <div className='mt-[20px] flex flex-wrap gap-xl'>
                        <button
                            type='button'
                            onClick={() => form.reset()}
                        >
                            Reset
                        </button>
                        <button
                            type='button'
                            onClick={() => form.setFieldValue('basic', args.multiple ? ['option3'] : 'option3')}
                        >
                            Set value
                        </button>
                    </div>
                )}
            </form>
        );
    }
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
    play: async ({ parameters, canvas, userEvent }) => {
        const trigger = canvas.getByRole('combobox');
        await expect(trigger.closest('form')!.querySelector('select')).toBeNull();
        await expect(canvas.getByRole('combobox', { name: 'Some basic select' })).toBeVisible();
        await userEvent.click(trigger);
        await userEvent.click(canvas.getByRole('option', { name: 'Option 3' }));
        await expect(canvas.getByLabelText('Odstrániť Option 3')).toBeVisible();
        await expect(parameters.onChange).toHaveBeenLastCalledWith(expect.objectContaining({ value: 'option3' }));
        await userEvent.click(trigger);
        await expect(canvas.getByRole('option', { name: 'Option 2' })).toBeDisabled();
        await expect(parameters.onChange).toHaveBeenCalledTimes(1);
        await userEvent.click(canvas.getByRole('option', { name: 'Group 1 - Option 2' }));
        await expect(canvas.queryByLabelText('Odstrániť Option 3')).toBeNull();
        await expect(canvas.getByLabelText('Odstrániť Group 1 - Option 2')).toBeVisible();
        await expect(parameters.onChange).toHaveBeenLastCalledWith(expect.objectContaining({ value: 'group1-option2' }));
        await userEvent.click(trigger);
        await expect(canvas.queryByRole('option', { name: '' })).toBeNull();
        await userEvent.keyboard('{Escape}');
        await userEvent.click(canvas.getByLabelText('Odstrániť Group 1 - Option 2'));
        await expect(canvas.queryByLabelText('Odstrániť Group 1 - Option 2')).toBeNull();
        await expect(parameters.onChange).toHaveBeenLastCalledWith(expect.objectContaining({ value: '' }));
        await userEvent.click(trigger);
        await userEvent.click(canvas.getByRole('option', { name: 'Option 1' }));
        await userEvent.click(canvas.getByLabelText('Odstrániť Option 1'));
        await expect(parameters.onChange).toHaveBeenLastCalledWith(expect.objectContaining({ value: '' }));
    },
    args: {
        label: 'Some basic select',
        options: [
            { value: 'option1', label: 'Option 1' },
            { value: 'option2', label: 'Option 2', disabled: true },
            { value: 'option3', label: 'Option 3' },
            {
                label: 'Group 1',
                options: [
                    { value: 'group1-option1', label: 'Group 1 - Option 1' },
                    { value: 'group1-option2', label: 'Group 1 - Option 2' }
                ]
            }
        ]
    },
    parameters: {
        onChange: fn()
    }
};

export const Disabled: Story = {
    play: async ({ parameters, canvas, userEvent }) => {
        await expect(canvas.getByRole('combobox')).toBeDisabled();
        await userEvent.click(canvas.getByRole('combobox'));
        await expect(canvas.getByRole('combobox')).toHaveAttribute('aria-expanded', 'false');
        await expect(parameters.onChange).not.toHaveBeenCalled();
    },
    args: {
        label: 'Some disabled select',
        disabled: true,
        options: [
            { value: 'option1', label: 'Option 1' },
            { value: 'option2', label: 'Option 2', disabled: true },
            { value: 'option3', label: 'Option 3' }
        ]
    },
    parameters: {
        onChange: fn()
    }
};

export const Required: Story = {
    play: async ({ canvas }) => {
        await expect(canvas.getByRole('combobox', { name: 'This is required select' })).toHaveAttribute('aria-required', 'true');
        await expect(
            canvas.getByText('This is required select', {
                exact: false
            }).tagName
        ).toBe('LABEL');
        await expect(
            canvas.getByText('This is required select', {
                exact: false
            })
        ).toHaveTextContent('*');
    },
    args: {
        label: 'This is required select',
        required: true,
        options: [
            { value: 'option1', label: 'Option 1' },
            { value: 'option2', label: 'Option 2' }
        ]
    }
};

export const Error: Story = {
    play: async ({ canvas }) => {
        const byLabel = canvas.getByLabelText('Label', { exact: false, selector: 'button' });
        const byError = canvas.getByLabelText('This field is required!');
        await expect(canvas.getByRole('combobox')).toBeVisible();
        await expect(byLabel).toBeVisible();
        await expect(byError).toBeVisible();
        // Element retrieved by its label should be same as element retrieved by error label
        await expect(byLabel).toStrictEqual(byError);

        // Check that label is before and error after element
        await expect(canvas.getByRole('combobox').closest('.component')?.previousSibling).toHaveTextContent('Label');
        await expect(canvas.getByRole('combobox').closest('.component')?.nextSibling).toHaveTextContent('This field is required!');
    },
    args: {
        label: 'Label',
        required: true,
        error: 'This field is required!',
        options: [
            { value: 'option1', label: 'Option 1' },
            { value: 'option2', label: 'Option 2' }
        ]
    }
};

export const SelectOnly: Story = {
    play: async ({ canvas }) => {
        await expect(canvas.getByRole('combobox')).toHaveAttribute('aria-label', 'Labelless select');
    },
    args: {
        'aria-label': 'Labelless select',
        options: [
            { value: 'option1', label: 'Option 1' },
            { value: 'option2', label: 'Option 2' }
        ]
    }
};

export const MultiSelect: Story = {
    play: async ({ parameters, canvas, userEvent }) => {
        const trigger = canvas.getByRole('combobox');
        await expect(trigger).toHaveAccessibleName('Some multi select');
        await expect(trigger).toHaveAttribute('aria-expanded', 'false');
        await userEvent.click(trigger);
        await expect(canvas.getByRole('listbox')).toBeVisible();
        await userEvent.click(canvas.getByRole('option', { name: 'Option 1' }));
        await expect(canvas.getByLabelText('Odstrániť Option 1')).toBeVisible();
        await expect(trigger).toHaveFocus();
        await userEvent.click(trigger);
        await expect(canvas.getByRole('option', { name: 'Option 1' })).toHaveAttribute('aria-selected', 'true');
        await expect(canvas.getByRole('option', { name: 'Option 2' })).toBeDisabled();
        await expect(canvas.getByRole('group', { name: 'Group 1' })).toBeVisible();
        await userEvent.click(canvas.getByRole('option', { name: 'Group 1 - Option 1' }));
        await expect(parameters.onChange).toHaveBeenLastCalledWith(expect.objectContaining({ value: ['option1', 'group1-option1'] }));
        await userEvent.click(canvas.getByLabelText('Odstrániť Option 1'));
        await expect(canvas.queryByLabelText('Odstrániť Option 1')).toBeNull();
        await userEvent.click(trigger);
        await userEvent.click(canvas.getByRole('option', { name: 'Group 1 - Option 1' }));
        await expect(canvas.queryByLabelText('Odstrániť Group 1 - Option 1')).toBeNull();
        await expect(parameters.onChange).toHaveBeenCalledTimes(4);
    },
    args: {
        label: 'Some multi select',
        multiple: true,
        options: [
            { value: 'option1', label: 'Option 1' },
            { value: 'option2', label: 'Option 2', disabled: true },
            { value: 'option3', label: 'Option 3' },
            {
                label: 'Group 1',
                options: [
                    { value: 'group1-option1', label: 'Group 1 - Option 1' },
                    { value: 'group1-option2', label: 'Group 1 - Option 2' }
                ]
            }
        ]
    },
    parameters: { onChange: fn(), defaultValue: [] }
};

export const MultiSelectKeyboard: Story = {
    args: MultiSelect.args,
    parameters: { onChange: fn(), testControls: true },
    play: async ({ canvas, userEvent }) => {
        const trigger = canvas.getByRole('combobox');
        trigger.focus();
        await userEvent.keyboard('{ArrowDown}');
        await expect(canvas.getByRole('option', { name: 'Option 1' })).toHaveFocus();
        await userEvent.keyboard('{ArrowUp}');
        await expect(trigger).toHaveFocus();
        await expect(trigger).toHaveAttribute('aria-expanded', 'false');
        await userEvent.keyboard('{ArrowDown}{ArrowDown}');
        await expect(canvas.getByRole('option', { name: 'Option 3' })).toHaveFocus();
        await userEvent.keyboard('{ArrowDown}');
        await expect(canvas.getByRole('option', { name: 'Group 1 - Option 1' })).toHaveFocus();
        await userEvent.keyboard('{End}{Home}');
        await expect(canvas.getByRole('option', { name: 'Option 1' })).toHaveFocus();
        await userEvent.keyboard('{Enter}');
        await expect(canvas.getByLabelText('Odstrániť Option 1')).toBeVisible();
        await expect(trigger).toHaveFocus();
        await userEvent.keyboard('{ArrowUp}');
        await expect(canvas.getByRole('option', { name: 'Group 1 - Option 2' })).toHaveFocus();
        await userEvent.keyboard('{Escape}');
        await expect(trigger).toHaveFocus();
        await expect(trigger).toHaveAttribute('aria-expanded', 'false');
        await userEvent.keyboard('{ArrowDown}{Tab}');
        await expect(canvas.getByRole('button', { name: 'Reset' })).toHaveFocus();
        await userEvent.click(trigger);
        await userEvent.click(canvas.getByRole('button', { name: 'Reset' }));
        await expect(trigger).toHaveAttribute('aria-expanded', 'false');
    }
};

export const MultiSelectReset: Story = {
    args: MultiSelect.args,
    parameters: { defaultValue: ['option1'], testControls: true, onSubmit: fn() },
    play: async ({ canvas, parameters, userEvent }) => {
        await expect(canvas.getByLabelText('Odstrániť Option 1')).toBeVisible();
        await userEvent.click(canvas.getByRole('button', { name: 'Option 1' }));
        await expect(parameters.onSubmit).not.toHaveBeenCalled();
        await userEvent.click(canvas.getByRole('button', { name: 'Set value' }));
        await expect(canvas.queryByLabelText('Odstrániť Option 1')).toBeNull();
        await expect(canvas.getByLabelText('Odstrániť Option 3')).toBeVisible();
        await userEvent.click(canvas.getByRole('button', { name: 'Reset' }));
        await expect(canvas.getByLabelText('Odstrániť Option 1')).toBeVisible();
        await expect(canvas.queryByLabelText('Odstrániť Option 3')).toBeNull();
    }
};

export const MultiSelectDisabled: Story = {
    args: { ...MultiSelect.args, disabled: true },
    parameters: { defaultValue: ['option1'], onChange: fn() },
    play: async ({ canvas, parameters, userEvent }) => {
        const trigger = canvas.getByRole('combobox');
        await expect(trigger).toBeDisabled();
        await userEvent.click(trigger);
        await expect(trigger).toHaveAttribute('aria-expanded', 'false');
        await expect(canvas.queryByLabelText('Odstrániť Option 1')).toBeNull();
        await expect(parameters.onChange).not.toHaveBeenCalled();
    }
};

export const MultiSelectRequired: Story = {
    args: { ...MultiSelect.args, required: true, error: 'This field is required!' },
    play: async ({ canvas, userEvent }) => {
        const trigger = canvas.getByRole('combobox');
        await expect(trigger).toHaveAttribute('aria-required', 'true');
        await expect(trigger).toHaveAttribute('aria-invalid', 'true');
        await expect(trigger.closest('form')!.checkValidity()).toBe(true);
        await userEvent.click(trigger);
        await userEvent.click(canvas.getByRole('option', { name: 'Option 1' }));
        await expect(canvas.getByLabelText('Odstrániť Option 1')).toBeVisible();
    }
};

export const MultiSelectEmpty: Story = {
    args: { multiple: true, options: [], 'aria-label': 'Empty multi select' },
    play: async ({ canvas, userEvent }) => {
        await userEvent.click(canvas.getByRole('combobox', { name: 'Empty multi select' }));
        await expect(within(canvas.getByRole('listbox')).getByText('Žiadne možnosti')).toBeVisible();
        await userEvent.keyboard('{Escape}');
        await expect(canvas.getByRole('combobox')).toHaveAttribute('aria-expanded', 'false');
    }
};

export const MultiSelectValidation: Story = {
    args: MultiSelect.args,
    parameters: {
        testControls: true,
        validators: { onBlur: ({ value }: { value: string[] }) => (value.length ? undefined : 'Choose at least one option') }
    },
    play: async ({ canvas, userEvent }) => {
        const trigger = canvas.getByRole('combobox');
        trigger.focus();
        await userEvent.keyboard('{ArrowDown}{Escape}');
        await expect(canvas.queryByText('Choose at least one option')).toBeNull();
        await userEvent.tab();
        await expect(canvas.getByText('Choose at least one option')).toBeVisible();
        await userEvent.click(trigger);
        await userEvent.click(canvas.getByRole('option', { name: 'Option 1' }));
        await userEvent.tab();
        await expect(canvas.queryByText('Choose at least one option')).toBeNull();
    }
};

export const SingleSelectReset: Story = {
    args: { ...MultiSelect.args, label: 'Some single select', multiple: false },
    parameters: { defaultValue: 'option1', testControls: true, onSubmit: fn() },
    play: MultiSelectReset.play
};

export const SingleSelectKeyboard: Story = {
    args: { ...MultiSelect.args, label: 'Some single select', multiple: false },
    parameters: { testControls: true },
    play: MultiSelectKeyboard.play
};

export const SingleSelectRequired: Story = {
    args: { ...MultiSelectRequired.args, multiple: false },
    play: MultiSelectRequired.play
};

export const Submission: Story = {
    args: Basic.args,
    parameters: { testSubmission: true, onSubmit: fn() },
    play: async ({ args, canvas, parameters, userEvent }) => {
        await userEvent.click(canvas.getByRole('combobox'));
        await userEvent.click(canvas.getByRole('option', { name: 'Option 3' }));
        await userEvent.click(canvas.getByRole('button', { name: 'Submit' }));
        await expect(parameters.onSubmit).toHaveBeenLastCalledWith({ basic: args.multiple ? ['option3'] : 'option3' });
        await userEvent.click(canvas.getByLabelText('Odstrániť Option 3'));
        await userEvent.click(canvas.getByRole('button', { name: 'Submit' }));
        await expect(parameters.onSubmit).toHaveBeenLastCalledWith({ basic: args.multiple ? [] : '' });
    }
};

export const MultiSelectSubmission: Story = {
    args: MultiSelect.args,
    parameters: { testSubmission: true, onSubmit: fn() },
    play: Submission.play
};
