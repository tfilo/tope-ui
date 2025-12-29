import type { Meta, StoryObj } from '@storybook/react-vite';

import { TextArea } from './TextArea';

const meta = {
    title: 'Form/TextArea',
    component: TextArea,
    tags: ['autodocs'],
    argTypes: {
        disabled: { control: 'boolean' }
    }
} satisfies Meta<typeof TextArea>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
    args: {
        label: 'Some basic textarea',
        name: 'basic'
    }
};

export const WithMaxLength: Story = {
    args: {
        label: 'Some basic textarea',
        maxLength: 160
    }
};

export const Required: Story = {
    args: {
        label: 'This is required textarea',
        required: true
    }
};

export const Placeholder: Story = {
    args: {
        label: 'Some basic textarea',
        placeholder: 'This is placeholder...'
    }
};

export const Error: Story = {
    args: {
        label: 'Label',
        required: true,
        placeholder: 'This is placeholder...',
        error: 'This field is required!'
    }
};

export const TextAreaOnly: Story = {
    args: {}
};
