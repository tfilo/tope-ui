import { expect, fn } from 'storybook/test';
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
                    children={(field) => <field.Select {...args} />}
                />
                {parameters.showReset && (
                    <button
                        type='button'
                        onClick={() => form.reset()}
                    >
                        Reset form
                    </button>
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
        await expect(trigger.tagName).toBe('BUTTON');
        await expect(canvas.queryByRole('textbox')).toBeNull();
        await userEvent.click(trigger);
        await expect(canvas.getByRole('option', { name: 'Option 2' })).toBeDisabled();
        await expect(canvas.getAllByRole('option')).toHaveLength(5);
        await userEvent.click(canvas.getByRole('option', { name: 'Option 3' }));
        await expect(parameters.onChange).toHaveBeenCalledTimes(1);
        await expect(trigger).toHaveFocus();
        await userEvent.click(canvas.getByLabelText('Odstrániť Option 3'));
        await expect(parameters.onChange).toHaveBeenCalledTimes(2);
        await expect(canvas.queryByText('Option 3', { selector: 'span button' })).toBeNull();
        await userEvent.click(trigger);
        await userEvent.click(canvas.getByRole('option', { name: 'Group 1 - Option 1' }));
        await expect(canvas.getByLabelText('Odstrániť Group 1 - Option 1')).toBeVisible();
    },
    args: {
        label: 'Some basic select',
        allowEmptyOption: true,
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
        await expect(canvas.getByRole('combobox').querySelector('svg')).toHaveStyle({ fill: 'rgb(153, 153, 153)' });
        await userEvent.click(canvas.getByRole('combobox'));
        await expect(canvas.queryByRole('listbox')).toBeNull();
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
        await expect(
            canvas.getByLabelText('This is required select', {
                exact: false,
                selector: 'button'
            })
        ).toHaveAttribute('aria-required', 'true');
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
        await expect(canvas.getByRole('combobox').parentElement?.parentElement?.parentElement?.previousSibling).toHaveTextContent('Label');
        await expect(canvas.getByRole('combobox').parentElement?.parentElement?.parentElement?.nextSibling).toHaveTextContent(
            'This field is required!'
        );
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
        await userEvent.click(trigger);
        await userEvent.click(canvas.getByRole('option', { name: 'Option 1' }));
        await expect(canvas.queryByLabelText('Odstrániť Option 1')).toBeNull();
        await userEvent.click(trigger);
        await userEvent.click(canvas.getByRole('option', { name: 'Option 1' }));
        await expect(parameters.onChange).toHaveBeenCalledTimes(1);
        await userEvent.click(trigger);
        await userEvent.click(canvas.getByRole('option', { name: 'Option 3' }));
        await expect(parameters.onChange).toHaveBeenCalledTimes(2);
        await userEvent.click(canvas.getByLabelText('Odstrániť Option 1'));
        await expect(canvas.queryByLabelText('Odstrániť Option 3')).toBeNull();
        await expect(parameters.onChange).toHaveBeenCalledTimes(3);
    },
    args: {
        label: 'Some multi select',
        multiple: true,
        options: [
            { value: 'option1', label: 'Option 1' },
            { value: 'option2', label: 'Option 2' },
            { value: 'option3', label: 'Option 3' }
        ]
    },
    parameters: {
        onChange: fn(),
        defaultValue: []
    }
};

export const SingleSelectionCannotBeCleared: Story = {
    args: { ...Basic.args, allowEmptyOption: false },
    parameters: { defaultValue: 'option1', onChange: fn() },
    play: async ({ canvas, userEvent, parameters }) => {
        await expect(canvas.queryByLabelText('Odstrániť Option 1')).toBeNull();
        const trigger = canvas.getByRole('combobox');
        trigger.focus();
        await userEvent.keyboard('{ArrowDown}');
        await expect(canvas.getByRole('option', { name: 'Option 1' })).toHaveFocus();
        await userEvent.keyboard('{Enter}');
        await expect(parameters.onChange).not.toHaveBeenCalled();
        await userEvent.keyboard('{ArrowDown}{ArrowDown}');
        await expect(canvas.getByRole('option', { name: 'Option 3' })).toHaveFocus();
        await userEvent.keyboard('{Escape}');
        await expect(trigger).toHaveFocus();
        await expect(trigger).toHaveAttribute('aria-expanded', 'false');
    }
};

