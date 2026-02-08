import type { Meta, StoryObj } from '@storybook/react-vite';

import { expect, fn } from 'storybook/test';

import { FileInput } from './FileInput';
import { useState } from 'react';

const meta = {
    title: 'Form/FileInput',
    component: FileInput,
    tags: ['autodocs'],
    argTypes: {
        disabled: { control: 'boolean' }
    }
} satisfies Meta<typeof FileInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
    play: async ({ args, canvas, userEvent }) => {
        await expect(canvas.getByRole('textbox')).toBeVisible();
        await expect(canvas.getByLabelText('Some basic input')).toBeVisible();
        await expect(canvas.getByLabelText('Some basic input').tagName).toBe('DIV');
        await expect(canvas.getByLabelText('Some basic input')).toHaveTextContent('example.txt');
        await expect(canvas.queryByTitle('Select file')).toBeVisible();
        await expect(canvas.queryByTitle('Select file')).toBeEnabled();
        await userEvent.click(canvas.getByLabelText('Remove example.txt'));
        await expect(args.onChange).toHaveBeenCalledTimes(1);
    },
    render: (args) => {
        const [value, setValue] = useState<File | null>(new File([], 'example.txt'));

        const handleChange = (newValue: File | null) => {
            setValue(newValue);
            if (args.onChange !== undefined) {
                (args.onChange as (value: File | null) => void)(newValue);
            }
        };

        return (
            <FileInput
                {...args}
                multiple={false}
                value={value}
                onChange={handleChange}
            />
        );
    },
    args: {
        label: 'Some basic input',
        name: 'basic',
        value: null,
        onChange: fn()
    }
};

export const Disabled: Story = {
    play: async ({ canvas }) => {
        await expect(canvas.getByRole('textbox')).toBeVisible();
        await expect(canvas.getByLabelText('Some basic input')).toBeVisible();
        await expect(canvas.getByLabelText('Some basic input').tagName).toBe('DIV');
        await expect(canvas.getByLabelText('Some basic input')).toHaveTextContent('example.txt');
        await expect(canvas.getByLabelText('Some basic input')).toBeDisabled();
        await expect(canvas.queryByLabelText('Remove example.txt')).not.toBeInTheDocument();
        await expect(canvas.queryByTitle('Select file')).toBeVisible();
        await expect(canvas.queryByTitle('Select file')).toBeDisabled();
    },
    render: (args) => {
        const [value, setValue] = useState<File | null>(new File([], 'example.txt'));

        const handleChange = (newValue: File | null) => {
            setValue(newValue);
            if (args.onChange !== undefined) {
                (args.onChange as (value: File | null) => void)(newValue);
            }
        };

        return (
            <FileInput
                {...args}
                multiple={false}
                value={value}
                onChange={handleChange}
            />
        );
    },
    args: {
        label: 'Some basic input',
        name: 'basic',
        value: null,
        disabled: true,
        onChange: fn()
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
    render: (args) => {
        const [value, setValue] = useState<File | null>(new File([], 'example.txt'));

        const handleChange = (newValue: File | null) => {
            setValue(newValue);
            if (args.onChange !== undefined) {
                (args.onChange as (value: File | null) => void)(newValue);
            }
        };

        return (
            <FileInput
                {...args}
                multiple={false}
                value={value}
                onChange={handleChange}
            />
        );
    },
    args: {
        label: 'Some basic input',
        name: 'basic',
        value: null,
        readOnly: true,
        onChange: fn()
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
    render: (args) => {
        const [value, setValue] = useState<File | null>(new File([], 'example.txt'));

        const handleChange = (newValue: File | null) => {
            setValue(newValue);
            if (args.onChange !== undefined) {
                (args.onChange as (value: File | null) => void)(newValue);
            }
        };

        return (
            <FileInput
                {...args}
                multiple={false}
                value={value}
                onChange={handleChange}
            />
        );
    },
    args: {
        label: 'This is required fileinput',
        required: true,
        name: 'basic',
        value: null,
        onChange: fn()
    }
};

export const Multiple: Story = {
    play: async ({ args, canvas, userEvent }) => {
        await expect(canvas.getByRole('textbox')).toBeVisible();
        await expect(canvas.getByLabelText('Some basic input')).toHaveTextContent('example1.txt');
        await expect(canvas.getByLabelText('Some basic input')).toHaveTextContent('example2.txt');
        await expect(canvas.getByLabelText('Some basic input')).toHaveTextContent('example3.txt');
        await userEvent.click(canvas.getByLabelText('Remove example2.txt'));
        await expect(args.onChange).toHaveBeenCalledTimes(1);
        await userEvent.click(canvas.getByLabelText('Remove example3.txt'));
        await expect(args.onChange).toHaveBeenCalledTimes(2);
        await expect(canvas.getByLabelText('Some basic input')).toHaveTextContent('example1.txt');
        await expect(canvas.getByLabelText('Some basic input')).not.toHaveTextContent('example2.txt');
        await expect(canvas.getByLabelText('Some basic input')).not.toHaveTextContent('example3.txt');
    },
    render: (args) => {
        const [value, setValue] = useState<File[]>([
            new File([], 'example1.txt'),
            new File([], 'example2.txt'),
            new File([], 'example3.txt')
        ]);

        const handleChange = (newValue: File[]) => {
            setValue(newValue);
            if (args.onChange !== undefined) {
                (args.onChange as (value: File[]) => void)(newValue);
            }
        };

        return (
            <FileInput
                {...args}
                multiple={true}
                value={value}
                onChange={handleChange}
            />
        );
    },
    args: {
        label: 'Some basic input',
        name: 'basic',
        multiple: true,
        value: [],
        onChange: fn()
    }
};
