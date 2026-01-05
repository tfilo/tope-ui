import type { Meta, StoryObj } from '@storybook/react-vite';

import { fn } from 'storybook/test';

import { Autocomplete } from './Autocomplete';
import { useState } from 'react';

const meta = {
    title: 'Form/Autocomplete',
    component: Autocomplete,
    tags: ['autodocs'],
    argTypes: {
        disabled: { control: 'boolean' }
    }
} satisfies Meta<typeof Autocomplete>;

export default meta;
type Story = StoryObj<typeof meta>;

const options = [
    { label: 'Apple', value: 'apple' },
    { label: 'Apricot', value: 'apricot' },
    { label: 'Avocado', value: 'avocado' },
    { label: 'Banana', value: 'banana' },
    { label: 'Blackberry', value: 'blackberry' },
    { label: 'Blueberry', value: 'blueberry' },
    { label: 'Cantaloupe', value: 'cantaloupe' },
    { label: 'Cherry', value: 'cherry' },
    { label: 'Cranberry', value: 'cranberry' },
    { label: 'Date', value: 'date' },
    { label: 'Dragonfruit', value: 'dragonfruit' },
    { label: 'Durian', value: 'durian' },
    { label: 'Elderberry', value: 'elderberry' },
    { label: 'Fig', value: 'fig' },
    { label: 'Grape', value: 'grape' },
    { label: 'Guava', value: 'guava' },
    { label: 'Honeydew', value: 'honeydew' },
    { label: 'Jackfruit', value: 'jackfruit' },
    { label: 'Kiwi', value: 'kiwi' },
    { label: 'Kumquat', value: 'kumquat' },
    { label: 'Lemon', value: 'lemon' },
    { label: 'Lime', value: 'lime' },
    { label: 'Mango', value: 'mango' },
    { label: 'Nectarine', value: 'nectarine' },
    { label: 'Orange', value: 'orange' },
    { label: 'Papaya', value: 'papaya' },
    { label: 'Peach', value: 'peach' },
    { label: 'Pear', value: 'pear' }
];

export const Basic: Story = {
    render: (args) => {
        const [value, setValue] = useState<string | null>('guava');

        const handleChange = (value: string | null) => {
            setValue(value);
            console.log('SB: Value changed to:', value);
            if (args.onChange !== undefined) {
                args.onChange(value);
            }
        };

        return (
            <Autocomplete
                {...args}
                value={value}
                onChange={handleChange}
            />
        );
    },
    args: {
        label: 'Some basic input',
        name: 'basic',
        onChange: fn(),
        value: null,
        onSearch: async (query: string) => {
            console.log('Searching for:', query);
            return new Promise((resolve) => {
                setTimeout(
                    () => {
                        resolve(options.filter((option) => option.label.toLowerCase().includes(query.toLowerCase())).slice(0, 5));
                    },
                    Math.round(Math.random() * 1000) + 500
                ); // Simulate network delay
            });
        },
        onFetch: async (value: string) => {
            console.log('Fetching for value:', value);
            return new Promise((resolve) => {
                setTimeout(
                    () => {
                        resolve(options.find((option) => option.value === value) || null);
                    },
                    Math.round(Math.random() * 500) + 100
                ); // Simulate network delay
            });
        }
    }
};
