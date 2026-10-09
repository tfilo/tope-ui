import { expect, fn } from 'storybook/test';
import type { Meta, StoryObj } from '@storybook/react-vite';

import Switch from './Switch';
import type { SwitchProps } from './Switch.types';
import { useAppForm } from '../../hooks/form';

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
    render: (args: SwitchProps, { parameters }) => {
        const form = useAppForm({ defaultValues: { basic: parameters.defaultValue ?? false } });

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
                    children={(field) => <field.Switch {...args} />}
                />
            </form>
        );
    },
    args: {
        label: 'Label'
    }
} satisfies Meta<typeof Switch>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Checked: Story = {
    parameters: {
        defaultValue: true,
        onChange: onChange
    }
};

export const NotChecked: Story = {
    parameters: {
        defaultValue: false,
        onChange: onChange
    }
};

export const RequiredChecked: Story = {
    args: {
        required: true
    },
    parameters: {
        defaultValue: true,
        onChange: onChange
    }
};

export const RequiredNotChecked: Story = {
    args: {
        required: true
    },
    parameters: {
        defaultValue: false,
        onChange: onChange
    }
};

export const ReadOnlyChecked: Story = {
    play: async ({ parameters, canvas, userEvent }) => {
        await expect(canvas.getByLabelText('Label')).toBeChecked();
        await expect(parameters.onChange).toHaveBeenCalledTimes(0);
        await userEvent.click(canvas.getByRole('checkbox'));
        await expect(parameters.onChange).toHaveBeenCalledTimes(0);
        await expect(canvas.getByLabelText('Label')).toBeChecked();
    },
    args: {
        readOnly: true
    },
    parameters: {
        defaultValue: true,
        onChange: onChange
    }
};

export const ReadOnlyNotChecked: Story = {
    args: {
        readOnly: true
    },
    parameters: {
        defaultValue: false,
        onChange: onChange
    }
};

export const DisabledChecked: Story = {
    args: {
        disabled: true
    },
    parameters: {
        defaultValue: true,
        onChange: onChange
    }
};

export const DisabledNotChecked: Story = {
    play: async ({ parameters, canvas, userEvent }) => {
        await expect(canvas.getByLabelText('Label')).not.toBeChecked();
        await expect(parameters.onChange).toHaveBeenCalledTimes(0);
        await userEvent.click(canvas.getByRole('checkbox'));
        await expect(parameters.onChange).toHaveBeenCalledTimes(0);
        await expect(canvas.getByLabelText('Label')).not.toBeChecked();
    },
    args: {
        disabled: true
    },
    parameters: {
        defaultValue: false,
        onChange: onChange
    }
};

export const WithoutLabel: Story = {
    args: {
        label: undefined
    },
    parameters: {
        defaultValue: false,
        onChange: onChange
    }
};

export const CheckedWithErrorAndLabel: Story = {
    args: {
        label: 'Label',
        error: 'Here will be error message'
    },
    parameters: {
        defaultValue: true,
        onChange: onChange
    }
};

export const NotCheckedWithErrorAndLabel: Story = {
    args: {
        label: 'Label',
        error: 'Here will be error message'
    },
    parameters: {
        defaultValue: false,
        onChange: onChange
    }
};

export const MoreCustomOptions: Story = {
    play: async ({ parameters, canvas, userEvent }) => {
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
        await expect(parameters.onChange).toHaveBeenCalledTimes(0);
        await userEvent.click(canvas.getByRole('checkbox'));
        await expect(parameters.onChange).toHaveBeenCalledTimes(1);
        await expect(canvas.getByLabelText('Switch label*')).toBeChecked();
        await userEvent.click(canvas.getByRole('checkbox'));
        await expect(parameters.onChange).toHaveBeenCalledTimes(2);
        await expect(canvas.getByLabelText('Switch label*')).not.toBeChecked();
    },
    args: {
        label: 'Switch label',
        error: 'Switch error',
        required: true,
        id: 'my-id'
    },
    parameters: {
        defaultValue: false,
        onChange: onChange
    }
};
