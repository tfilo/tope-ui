import { expect, fn, waitFor, within } from 'storybook/test';
import type { Meta, StoryObj } from '@storybook/react-vite';

import { DateTimeInput } from './DateTimeInput';
import { WeekDay } from './WeekDay';
import { useAppForm } from '../../hooks/form';

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
    render: (args, { parameters }) => {
        const form = useAppForm({ defaultValues: { basic: parameters.defaultValue ?? '' } });

        return (
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    form.handleSubmit();
                }}
            >
                <p className='pb-lg'>
                    <form.Subscribe selector={(state) => state.values.basic}>
                        {(basic) => <span>VALUE: {JSON.stringify(basic)}</span>}
                    </form.Subscribe>
                </p>
                <form.AppField
                    name='basic'
                    listeners={{
                        onChange: (val) => {
                            parameters.onChange(val.value);
                        }
                    }}
                    children={(field) => <field.DateTimeInput {...args} />}
                />
            </form>
        );
    }
} satisfies Meta<typeof DateTimeInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const DateInput: Story = {
    args: {
        type: 'date'
    },
    parameters: {
        onChange: onChange
    }
};

export const BasicDateTimeInput: Story = {
    args: {
        type: 'dateTime'
    },
    parameters: {
        onChange: onChange
    }
};

export const WithValue: Story = {
    args: {
        type: 'dateTime'
    },
    parameters: {
        onChange: onChange,
        defaultValue: '2026-12-12T12:00:00'
    }
};

export const WithoutValue: Story = {
    args: {
        type: 'dateTime'
    },
    parameters: {
        onChange: onChange
    }
};

export const ExternalValueChange: Story = {
    args: {
        type: 'dateTime',
        inputFormat: ['yyyy-MM-dd HH:mm:ss'],
        inputIconTitle: 'Open calendar'
    },
    render: (args) => {
        const form = useAppForm({ defaultValues: { basic: '2026-01-15T08:15:30' } });

        return (
            <>
                <button
                    type='button'
                    onClick={() => form.setFieldValue('basic', '2027-06-20T17:45:50')}
                >
                    Set June date
                </button>
                <form.AppField
                    name='basic'
                    children={(field) => <field.DateTimeInput {...args} />}
                />
                <form.Subscribe selector={(state) => state.values.basic}>{(basic) => <output>{basic}</output>}</form.Subscribe>
            </>
        );
    },
    play: async ({ canvas, userEvent }) => {
        await userEvent.click(canvas.getByRole('button', { name: 'Set June date' }));
        await expect(canvas.getByRole('textbox')).toHaveValue('2027-06-20 17:45:50');

        await userEvent.click(canvas.getByTitle('Open calendar'));
        await userEvent.click(canvas.getByRole('button', { name: '12:00' }));

        await expect(canvas.getByRole('status')).toHaveTextContent('2027-06-20T12:00:00');
    }
};

export const PreserveTypedTimeWhenSelectingDay: Story = {
    args: {
        type: 'dateTime',
        inputFormat: ['yyyy-MM-dd HH:mm:ss'],
        inputIconTitle: 'Open calendar'
    },
    parameters: {
        onChange: onChange,
        defaultValue: '2026-01-15T08:15:30'
    },
    play: async ({ canvas, userEvent }) => {
        await userEvent.clear(canvas.getByRole('textbox'));
        await userEvent.type(canvas.getByRole('textbox'), '2026-01-15 17:45:50');

        await userEvent.click(canvas.getByTitle('Open calendar'));
        await userEvent.click(canvas.getByRole('button', { name: '16' }));

        await expect(canvas.getByRole('textbox')).toHaveValue('2026-01-16 17:45:50');
        await expect(canvas.getByText('VALUE: "2026-01-16T17:45:50"')).toBeVisible();
    }
};

export const WithLabel: Story = {
    args: {
        type: 'dateTime',
        label: 'Input name'
    },
    parameters: {
        onChange: onChange,
        defaultValue: '2026-12-12T12:00:00'
    }
};

export const WithError: Story = {
    args: {
        type: 'dateTime',
        error: 'Input error'
    },
    parameters: {
        onChange: onChange,
        defaultValue: '2026-12-12T12:00:00'
    }
};

export const CustomPlaceholder: Story = {
    args: {
        type: 'dateTime',
        placeholder: 'Placeholder'
    },
    parameters: {
        onChange: onChange
    }
};

export const CustomLastDayInWeek: Story = {
    args: {
        type: 'dateTime',
        lastDayInWeek: WeekDay.Wednesday
    },
    parameters: {
        onChange: onChange
    }
};

export const CustomSlots: Story = {
    args: {
        type: 'dateTime',
        slots: 180
    },
    parameters: {
        onChange: onChange
    }
};

export const CustomInputFormat: Story = {
    args: {
        type: 'dateTime',
        inputFormat: ['yyyy/MM/dd HH:mm:ss']
    },
    parameters: {
        onChange: onChange,
        defaultValue: '2026-12-12T12:00:00'
    }
};

export const CustomInputIconTitle: Story = {
    args: {
        type: 'dateTime',
        inputIconTitle: 'calendar'
    },
    parameters: {
        onChange: onChange,
        defaultValue: '2026-12-12T12:00:00'
    }
};

export const Disabled: Story = {
    play: async ({ parameters, canvas, userEvent }) => {
        await userEvent.type(canvas.getByRole('textbox'), '03.04.2025 13:30:00');
        await expect(parameters.onChange).not.toHaveBeenCalled();
    },
    args: {
        type: 'dateTime',
        disabled: true
    },
    parameters: {
        onChange: onChange
    }
};

