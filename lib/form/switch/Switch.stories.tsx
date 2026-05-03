import { expect, fn } from 'storybook/test';
import Switch from './Switch';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { useCallback, useEffect, useState } from 'react';

const onChange = fn();

const meta = {
    title: 'Form/Switch',
    component: Switch,
    tags: ['autodocs'],
    parameters: {
        docs: {
            description: {
                component:
                    'Switch component that renders as HTMLInputElement element wrapped by parent div containing optional label and error message.'
            }
        }
    },
    argTypes: {
        onChange: { action: 'changed' },
        id: {
            control: 'text',
            table: {
                type: { summary: 'string' }
            }
        },
        disabled: {
            control: 'boolean',
            table: {
                type: { summary: 'boolean' }
            }
        },
        required: {
            control: 'boolean',
            table: {
                type: { summary: 'boolean' }
            }
        },
        readOnly: {
            control: 'boolean',
            table: {
                type: { summary: 'boolean' }
            }
        }
    },
    render: ({ value, onChange, ...args }) => {
        const [val, setVal] = useState<boolean>(value);

        const handleChange = useCallback(
            (val: boolean) => {
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
                <Switch
                    {...args}
                    value={val}
                    onChange={handleChange}
                />
            </>
        );
    },
    args: {
        onChange: onChange,
        value: false,
        label: 'Label'
    }
} satisfies Meta<typeof Switch>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Checked: Story = {
    args: {
        value: true,
        onChange: onChange
    }
};

export const NotChecked: Story = {
    args: {
        value: false,
        onChange: onChange
    }
};

export const RequiredChecked: Story = {
    args: {
        value: true,
        onChange: onChange,
        required: true
    }
};

export const RequiredNotChecked: Story = {
    args: {
        value: false,
        onChange: onChange,
        required: true
    }
};

export const ReadOnlyChecked: Story = {
    play: async ({ args, canvas, userEvent }) => {
        await expect(canvas.getByLabelText('Label')).toBeChecked();
        await expect(args.onChange).toHaveBeenCalledTimes(0);
        await userEvent.click(canvas.getByRole('checkbox'));
        await expect(args.onChange).toHaveBeenCalledTimes(0);
        await expect(canvas.getByLabelText('Label')).toBeChecked();
    },
    args: {
        value: true,
        onChange: onChange,
        readOnly: true
    }
};

export const ReadOnlyNotChecked: Story = {
    args: {
        value: false,
        onChange: onChange,
        readOnly: true
    }
};

export const DisabledChecked: Story = {
    args: {
        value: true,
        onChange: onChange,
        disabled: true
    }
};

export const DisabledNotChecked: Story = {
    play: async ({ args, canvas, userEvent }) => {
        await expect(canvas.getByLabelText('Label')).not.toBeChecked();
        await expect(args.onChange).toHaveBeenCalledTimes(0);
        await userEvent.click(canvas.getByRole('checkbox'));
        await expect(args.onChange).toHaveBeenCalledTimes(0);
        await expect(canvas.getByLabelText('Label')).not.toBeChecked();
    },
    args: {
        value: false,
        onChange: onChange,
        disabled: true
    }
};

export const WithoutLabel: Story = {
    args: {
        value: false,
        onChange: onChange,
        label: undefined
    }
};

export const CheckedWithErrorAndLabel: Story = {
    args: {
        value: true,
        onChange: onChange,
        label: 'Label',
        error: 'Here will be error message'
    }
};

export const NotCheckedWithErrorAndLabel: Story = {
    args: {
        value: false,
        onChange: onChange,
        label: 'Label',
        error: 'Here will be error message'
    }
};

export const MoreCustomOptions: Story = {
    play: async ({ args, canvas, userEvent }) => {
        // input
        await expect(canvas.getByRole('checkbox')).toBeVisible();
        await expect(canvas.getByLabelText('Switch label*')).toBeVisible();
        await expect(canvas.getByLabelText('Switch label*').tagName).toBe('INPUT');
        await expect(canvas.getByLabelText('Switch label*')).not.toBeChecked();
        await expect(canvas.getByLabelText('Switch label*')).toHaveAttribute('id', 'input-my-id');

        // label and error
        const byLabel = canvas.getByLabelText('Switch label', { exact: false });
        const byError = canvas.getByLabelText('Switch error');
        await expect(byLabel).toBeVisible();
        await expect(byError).toBeVisible();
        // element retrieved by its label should be same as element retrieved by error label
        await expect(byLabel).toStrictEqual(byError);

        // change value
        await expect(args.onChange).toHaveBeenCalledTimes(0);
        await userEvent.click(canvas.getByRole('checkbox'));
        await expect(args.onChange).toHaveBeenCalledTimes(1);
        await expect(canvas.getByLabelText('Switch label*')).toBeChecked();
        await userEvent.click(canvas.getByRole('checkbox'));
        await expect(args.onChange).toHaveBeenCalledTimes(2);
        await expect(canvas.getByLabelText('Switch label*')).not.toBeChecked();
    },
    args: {
        value: false,
        label: 'Switch label',
        error: 'Switch error',
        required: true,
        onChange: onChange,
        id: 'my-id'
    }
};