export const MultipleCanBeCleared: Story = {
    args: { ...MultiSelect.args, allowEmptyOption: true },
    parameters: { defaultValue: ['option1'], onChange: fn() },
    play: async ({ canvas, userEvent, parameters }) => {
        await userEvent.click(canvas.getByLabelText('Odstrániť Option 1'));
        await expect(parameters.onChange).toHaveBeenCalledTimes(1);
        await expect(canvas.queryByLabelText('Odstrániť Option 1')).toBeNull();
    }
};

export const ResetSelection: Story = {
    args: { ...Basic.args },
    parameters: { defaultValue: 'option1', showReset: true },
    play: async ({ canvas, userEvent }) => {
        await userEvent.click(canvas.getByRole('combobox'));
        await userEvent.click(canvas.getByRole('option', { name: 'Option 3' }));
        await expect(canvas.getByLabelText('Odstrániť Option 3')).toBeVisible();
        await userEvent.click(canvas.getByRole('button', { name: 'Reset form' }));
        await expect(canvas.getByLabelText('Odstrániť Option 1')).toBeVisible();
        await expect(canvas.queryByLabelText('Odstrániť Option 3')).toBeNull();
        await expect(canvas.getByRole('combobox')).toHaveAttribute('aria-expanded', 'false');
    }
};

export const KeyboardNavigation: Story = {
    args: {
        label: 'Keyboard navigation',
        options: [
            { value: 'disabled-first', label: 'Disabled first', disabled: true },
            { value: 'first', label: 'First option' },
            { value: 'disabled-middle', label: 'Disabled middle', disabled: true },
            { label: 'Group', options: [{ value: 'last', label: 'Last option' }] }
        ]
    },
    parameters: { onChange: fn() },
    play: async ({ canvas, userEvent, parameters }) => {
        const trigger = canvas.getByRole('combobox');
        trigger.focus();
        await userEvent.keyboard('{ArrowUp}');
        await expect(trigger).toHaveAttribute('aria-expanded', 'false');
        await userEvent.keyboard('{ArrowDown}');
        await expect(canvas.getByRole('option', { name: 'First option' })).toHaveFocus();
        await userEvent.keyboard('{ArrowUp}');
        await expect(trigger).toHaveFocus();
        await expect(trigger).toHaveAttribute('aria-expanded', 'false');

        await userEvent.keyboard('{Enter}');
        await expect(canvas.getByRole('option', { name: 'First option' })).toHaveFocus();
        await userEvent.keyboard('{ArrowDown}{ArrowDown}');
        await expect(canvas.getByRole('option', { name: 'Last option' })).toHaveFocus();
        await userEvent.keyboard('{ArrowUp}');
        await expect(canvas.getByRole('option', { name: 'First option' })).toHaveFocus();
        await userEvent.keyboard('{Escape}');
        await expect(trigger).toHaveFocus();
        await expect(trigger).toHaveAttribute('aria-expanded', 'false');
        await expect(parameters.onChange).not.toHaveBeenCalled();

        await userEvent.keyboard(' ');
        await expect(canvas.getByRole('option', { name: 'First option' })).toHaveFocus();
        await userEvent.keyboard('{ArrowDown}{Enter}');
        await expect(trigger).toHaveFocus();
        await expect(trigger).toHaveAttribute('aria-expanded', 'false');
        await expect(parameters.onChange).toHaveBeenCalledTimes(1);

        await userEvent.click(trigger);
        await expect(canvas.getByRole('option', { name: 'First option' })).toHaveFocus();
        await userEvent.keyboard('{Tab}');
        await userEvent.keyboard('{Tab}');
        await expect(trigger).toHaveAttribute('aria-expanded', 'false');
    }
};
