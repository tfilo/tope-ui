import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, type Mock } from 'storybook/test';

import { Select } from './Select';

const meta = {
    title: 'Form/Select',
    component: Select,
    tags: ['autodocs'],
    argTypes: {
        disabled: { control: 'boolean' }
    }
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
    render: (args) => {
        const [value, setValue] = useState<string>('');
        return (
            <Select
                {...args}
                value={value}
                onChange={(e: React.ChangeEvent<HTMLSelectElement, HTMLSelectElement>) => {
                    setValue(e.target.value);
                    if (args.onChange) {
                        args.onChange(e);
                    }
                }}
            />
        );
    },
    play: async ({ args, canvas, userEvent }) => {
        await expect(canvas.getByRole('combobox')).toBeVisible();
        await expect(canvas.getByLabelText('Some basic select')).toBeVisible();
        await expect(canvas.getByLabelText('Some basic select').tagName).toBe('SELECT');
        await userEvent.selectOptions(canvas.getByRole('combobox'), 'option3');
        await expect(args.onChange).toHaveBeenCalledTimes(1);
        (args.onChange as Mock).mockClear();
        await userEvent.selectOptions(canvas.getByRole('combobox'), 'option2');
        await expect(args.onChange).not.toHaveBeenCalled();
    },
    args: {
        label: 'Some basic select',
        name: 'basic',
        onChange: fn(),
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
    }
};

export const Disabled: Story = {
    play: async ({ args, canvas, userEvent }) => {
        await userEvent.selectOptions(canvas.getByRole('combobox'), 'option3');
        await expect(args.onChange).not.toHaveBeenCalled();
    },
    args: {
        label: 'Some disabled select',
        disabled: true,
        onChange: fn(),
        options: [
            { value: 'option1', label: 'Option 1' },
            { value: 'option2', label: 'Option 2', disabled: true },
            { value: 'option3', label: 'Option 3' }
        ]
    }
};

export const Required: Story = {
    play: async ({ canvas }) => {
        await expect(
            canvas.getByLabelText('This is required select', {
                exact: false
            })
        ).toBeRequired();
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
        const byLabel = canvas.getByLabelText('Label', { exact: false });
        const byError = canvas.getByLabelText('This field is required!');
        await expect(canvas.getByRole('combobox')).toBeVisible();
        await expect(byLabel).toBeVisible();
        await expect(byError).toBeVisible();
        // Element retrieved by its label should be same as element retrieved by error label
        await expect(byLabel).toStrictEqual(byError);

        // Check that label is before and error after element
        await expect(canvas.getByRole('combobox').parentElement?.previousSibling).toHaveTextContent('Label');
        await expect(canvas.getByRole('combobox').parentElement?.nextSibling).toHaveTextContent('This field is required!');
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
    play: async ({ args, canvas, userEvent }) => {
        const select = canvas.getByRole('listbox');
        await expect(select).toBeVisible();
        await userEvent.selectOptions(select, ['option1', 'option3']);
        await expect(args.onChange).toHaveBeenCalledTimes(2);
    },
    args: {
        label: 'Some multi select',
        name: 'multi-select',
        multiple: true,
        onChange: fn(),
        options: [
            { value: 'option1', label: 'Option 1' },
            { value: 'option2', label: 'Option 2' },
            { value: 'option3', label: 'Option 3' }
        ]
    }
};
