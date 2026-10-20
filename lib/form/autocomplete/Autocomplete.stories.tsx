import { useState } from 'react';
import type { Option } from '../../common/Option';

import { expect, fn, waitFor } from 'storybook/test';
import type { Meta, StoryObj } from '@storybook/react-vite';

import { useAppForm } from '../../hooks/form';
import type { AutocompleteProps } from './Autocomplete.types';
import { Autocomplete } from './Autocomplete';

const meta = {
    title: 'Form/Autocomplete',
    component: Autocomplete,
    tags: ['autodocs'],
    argTypes: {
        disabled: { control: 'boolean' },
        multiple: { control: false }
    },
    render: (args: AutocompleteProps, { parameters }) => {
        const defVal = args.multiple === true ? [] : '';

        const form = useAppForm({ defaultValues: { basic: parameters.defaultValue ?? defVal } });

        return (
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    parameters.onSubmit?.();
                    form.handleSubmit();
                }}
            >
                <form.AppField
                    name='basic'
                    listeners={{
                        onChange: parameters.onChange
                    }}
                    children={(field) => <field.Autocomplete {...args} />}
                />
            </form>
        );
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
    play: async ({ parameters, canvas, userEvent }) => {
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
        await expect(parameters.onChange).toHaveBeenCalledTimes(1);

        await expect(canvas.queryByText('Guava')).toBeNull();
        await expect(canvas.getByText('Apple')).toBeVisible();
        await expect(canvas.getByText('Apple').tagName).toBe('BUTTON');

        // find button with aria-label Remove Apple and click it
        const removeButton = canvas.getByLabelText('Odstrániť Apple');
        await userEvent.click(removeButton);
        // wait for 800ms here to allow useEffects to settle
        await new Promise((resolve) => setTimeout(resolve, 800));
        await expect(parameters.onChange).toHaveBeenCalledTimes(2);
    },
    args: {
        label: 'Autocomplete',
        name: 'basic',
        onSearch: async (query: string, page, pageSize) => {
            return new Promise((resolve) => {
                setTimeout(
                    () => {
                        const filteredOptions = options.filter((option) => option.label.toLowerCase().includes(query.toLowerCase()));
                        resolve({
                            options: filteredOptions.slice(page * pageSize, page * pageSize + pageSize),
                            hasNextPage: filteredOptions.length > (page + 1) * pageSize,
                            page: page
                        });
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
    },
    parameters: {
        onChange: fn(),
        defaultValue: 'guava'
    }
};

export const Multiple: Story = {
    play: async ({ parameters, canvas, userEvent }) => {
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
        await expect(parameters.onChange).toHaveBeenCalledTimes(1);

        await expect(canvas.queryByText('Guava')).toBeVisible();
        await expect(canvas.getByText('Guava').tagName).toBe('BUTTON');
        await expect(canvas.queryByText('Kiwi')).toBeVisible();
        await expect(canvas.getByText('Kiwi').tagName).toBe('BUTTON');
        await expect(canvas.queryByText('Apple')).toBeVisible();
        await expect(canvas.getByText('Apple').tagName).toBe('BUTTON');

        // find button with aria-label Remove Apple and click it
        await userEvent.click(canvas.getByLabelText('Odstrániť Apple'));
        // wait for 800ms here to allow useEffects to settle
        await new Promise((resolve) => setTimeout(resolve, 800));
        await expect(parameters.onChange).toHaveBeenCalledTimes(2);

        await expect(canvas.queryByText('Guava')).toBeVisible();
        await expect(canvas.queryByText('Kiwi')).toBeVisible();
        await expect(canvas.queryByText('Apple')).toBeNull();

        // find button with aria-label Remove Apple and click it
        await userEvent.click(canvas.getByLabelText('Odstrániť Guava'));
        // wait for 800ms here to allow useEffects to settle
        await new Promise((resolve) => setTimeout(resolve, 800));
        await expect(parameters.onChange).toHaveBeenCalledTimes(3);

        await expect(canvas.queryByText('Guava')).toBeNull();
        await expect(canvas.queryByText('Kiwi')).toBeVisible();
        await expect(canvas.queryByText('Apple')).toBeNull();
    },
    args: {
        label: 'MultiAutocomplete',
        name: 'basic',
        multiple: true,
        onSearch: async (query: string, page, pageSize) => {
            return new Promise((resolve) => {
                setTimeout(
                    () => {
                        const filteredOptions = options.filter((option) => option.label.toLowerCase().includes(query.toLowerCase()));
                        resolve({
                            options: filteredOptions.slice(page * pageSize, page * pageSize + pageSize),
                            hasNextPage: filteredOptions.length > (page + 1) * pageSize,
                            page: page
                        });
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
    },
    parameters: {
        onChange: fn(),
        defaultValue: ['guava', 'kiwi']
    }
};

export const Disabled: Story = {
    play: async ({ parameters, canvas, userEvent }) => {
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
        await expect(parameters.onChange).not.toHaveBeenCalled();

        await expect(canvas.queryByText('Apple')).toBeNull();
        await expect(canvas.getByText('Guava')).toBeVisible();
    },
    args: {
        label: 'Autocomplete',
        name: 'basic',
        disabled: true,
        onSearch: async (query: string, page, pageSize) => {
            return new Promise((resolve) => {
                setTimeout(
                    () => {
                        const filteredOptions = options.filter((option) => option.label.toLowerCase().includes(query.toLowerCase()));
                        resolve({
                            options: filteredOptions.slice(page * pageSize, page * pageSize + pageSize),
                            hasNextPage: filteredOptions.length > (page + 1) * pageSize,
                            page: page
                        });
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
    },
    parameters: {
        onChange: fn(),
        defaultValue: 'guava'
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
        onSearch: async (query: string, page, pageSize) => {
            return new Promise((resolve) => {
                setTimeout(
                    () => {
                        const filteredOptions = options.filter((option) => option.label.toLowerCase().includes(query.toLowerCase()));
                        resolve({
                            options: filteredOptions.slice(page * pageSize, page * pageSize + pageSize),
                            hasNextPage: filteredOptions.length > (page + 1) * pageSize,
                            page: page
                        });
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
        onSearch: async (query: string, page, pageSize) => {
            return new Promise((resolve) => {
                setTimeout(
                    () => {
                        const filteredOptions = options.filter((option) => option.label.toLowerCase().includes(query.toLowerCase()));
                        resolve({
                            options: filteredOptions.slice(page * pageSize, page * pageSize + pageSize),
                            hasNextPage: filteredOptions.length > (page + 1) * pageSize,
                            page: page
                        });
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
        onSearch: async (query: string, page, pageSize) => {
            return new Promise((resolve) => {
                setTimeout(
                    () => {
                        const filteredOptions = options.filter((option) => option.label.toLowerCase().includes(query.toLowerCase()));
                        resolve({
                            options: filteredOptions.slice(page * pageSize, page * pageSize + pageSize),
                            hasNextPage: filteredOptions.length > (page + 1) * pageSize,
                            page: page
                        });
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
    },
    parameters: {
        onChange: fn(),
        defaultValue: ''
    }
};

export const InsideForm: Story = {
    play: async ({ parameters, canvas, userEvent }) => {
        const input = canvas.getByRole('textbox');
        const form = input.closest('form');

        if (!form) throw new globalThis.Error('Autocomplete must be rendered inside a form');

        await userEvent.type(input, 'Apple');
        await userEvent.click(await canvas.findByRole('button', { name: 'Apple' }));

        await waitFor(() => expect(parameters.onChange).toHaveBeenCalledTimes(1));
        await expect(canvas.getByLabelText('Odstrániť Apple')).toBeVisible();
        await expect(parameters.onSubmit).not.toHaveBeenCalled();

        form.requestSubmit();
        await expect(parameters.onSubmit).toHaveBeenCalledTimes(1);
    },
    args: {
        label: 'Autocomplete',
        onSearch: async () => ({
            options: [{ label: 'Apple', value: 'apple' }],
            hasNextPage: false,
            page: 0
        }),
        onFetch: async (value) => (value === 'apple' ? { label: 'Apple', value: 'apple' } : null)
    },
    parameters: {
        onChange: fn(),
        onSubmit: fn(),
        defaultValue: ''
    }
};

// Each lookup stays pending until its explicit resolve button is pressed.
const deferredOption = () => {
    let resolve!: (option: Option | null) => void;
    const promise = new Promise<Option | null>((done) => {
        resolve = done;
    });

    return { promise, resolve };
};

const FetchRaceExample = (args: AutocompleteProps) => {
    const [requests] = useState(() => ({ apple: deferredOption(), banana: deferredOption(), apricot: deferredOption() }));
    const [mounted, setMounted] = useState(true);
    const form = useAppForm({ defaultValues: { basic: args.multiple ? ([] as string[]) : '' } });
    const onFetch = (value: string) => requests[value as keyof typeof requests].promise;

    return (
        <>
            {mounted && (
                <form.AppField name='basic'>
                    {(field) => (
                        <field.Autocomplete
                            {...args}
                            onFetch={onFetch}
                        />
                    )}
                </form.AppField>
            )}
            {(['apple', 'banana', 'apricot'] as const).map((value) => (
                <span key={value}>
                    <button
                        type='button'
                        onClick={() => form.setFieldValue('basic', args.multiple ? [value] : value)}
                    >
                        Set {value}
                    </button>
                    <button
                        type='button'
                        onClick={() => requests[value].resolve(options.find((option) => option.value === value)!)}
                    >
                        Resolve {value}
                    </button>
                </span>
            ))}
            <button
                type='button'
                onClick={() => form.reset()}
            >
                Reset field
            </button>
            <button
                type='button'
                onClick={() => setMounted(false)}
            >
                Unmount field
            </button>
            <form.Subscribe selector={(state) => state.values.basic}>
                {(value) => <output aria-label='Stored value'>{JSON.stringify(value)}</output>}
            </form.Subscribe>
        </>
    );
};

export const StaleFetchSingle: Story = {
    render: (args) => <FetchRaceExample {...args} />,
    args: {
        label: 'Fetch race',
        onSearch: async () => ({ options: [], page: 0, hasNextPage: false }),
        onFetch: async () => null
    },
    play: async ({ canvas, userEvent, args }) => {
        const stored = canvas.getByLabelText('Stored value');
        const expected = (value: string) => JSON.stringify(args.multiple ? (value ? [value] : []) : value);
        const click = async (name: string) => userEvent.click(canvas.getByRole('button', { name }));

        await click('Set apple');
        await waitFor(() => expect(canvas.getByRole('textbox')).toBeDisabled());
        await click('Set banana');
        await click('Resolve banana');
        await waitFor(() => expect(canvas.getByLabelText('Odstrániť Banana')).toBeVisible());
        await expect(canvas.getByRole('textbox')).toBeEnabled();
        await click('Resolve apple');
        await expect(stored).toHaveTextContent(expected('banana'));
        await expect(canvas.queryByLabelText('Odstrániť Apple')).toBeNull();
        await expect(canvas.getByLabelText('Odstrániť Banana')).toBeVisible();

        // Reset after initialization too: an older displayed selection must not write back.
        await click('Set apricot');
        await waitFor(() => expect(canvas.getByRole('textbox')).toBeDisabled());
        await click('Reset field');
        await waitFor(() => expect(canvas.getByRole('textbox')).toBeEnabled());
        await click('Resolve apricot');
        await expect(stored).toHaveTextContent(expected(''));
        await expect(canvas.queryByLabelText('Odstrániť Apricot')).toBeNull();
        await expect(canvas.queryByLabelText('Odstrániť Banana')).toBeNull();
    }
};

export const StaleFetchMultiple: Story = {
    ...StaleFetchSingle,
    args: { ...StaleFetchSingle.args, multiple: true }
};

export const ResetDuringInitialFetch: Story = {
    ...StaleFetchSingle,
    play: async ({ canvas, userEvent }) => {
        await userEvent.click(canvas.getByRole('button', { name: 'Set apple' }));
        await waitFor(() => expect(canvas.getByRole('textbox')).toBeDisabled());
        await userEvent.click(canvas.getByRole('button', { name: 'Reset field' }));
        await waitFor(() => expect(canvas.getByRole('textbox')).toBeEnabled());
        await userEvent.click(canvas.getByRole('button', { name: 'Resolve apple' }));
        await expect(canvas.getByLabelText('Stored value')).toHaveTextContent('""');
        await expect(canvas.queryByLabelText('Odstrániť Apple')).toBeNull();
    }
};

export const UnmountDuringFetch: Story = {
    ...StaleFetchSingle,
    play: async ({ canvas, userEvent }) => {
        await userEvent.click(canvas.getByRole('button', { name: 'Set apple' }));
        await waitFor(() => expect(canvas.getByRole('textbox')).toBeDisabled());
        await userEvent.click(canvas.getByRole('button', { name: 'Unmount field' }));
        await userEvent.click(canvas.getByRole('button', { name: 'Resolve apple' }));
        await expect(canvas.queryByRole('textbox')).toBeNull();
        await expect(canvas.getByLabelText('Stored value')).toHaveTextContent('"apple"');
    }
};

export const StaleFetchKeepsLoading: Story = {
    ...StaleFetchSingle,
    play: async ({ canvas, userEvent }) => {
        await userEvent.click(canvas.getByRole('button', { name: 'Set apple' }));
        await waitFor(() => expect(canvas.getByRole('textbox')).toBeDisabled());
        await userEvent.click(canvas.getByRole('button', { name: 'Set banana' }));
        await userEvent.click(canvas.getByRole('button', { name: 'Resolve apple' }));
        await expect(canvas.getByRole('textbox')).toBeDisabled();
        await expect(canvas.getByLabelText('Stored value')).toHaveTextContent('"banana"');
        await expect(canvas.queryByLabelText('Odstrániť Apple')).toBeNull();
        await userEvent.click(canvas.getByRole('button', { name: 'Resolve banana' }));
        await waitFor(() => expect(canvas.getByRole('textbox')).toBeEnabled());
        await expect(canvas.getByLabelText('Odstrániť Banana')).toBeVisible();
    }
};
