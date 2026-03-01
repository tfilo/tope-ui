import type { Meta, StoryObj } from '@storybook/react-vite';

import { DateTimeInput } from './DateTimeInput';
import { expect, fn } from 'storybook/test';

const meta = {
    title: 'Form/DateTimeInput',
    component: DateTimeInput,
    tags: ['autodocs'],
    argTypes: {
        disabled: { control: 'boolean' }
    }
} satisfies Meta<typeof DateTimeInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
    play: async ({ args, canvas, userEvent }) => {
        await expect(canvas.getByRole('textbox')).toBeVisible();
        await expect(canvas.getByLabelText('Some basic date input')).toBeVisible();
        await expect(canvas.getByLabelText('Some basic date input').tagName).toBe('INPUT');
        await userEvent.type(canvas.getByRole('textbox'), '12122026');
        await expect(args.onChange).toHaveBeenCalledTimes(8);
    },
    args: {
        label: 'Some basic date input',
        name: 'basic',
        type: 'date',
        onChange: fn()
    }
};
