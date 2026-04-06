import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn } from 'storybook/test';

import { Autocomplete } from './Autocomplete';

const meta = {
    title: 'Form/Autocomplete',
    component: Autocomplete,
    tags: ['autodocs'],
    argTypes: {
        disabled: { control: 'boolean' },
        multiple: { control: false }
    }
} satisfies Meta<typeof Autocomplete>;

export default meta;
type Story = StoryObj<typeof meta>;

const options = [
    { label: 'Apple', value: 'apple' },
    { label: 'Apricot', value: 'apricot' },
    { label: 'Avocado', value: 'avocado' },
    { label: 'Banana', value: 'banana' },
    { label: 'Blackberry', value: 'blackberry', disabled: true },
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
    play: async ({ args, canvas, userEvent }) => {
        await expect(canvas.getByRole('textbox')).toBeVisible();
        await expect(canvas.getByLabelText('Autocomplete')).toBeVisible();
        await expect(canvas.getByLabelText('Autocomplete').tagName).toBe('INPUT');
        // wait for 800ms here to allow useEffects to settle
        await new Promise((resolve) => setTimeout(resolve, 800));
        await expect(canvas.queryByText('Guava')).toBeVisible();
        await expect(canvas.getByText('Guava').tagName).toBe('BUTTON');
        await userEvent.type(canvas.getByRole('textbox'), '{ArrowDown}Apple');
        // wait for fetch to finish
        await new Promise((resolve) => setTimeout(resolve, 1700));
        canvas
            .queryAllByRole('button')
            .find((item) => item.textContent === 'Apple')
            ?.click();
        // wait for 800ms here to allow useEffects to settle
        await new Promise((resolve) => setTimeout(resolve, 800));
        await expect(args.onChange).toHaveBeenCalledTimes(1);

        await expect(canvas.queryByText('Guava')).toBeNull();
        await expect(canvas.getByText('Apple')).toBeVisible();
        await expect(canvas.getByText('Apple').tagName).toBe('BUTTON');

        // find button with aria-label Remove Apple and click it
        const removeButton = canvas.getByLabelText('Remove Apple');
        await userEvent.click(removeButton);
        // wait for 800ms here to allow useEffects to settle
        await new Promise((resolve) => setTimeout(resolve, 800));
        await expect(args.onChange).toHaveBeenCalledTimes(2);
    },
    render: (args) => {
        const [value, setValue] = useState<string | null>('guava');

        const handleChange = (value: string | null) => {
            setValue(value);
            if (args.onChange !== undefined) {
                (args.onChange as (value: string | null) => void)(value);
            }
        };

        return (
            <Autocomplete
                {...args}
                multiple={false}
                value={value}
                onChange={handleChange}
            />
        );
    },
    args: {
        label: 'Autocomplete',
        name: 'basic',
        onChange: fn(),
        value: null,
        onSearch: async (query: string) => {
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

export const Multiple: Story = {
    play: async ({ args, canvas, userEvent }) => {
        await expect(canvas.getByRole('textbox')).toBeVisible();
        await expect(canvas.getByLabelText('MultiAutocomplete')).toBeVisible();
        await expect(canvas.getByLabelText('MultiAutocomplete').tagName).toBe('INPUT');
        // wait for 800ms here to allow useEffects to settle
        await new Promise((resolve) => setTimeout(resolve, 800));
        await expect(canvas.queryByText('Guava')).toBeVisible();
        await expect(canvas.getByText('Guava').tagName).toBe('BUTTON');
        await expect(canvas.queryByText('Kiwi')).toBeVisible();
        await expect(canvas.getByText('Kiwi').tagName).toBe('BUTTON');
        await userEvent.type(canvas.getByRole('textbox'), '{ArrowDown}Apple');
        // wait for fetch to finish
        await new Promise((resolve) => setTimeout(resolve, 1700));
        canvas
            .queryAllByRole('button')
            .find((item) => item.textContent === 'Apple')
            ?.click();
        // wait for 800ms here to allow useEffects to settle
        await new Promise((resolve) => setTimeout(resolve, 800));
        await expect(args.onChange).toHaveBeenCalledTimes(1);

        await expect(canvas.queryByText('Guava')).toBeVisible();
        await expect(canvas.getByText('Guava').tagName).toBe('BUTTON');
        await expect(canvas.queryByText('Kiwi')).toBeVisible();
        await expect(canvas.getByText('Kiwi').tagName).toBe('BUTTON');
        await expect(canvas.queryByText('Apple')).toBeVisible();
        await expect(canvas.getByText('Apple').tagName).toBe('BUTTON');

        // find button with aria-label Remove Apple and click it
        await userEvent.click(canvas.getByLabelText('Remove Apple'));
        // wait for 800ms here to allow useEffects to settle
        await new Promise((resolve) => setTimeout(resolve, 800));
        await expect(args.onChange).toHaveBeenCalledTimes(2);

        await expect(canvas.queryByText('Guava')).toBeVisible();
        await expect(canvas.queryByText('Kiwi')).toBeVisible();
        await expect(canvas.queryByText('Apple')).toBeNull();

        // find button with aria-label Remove Apple and click it
        await userEvent.click(canvas.getByLabelText('Remove Guava'));
        // wait for 800ms here to allow useEffects to settle
        await new Promise((resolve) => setTimeout(resolve, 800));
        await expect(args.onChange).toHaveBeenCalledTimes(3);

        await expect(canvas.queryByText('Guava')).toBeNull();
        await expect(canvas.queryByText('Kiwi')).toBeVisible();
        await expect(canvas.queryByText('Apple')).toBeNull();
    },
    render: (args) => {
        const [value, setValue] = useState<string[]>(['guava', 'kiwi']);

        const handleChange = (value: string[]) => {
            setValue(value);
            if (args.onChange !== undefined) {
                (args.onChange as (value: string[]) => void)(value);
            }
        };

        return (
            <Autocomplete
                {...args}
                multiple={true}
                value={value}
                onChange={handleChange}
            />
        );
    },
    args: {
        label: 'MultiAutocomplete',
        name: 'basic',
        onChange: fn(),
        value: null,
        onSearch: async (query: string) => {
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

export const Disabled: Story = {
    play: async ({ args, canvas, userEvent }) => {
        await expect(canvas.getByRole('textbox')).toBeVisible();
        await expect(canvas.getByLabelText('Autocomplete')).toBeVisible();
        await expect(canvas.getByLabelText('Autocomplete').tagName).toBe('INPUT');
        await expect(canvas.getByLabelText('Autocomplete')).toBeDisabled();
        // wait for 800ms here to allow useEffects to settle
        await new Promise((resolve) => setTimeout(resolve, 800));
        await expect(canvas.queryByText('Guava')).toBeVisible();
        await expect(canvas.getByText('Guava').tagName).toBe('BUTTON');
        await expect(canvas.queryByText('Remove Guava')).toBeNull();
        await userEvent.type(canvas.getByRole('textbox'), '{ArrowDown}Apple');
        // wait for fetch to finish
        await new Promise((resolve) => setTimeout(resolve, 1700));
        canvas
            .queryAllByRole('listitem')
            .find((item) => item.textContent === 'Apple')
            ?.click();
        // wait for 800ms here to allow useEffects to settle
        await new Promise((resolve) => setTimeout(resolve, 800));
        await expect(args.onChange).not.toHaveBeenCalled();

        await expect(canvas.queryByText('Apple')).toBeNull();
        await expect(canvas.getByText('Guava')).toBeVisible();
    },
    render: (args) => {
        const [value, setValue] = useState<string | null>('guava');

        const handleChange = (value: string | null) => {
            setValue(value);
            if (args.onChange !== undefined) {
                (args.onChange as (value: string | null) => void)(value);
            }
        };

        return (
            <Autocomplete
                {...args}
                multiple={false}
                value={value}
                onChange={handleChange}
            />
        );
    },
    args: {
        label: 'Autocomplete',
        name: 'basic',
        onChange: fn(),
        value: null,
        disabled: true,
        onSearch: async (query: string) => {
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

export const Required: Story = {
    play: async ({ canvas }) => {
        await expect(
            canvas.getByLabelText('This is required autocomplete', {
                exact: false
            })
        ).toBeRequired();
        await expect(
            canvas.getByText('This is required autocomplete', {
                exact: false
            }).tagName
        ).toBe('LABEL');
        await expect(
            canvas.getByText('This is required autocomplete', {
                exact: false
            })
        ).toHaveTextContent('*');
    },
    args: {
        label: 'This is required autocomplete',
        required: true,
        onChange: fn(),
        value: null,
        onSearch: async (query: string) => {
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
        await expect(
            canvas.getByRole('textbox').parentElement?.parentElement?.parentElement?.parentElement?.previousSibling
        ).toHaveTextContent('Label');
        await expect(canvas.getByRole('textbox').parentElement?.parentElement?.parentElement?.parentElement?.nextSibling).toHaveTextContent(
            'This field is required!'
        );
    },
    args: {
        label: 'Label',
        required: true,
        placeholder: 'This is placeholder...',
        error: 'This field is required!',
        onChange: fn(),
        value: null,
        onSearch: async (query: string) => {
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

export const AutocompleteOnly: Story = {
    play: async ({ canvas }) => {
        await expect(canvas.getByRole('textbox')).toHaveAttribute('aria-label', 'Labelless autocomplete');
    },
    args: {
        'aria-label': 'Labelless autocomplete',
        onChange: fn(),
        value: null,
        onSearch: async (query: string) => {
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
