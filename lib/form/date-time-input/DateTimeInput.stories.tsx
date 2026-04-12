import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, waitFor, within } from 'storybook/test';
import { useCallback, useEffect, useState } from 'react';
import DateTimeInput, { WeekDay } from './DateTimeInput';

const onChange = fn();

const meta = {
    title: 'Form/DateTimeInput',
    component: DateTimeInput,
    tags: ['autodocs'],
    parameters: {
        docs: {
            description: {
                component:
                    'Date and DateTime input component that renders as HTMLInputElement element wrapped by parent div containing optional label and error message.'
            }
        }
    },
    argTypes: {
        onChange: { action: 'changed' },
        type: {
            control: 'radio',
            options: ['date', 'dateTime']
        },
        lastDayInWeek: {
            control: {
                type: 'select',
                labels: Object.fromEntries(Object.entries(WeekDay).map(([key, value]) => [value, key])) // display selected day in control column
            },
            options: Object.values(WeekDay), // display selected day in control column
            table: {
                defaultValue: { summary: 'Sunday' } // display default day 'Sunday' instead of 0 in default column
            }
        },
        slots: {
            control: { type: 'number', min: 1, max: 1440 }
        }
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
                <p className='pb-lg'>
                    VALUE: <span>{JSON.stringify(val)}</span>
                </p>
                <DateTimeInput
                    {...args}
                    value={val}
                    onChange={handleChange}
                />
            </>
        );
    },
    args: {
        onChange: onChange,
        value: null
    }
} satisfies Meta<typeof DateTimeInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const DateInput: Story = {
    args: {
        type: 'date'
    }
};

export const BasicDateTimeInput: Story = {
    args: {
        type: 'dateTime'
    }
};

export const WithValue: Story = {
    args: {
        type: 'dateTime',
        value: '2026-12-12T12:00:00'
    }
};

export const WithoutValue: Story = {
    args: {
        type: 'dateTime',
        value: null
    }
};

export const WithLabel: Story = {
    args: {
        type: 'dateTime',
        value: '2026-12-12T12:00:00',
        label: 'Input name'
    }
};

export const WithError: Story = {
    args: {
        type: 'dateTime',
        value: '2026-12-12T12:00:00',
        error: 'Input error'
    }
};

export const CustomPlaceholder: Story = {
    args: {
        type: 'dateTime',
        placeholder: 'Placeholder'
    }
};

export const CustomLastDayInWeek: Story = {
    args: {
        type: 'dateTime',
        lastDayInWeek: WeekDay.Wednesday
    }
};

export const CustomSlots: Story = {
    args: {
        type: 'dateTime',
        slots: 180
    }
};

export const CustomInputFormat: Story = {
    args: {
        type: 'dateTime',
        value: '2026-12-12T12:00:00',
        inputFormat: 'yyyy/MM/dd HH:mm:ss'
    }
};

export const CustomInputIconTitle: Story = {
    args: {
        type: 'dateTime',
        value: '2026-12-12T12:00:00',
        inputIconTitle: 'calendar'
    }
};

export const Disabled: Story = {
    play: async ({ args, canvas, userEvent }) => {
        await userEvent.type(canvas.getByRole('textbox'), '03.04.2025 13:30:00');
        await expect(args.onChange).not.toHaveBeenCalled();
    },
    args: {
        type: 'dateTime',
        disabled: true
    }
};

export const Readonly: Story = {
    play: async ({ args, canvas, userEvent }) => {
        await userEvent.type(canvas.getByRole('textbox'), '03.04.2025 13:30:00');
        await expect(args.onChange).not.toHaveBeenCalled();
    },
    args: {
        type: 'dateTime',
        readOnly: true
    }
};

export const Required: Story = {
    args: {
        type: 'dateTime',
        required: true,
        label: 'Input label'
    }
};

export const DisableAutoCloseDateTimePicker: Story = {
    args: {
        type: 'dateTime',
        closeDateTimePickerIfSelected: false
    }
};

export const MoreCustomOptions: Story = {
    play: async ({ args, canvas, canvasElement, userEvent }) => {
        // input
        await expect(canvas.getByRole('textbox')).toBeVisible();
        await expect(canvas.getByLabelText('Input name*')).toBeVisible();
        await expect(canvas.getByLabelText('Input name*').tagName).toBe('INPUT');
        await expect(canvas.getByLabelText('Input name*')).toHaveValue('2026/12/12 12:00:00');

        // label and error
        const byLabel = canvas.getByLabelText('Input name', { exact: false });
        const byError = canvas.getByLabelText('Input error');
        await expect(byLabel).toBeVisible();
        await expect(byError).toBeVisible();
        // element retrieved by its label should be same as element retrieved by error label
        await expect(byLabel).toStrictEqual(byError);
        // check that label is before and error after element
        await expect(canvas.getByRole('textbox').parentElement?.previousSibling).toHaveTextContent('Input name');
        await expect(canvas.getByRole('textbox').parentElement?.nextSibling).toHaveTextContent('Input error');

        // change value
        await expect(args.onChange).toHaveBeenCalledTimes(0);
        await userEvent.clear(canvas.getByLabelText('Input name*'));
        await expect(args.onChange).toHaveBeenCalledTimes(1);
        await expect(args.onChange).toHaveBeenLastCalledWith(null);
        await expect(canvas.getByLabelText('Input name*')).toHaveValue('');
        await userEvent.type(canvas.getByRole('textbox'), '2025/04/03 13:30:00');
        await expect(args.onChange).toHaveBeenCalledTimes(20);
        await expect(args.onChange).toHaveBeenLastCalledWith('2025-04-03T13:30:00');

        // placeholder
        await userEvent.clear(canvas.getByLabelText('Input name*'));
        await expect(canvas.getByRole('textbox')).toHaveAttribute('placeholder', 'Placeholder');

        // calendar
        await expect(canvas.getByRole('button')).toHaveAttribute('title', 'calendar');
        const btn = canvas.getByTitle('calendar');
        await expect(canvasElement.querySelector('#calendar-popover')).toBeFalsy();
        await userEvent.click(btn);
        await waitFor(() => {
            expect(canvasElement.querySelector('#calendar-popover')).toBeVisible();
        });
        // close calendar clicking on the btn
        await userEvent.click(btn);
        await expect(canvasElement.querySelector('#calendar-popover')).toBeFalsy();
        // close calendar clicking outside the calendar
        await userEvent.click(btn);
        await userEvent.click(canvas.getByLabelText('Input name*'));
        await expect(canvasElement.querySelector('#calendar-popover')).toBeFalsy();
        // month year list
        await userEvent.click(btn);
        const calendar = canvasElement.querySelector<HTMLElement>('#calendar-popover');
        if (!calendar) {
            throw new Error('Calendar not found');
        }
        const monthButton = within(calendar).getAllByRole('button')[1];
        await expect(canvasElement.querySelector('#calendar-month-year-list')).toBeFalsy();
        await userEvent.click(monthButton);
        await waitFor(() => {
            expect(canvasElement.querySelector('#calendar-month-year-list')).toBeVisible();
        });
    },
    args: {
        type: 'dateTime',
        value: '2026-12-12T12:00:00',
        label: 'Input name',
        placeholder: 'Placeholder',
        error: 'Input error',
        slots: 180,
        lastDayInWeek: WeekDay.Wednesday,
        inputFormat: 'yyyy/MM/dd HH:mm:ss',
        inputIconTitle: 'calendar',
        required: true,
        id: 'calendar'
    }
};