export const Readonly: Story = {
    play: async ({ parameters, canvas, userEvent }) => {
        await userEvent.type(canvas.getByRole('textbox'), '03.04.2025 13:30:00');
        await expect(parameters.onChange).not.toHaveBeenCalled();
    },
    args: {
        type: 'dateTime',
        readOnly: true
    },
    parameters: {
        onChange: onChange
    }
};

export const Required: Story = {
    args: {
        type: 'dateTime',
        required: true,
        label: 'Input label'
    },
    parameters: {
        onChange: onChange
    }
};

export const DisableAutoCloseDateTimePicker: Story = {
    args: {
        type: 'dateTime',
        closeDateTimePickerIfSelected: false
    },
    parameters: {
        onChange: onChange
    }
};

export const MoreCustomOptions: Story = {
    play: async ({ parameters, canvas, canvasElement, userEvent }) => {
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
        await expect(parameters.onChange).toHaveBeenCalledTimes(0);
        await userEvent.clear(canvas.getByLabelText('Input name*'));
        await expect(parameters.onChange).toHaveBeenCalledTimes(1);
        await expect(parameters.onChange).toHaveBeenLastCalledWith('');
        await expect(canvas.getByLabelText('Input name*')).toHaveValue('');
        await userEvent.type(canvas.getByRole('textbox'), '2025/04/03 13:30:00');
        await expect(parameters.onChange).toHaveBeenCalledTimes(20);
        await expect(parameters.onChange).toHaveBeenLastCalledWith('2025-04-03T13:30:00');

        // // placeholder
        await userEvent.clear(canvas.getByLabelText('Input name*'));
        await expect(canvas.getByRole('textbox')).toHaveAttribute('placeholder', 'Placeholder');

        // calendar
        await expect(canvas.getByRole('button')).toHaveAttribute('title', 'calendar');
        const btn = canvas.getByTitle('calendar');
        await expect(canvasElement.querySelector('div[popover="manual"]')).not.toBeVisible();
        await userEvent.click(btn);
        await waitFor(() => {
            expect(canvasElement.querySelector('div[popover="manual"]')).toBeVisible();
        });
        // close calendar clicking on the btn
        await userEvent.click(btn);
        await expect(canvasElement.querySelector('div[popover="manual"]')).not.toBeVisible();
        // close calendar clicking outside the calendar
        await userEvent.click(btn);
        await userEvent.click(canvas.getByLabelText('Input name*'));
        await expect(canvasElement.querySelector('div[popover="manual"]')).not.toBeVisible();

        await expect(parameters.onChange).toHaveBeenCalledTimes(21);
        // month year list
        await userEvent.click(btn);
        const calendar = canvasElement.querySelector<HTMLElement>('div[popover="manual"]');
        if (!calendar) {
            throw new Error('Calendar not found');
        }
        const monthButton = within(calendar).getAllByRole('button')[1];
        await expect(
            canvasElement.querySelector('ul[class="grid h-full max-h-[184px] min-h-[184px] flex-1 grid-cols-4 gap-md p-md"]')
        ).toBeFalsy();
        await userEvent.click(monthButton);
        await waitFor(() => {
            expect(
                canvasElement.querySelector('ul[class="grid h-full max-h-[184px] min-h-[184px] flex-1 grid-cols-4 gap-md p-md"]')
            ).toBeVisible();
        });

        const yearButton = within(calendar).getAllByRole('button')[1];
        await expect(
            canvasElement.querySelector('ul[class="grid max-h-[184px] flex-1 grid-cols-4 gap-md overflow-auto p-md"]')
        ).toBeFalsy();
        await userEvent.click(yearButton);
        await waitFor(() => {
            expect(
                canvasElement.querySelector('ul[class="grid h-full max-h-[184px] min-h-[184px] flex-1 grid-cols-4 gap-md p-md"]')
            ).toBeFalsy();
            expect(
                canvasElement.querySelector('ul[class="grid max-h-[184px] flex-1 grid-cols-4 gap-md overflow-auto p-md"]')
            ).toBeVisible();
        });

        const year2000Button = within(calendar).getByText('2000');
        await userEvent.click(year2000Button);
        await waitFor(() => {
            expect(
                canvasElement.querySelector('ul[class="grid h-full max-h-[184px] min-h-[184px] flex-1 grid-cols-4 gap-md p-md"]')
            ).toBeVisible();
            expect(canvasElement.querySelector('ul[class="grid max-h-[184px] flex-1 grid-cols-4 gap-md overflow-auto p-md"]')).toBeFalsy();
        });

        const monthJanButton = within(calendar).getByText('Jan');
        await userEvent.click(monthJanButton);
        await waitFor(() => {
            expect(
                canvasElement.querySelector('ul[class="grid h-full max-h-[184px] min-h-[184px] flex-1 grid-cols-4 gap-md p-md"]')
            ).toBeFalsy();
            expect(canvasElement.querySelector('ul[class="grid max-h-[184px] flex-1 grid-cols-4 gap-md overflow-auto p-md"]')).toBeFalsy();
        });

        const day10Button = within(calendar).getByText('10');
        await userEvent.click(day10Button);

        await expect(canvasElement.querySelector('div[popover="manual"]')).not.toBeVisible();
        await expect(parameters.onChange).toHaveBeenCalledTimes(22);
    },
    args: {
        type: 'dateTime',
        label: 'Input name',
        placeholder: 'Placeholder',
        error: 'Input error',
        slots: 180,
        lastDayInWeek: WeekDay.Wednesday,
        inputFormat: ['yyyy/MM/dd HH:mm:ss'],
        inputIconTitle: 'calendar',
        required: true,
        id: 'calendar'
    },
    parameters: {
        onChange: onChange,
        defaultValue: '2026-12-12T12:00:00'
    }
};
