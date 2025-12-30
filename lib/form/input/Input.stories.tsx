import type { Meta, StoryObj } from '@storybook/react-vite';

import { expect, fn, waitFor } from 'storybook/test';

import { Input } from './Input';
import { UserIcon, PlayIcon, TrashIcon, PlusCircleIcon, MagnifyingGlassIcon, EyeIcon } from '@heroicons/react/16/solid';
import type { InputActionProps } from './Input.types';

const meta = {
    title: 'Form/Input',
    component: Input,
    tags: ['autodocs'],
    argTypes: {
        disabled: { control: 'boolean' },
        startAction: {
            control: 'select',
            options: [undefined, 'UserIcon', 'PlayIcon', 'TrashIcon'],
            mapping: { UserIcon: UserIcon, PlayIcon: PlayIcon, TrashIcon: TrashIcon }
        },
        endAction: {
            control: 'select',
            options: [undefined, 'UserIcon', 'PlayIcon', 'TrashIcon'],
            mapping: { UserIcon: UserIcon, PlayIcon: PlayIcon, TrashIcon: TrashIcon }
        }
    }
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
    play: async ({ args, canvas, userEvent }) => {
        await expect(canvas.getByRole('textbox')).toBeVisible();
        await expect(canvas.getByLabelText('Some basic input')).toBeVisible();
        await expect(canvas.getByLabelText('Some basic input').tagName).toBe('INPUT');
        await userEvent.type(canvas.getByRole('textbox'), 'This is some text');
        await expect(args.onChange).toHaveBeenCalledTimes(17);
    },
    args: {
        label: 'Some basic input',
        name: 'basic',
        onChange: fn()
    }
};

export const Required: Story = {
    play: async ({ canvas }) => {
        await expect(
            canvas.getByLabelText('This is required input', {
                exact: false
            })
        ).toBeRequired();
        await expect(
            canvas.getByText('This is required input', {
                exact: false
            }).tagName
        ).toBe('LABEL');
        await expect(
            canvas.getByText('This is required input', {
                exact: false
            })
        ).toHaveTextContent('*');
    },
    args: {
        label: 'This is required input',
        required: true
    }
};

export const Placeholder: Story = {
    play: async ({ canvas }) => {
        await expect(canvas.getByRole('textbox')).toHaveAttribute('placeholder', 'This is placeholder...');
    },
    args: {
        label: 'Some basic input',
        placeholder: 'This is placeholder...'
    }
};

export const WithStartAction: Story = {
    play: async ({ canvas }) => {
        await expect(canvas.getByRole('textbox').previousSibling).toHaveTextContent('User');
    },
    args: {
        label: 'Input with action',
        placeholder: 'This is placeholder...',
        startAction: { icon: MagnifyingGlassIcon, title: 'User' }
    }
};

export const WithEndAction: Story = {
    play: async ({ canvas }) => {
        await expect(canvas.getByRole('textbox').nextSibling).toHaveTextContent('User');
    },
    args: {
        label: 'Input with action',
        placeholder: 'This is placeholder...',
        endAction: { icon: EyeIcon, title: 'User' }
    }
};

export const WithMultipleActions: Story = {
    play: async ({ args, canvas, userEvent }) => {
        const plusButton = canvas.getByTitle('Click me');
        await expect(canvas.getByRole('textbox').previousSibling).toHaveTextContent('I am just icon');
        await expect(canvas.getByRole('textbox').previousSibling).toContainElement(plusButton);

        await userEvent.click(plusButton);
        await expect((args.startAction as InputActionProps[])[1].onClick).toHaveBeenCalled();

        const eyeButton = canvas.getByTitle('I am button but do nothing');
        await userEvent.click(eyeButton);
        await expect((args.endAction as InputActionProps[])[0].onClick).toHaveBeenCalled();

        const userButton = canvas.getByTitle('I will be disabled after click for 2 seconds');
        await expect(userButton).toBeEnabled();
        await userEvent.click(userButton);
        await waitFor(() => expect(userButton).toBeDisabled(), { timeout: 500 });
        await expect((args.endAction as InputActionProps[])[1].onClick).toHaveBeenCalled();
        await waitFor(() => expect(userButton).toBeEnabled(), { timeout: 3000 });
    },
    args: {
        label: 'Input Label',
        startAction: [
            { icon: MagnifyingGlassIcon, title: 'I am just icon' },
            {
                icon: PlusCircleIcon,
                onClick: fn(),
                title: 'Click me'
            }
        ],
        endAction: [
            { icon: EyeIcon, onClick: fn(), title: 'I am button but do nothing' },
            {
                icon: UserIcon,
                onClick: fn(async () => {
                    return new Promise<void>((resolve) => {
                        setTimeout(() => resolve(), 2000);
                    });
                }),
                title: 'I will be disabled after click for 2 seconds'
            }
        ]
    }
};

export const Error: Story = {
    play: async ({ canvas }) => {
        const byLabel = canvas.getByLabelText('Label', { exact: false });
        const byError = canvas.getByLabelText('This field is required!');
        await expect(canvas.getByRole('textbox')).toBeVisible();
        await expect(byLabel).toBeVisible();
        await expect(byError).toBeVisible();
        // Element retrieved by its label should be same as element retrieved by error label
        await expect(byLabel).toStrictEqual(byError);

        // Check that label is before and error after element
        await expect(canvas.getByRole('textbox').parentElement?.previousSibling).toHaveTextContent('Label');
        await expect(canvas.getByRole('textbox').parentElement?.nextSibling).toHaveTextContent('This field is required!');
    },
    args: {
        label: 'Label',
        required: true,
        placeholder: 'This is placeholder...',
        error: 'This field is required!'
    }
};

export const InputOnly: Story = {
    play: async ({ canvas }) => {
        await expect(canvas.getByRole('textbox')).toHaveAttribute('aria-label', 'Labelless input');
    },
    args: {
        'aria-label': 'Labelless input'
    }
};
