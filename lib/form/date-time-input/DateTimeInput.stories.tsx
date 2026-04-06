import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn } from 'storybook/test';
import DateTimeInput from './DateTimeInput';
import { useCallback, useEffect, useState } from 'react';

const meta = {
    title: 'Form/DateTimeInput',
    component: DateTimeInput,
    tags: ['autodocs'],
    argTypes: {
        disabled: { control: 'boolean' },
        value: { control: 'text' }
    }
} satisfies Meta<typeof DateTimeInput>;

export default meta;
type Story = StoryObj<typeof meta>;

const onChange = fn();

export const Basic: Story = {
    play: async ({ args, canvas }) => {
        await expect(canvas.getByRole('textbox')).toBeVisible();
        await expect(canvas.getByLabelText('Some basic date input')).toBeVisible();
        await expect(canvas.getByLabelText('Some basic date input').tagName).toBe('INPUT');
        //await userEvent.type(canvas.getByRole('textbox'), '12122026');
        await expect(args.onChange).toHaveBeenCalledTimes(8);
    },
    render: ({ value, onChange, ...args }) => {
        const [val, setVal] = useState<string | null>(value);

        const handleChange = useCallback(
            (val: string | null) => {
                setVal(val);
                onChange(val);
            },
            [onChange]
        );

        useEffect(() => {
            setVal(value);
        }, [value]);

        return (
            <>
                <DateTimeInput
                    {...args}
                    value={val}
                    onChange={handleChange}
                />
                <p className='pt-lg'>
                    VALUE: <span>{JSON.stringify(val)}</span>
                </p>
            </>
        );
    },
    args: {
        label: 'Some basic date input',
        name: 'basic',
        type: 'date',
        onChange: onChange,
        value: '2010-06-16'
    }
};
