import type { Meta, StoryObj } from '@storybook/react-vite';

import { fn } from 'storybook/test';

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
    // play: async ({ args, canvas, userEvent }) => {
    //     await expect(canvas.getByRole('textbox')).toBeVisible();
    //     await expect(canvas.getByLabelText('Some basic input')).toBeVisible();
    //     await expect(canvas.getByLabelText('Some basic input').tagName).toBe('INPUT');
    //     await userEvent.type(canvas.getByRole('textbox'), 'This is some text');
    //     await expect(args.onChange).toHaveBeenCalledTimes(17);
    // },
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
