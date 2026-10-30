import { useState } from 'react';
import { expect, fn, mocked, waitFor } from 'storybook/test';
import type { Meta, StoryObj } from '@storybook/react-vite';

import { useAppForm } from '../../hooks/form';
import type { AutocompleteProps } from './Autocomplete.types';
import { Autocomplete } from './Autocomplete';
import { localization } from '../../utils/constants';

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

export const UnavailableSelection: Story = {
    args: {
        label: 'Ovocie',
        multiple: true,
        onSearch: async () => ({ options, page: 0, hasNextPage: false }),
        onFetch: async (value) => options.find((option) => option.value === value) ?? null
    },
    render: (args) => {
        const form = useAppForm({ defaultValues: { basic: ['apple', 'missing-id'] } });

        return (
            <>
                <form.AppField
                    name='basic'
                    children={(field) => <field.Autocomplete {...args} />}
                />
                <form.Subscribe selector={(state) => state.values.basic}>
                    {(basic) => <output>{JSON.stringify(basic)}</output>}
                </form.Subscribe>
            </>
        );
    },
    play: async ({ canvas, userEvent }) => {
        await expect(await canvas.findByRole('button', { name: 'Apple' })).toBeVisible();
        const unavailable = await canvas.findByRole('button', { name: 'missing-id' });
        await expect(unavailable.parentElement).toHaveClass('bg-danger');
        await expect(canvas.getByRole('status')).toHaveTextContent('["apple","missing-id"]');

        await expect(unavailable.parentElement).toHaveAttribute('title', localization.unavailableOption);
        await userEvent.click(canvas.getByRole('button', { name: localization.remove('missing-id') }));
        await expect(canvas.getByRole('status')).toHaveTextContent('["apple"]');
    }
};

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

export const SearchFailure: Story = {
    args: {
        label: 'Search with retry',
        onSearch: fn(async () => ({ options: [options[0]], page: 0, hasNextPage: false })),
        onFetch: async () => null
    },
    play: async ({ args, canvas, userEvent }) => {
        mocked(args.onSearch).mockRejectedValueOnce(new globalThis.Error('Network unavailable'));
        await userEvent.type(canvas.getByRole('textbox'), '{ArrowDown}');
        await expect(await canvas.findByRole('alert')).toHaveTextContent(localization.autocompleteSearchError);
        await expect(canvas.queryByText(localization.noOptions)).toBeNull();
        const retry = canvas.getByRole('button', { name: localization.retry });
        await expect(canvas.getByRole('alert')).toHaveClass('text-danger');
        await expect(retry).toHaveAttribute('title', localization.retry);
        await expect(retry).toHaveTextContent(localization.autocompleteSearchError);
        await userEvent.click(canvas.getByRole('alert'));
        await expect(await canvas.findByRole('button', { name: 'Apple' })).toBeVisible();
        await expect(canvas.queryByRole('alert')).toBeNull();
    }
};

export const PaginationFailure: Story = {
    args: {
        label: 'Pagination with retry',
        onSearch: fn(async () => ({ options: [options[10]], page: 1, hasNextPage: false })),
        onFetch: async () => null
    },
    play: async ({ args, canvas, userEvent }) => {
        mocked(args.onSearch)
            .mockResolvedValueOnce({ options: options.slice(0, 10), page: 0, hasNextPage: true })
            .mockRejectedValueOnce(new globalThis.Error('Network unavailable'));
        await userEvent.type(canvas.getByRole('textbox'), '{ArrowDown}');
        const apple = await canvas.findByRole('button', { name: 'Apple' });
        const popover = apple.closest('[popover]') as HTMLElement;
        popover.scrollTop = popover.scrollHeight;
        await expect(await canvas.findByRole('alert')).toHaveTextContent(localization.autocompleteSearchError);
        await expect(apple).toBeInTheDocument();
        await expect(canvas.getByRole('alert').parentElement!.getBoundingClientRect().height).toBe(
            apple.parentElement!.getBoundingClientRect().height
        );
        await waitFor(async () => {
            const errorBounds = canvas.getByRole('alert').parentElement!.getBoundingClientRect();
            const popoverBounds = popover.getBoundingClientRect();
            await expect(errorBounds.bottom).toBeLessThanOrEqual(popoverBounds.bottom);
            await expect(errorBounds.top).toBeGreaterThanOrEqual(popoverBounds.top);
        });
        popover.dispatchEvent(new Event('scroll'));
        await expect(args.onSearch).toHaveBeenCalledTimes(2);
        const retry = canvas.getByRole('button', { name: localization.retry });
        await expect(canvas.getByRole('alert')).toHaveClass('text-danger');
        await expect(retry).toHaveAttribute('title', localization.retry);
        await expect(retry).toHaveTextContent(localization.autocompleteSearchError);
        await userEvent.click(canvas.getByRole('alert'));
        await expect(await canvas.findByRole('button', { name: 'Dragonfruit' })).toBeInTheDocument();
        await expect(args.onSearch).toHaveBeenLastCalledWith('', 1, 10, expect.any(AbortSignal));
        await expect(canvas.queryByRole('alert')).toBeNull();
    }
};

export const SearchCancellation: Story = {
    args: {
        label: 'Cancellable search',
        onSearch: fn((query: string, _page: number, _pageSize: number, signal: AbortSignal) => {
            if (query) {
                return Promise.resolve({ options: [options[0]], page: 0, hasNextPage: false });
            }
            return new Promise<import('./Autocomplete.types').OnSearchResult>((_resolve, reject) => {
                signal.addEventListener('abort', () => reject(new DOMException('Aborted', 'AbortError')), { once: true });
            });
        }),
        onFetch: async () => null
    },
    render: (args) => {
        const [visible, setVisible] = useState(true);
        const form = useAppForm({ defaultValues: { basic: '' } });
        return (
            <>
                <button
                    type='button'
                    className='m-md rounded-sm border px-md py-sm cursor-pointer hover:bg-secondary-extra-light'
                    onClick={() => setVisible(!visible)}
                >
                    Toggle autocomplete
                </button>
                {visible && (
                    <form.AppField
                        name='basic'
                        children={(field) => <field.Autocomplete {...args} />}
                    />
                )}
            </>
        );
    },
    play: async ({ args, canvas, userEvent }) => {
        await userEvent.type(canvas.getByRole('textbox'), '{ArrowDown}a');
        await expect(await canvas.findByRole('button', { name: 'Apple' })).toBeVisible();
        const search = mocked(args.onSearch);
        await expect(search.mock.calls[0][3].aborted).toBe(true);
        await expect(canvas.queryByRole('alert')).toBeNull();
        await userEvent.clear(canvas.getByRole('textbox'));
        await userEvent.click(canvas.getByRole('button', { name: 'Toggle autocomplete' }));
        await expect(search.mock.lastCall?.[3].aborted).toBe(true);
    }
};

export const SelectedLabelFailure: Story = {
    args: {
        label: 'Selected option with retry',
        onSearch: fn(async () => ({ options, page: 0, hasNextPage: false })),
        onFetch: fn(async (value: string) => options.find((option) => option.value === value) ?? null)
    },
    beforeEach: ({ args }) => {
        mocked(args.onFetch).mockRejectedValueOnce(new globalThis.Error('Network unavailable'));
    },
    render: (args) => {
        const form = useAppForm({ defaultValues: { basic: 'apple' } });
        return (
            <>
                <form.AppField
                    name='basic'
                    children={(field) => <field.Autocomplete {...args} />}
                />
                <form.Subscribe selector={(state) => state.values.basic}>{(basic) => <output>{basic}</output>}</form.Subscribe>
                <button
                    type='button'
                    className='m-md rounded-sm border px-md py-sm cursor-pointer hover:bg-secondary-extra-light'
                    onClick={() => form.setFieldValue('basic', 'banana')}
                >
                    Set Banana
                </button>
            </>
        );
    },
    play: async ({ args, canvas, userEvent }) => {
        await expect(await canvas.findByRole('alert')).toHaveTextContent(localization.autocompleteFetchError);
        await expect(canvas.getByRole('alert').parentElement!.getBoundingClientRect().height).toBe(20);
        await expect(canvas.getByRole('status')).toHaveTextContent('apple');
        await expect(canvas.queryByRole('button', { name: 'apple' })).toBeNull();
        const retry = canvas.getByRole('button', { name: localization.retry });
        await expect(retry).toHaveAttribute('title', localization.retry);
        await expect(retry).toHaveTextContent(localization.autocompleteFetchError);
        await userEvent.click(canvas.getByRole('alert'));
        await expect(await canvas.findByRole('button', { name: 'Apple' })).toBeVisible();
        await expect(canvas.getByRole('status')).toHaveTextContent('apple');
        await expect(canvas.queryByRole('alert')).toBeNull();
        await expect(args.onSearch).not.toHaveBeenCalled();

        mocked(args.onFetch).mockRejectedValueOnce(new globalThis.Error('Network unavailable'));
        await userEvent.click(canvas.getByRole('button', { name: 'Set Banana' }));
        await expect(await canvas.findByRole('alert')).toHaveTextContent(localization.autocompleteFetchError);
        await expect(canvas.getByRole('status')).toHaveTextContent('banana');
        await userEvent.click(canvas.getByRole('button', { name: localization.retry }));
        await expect(await canvas.findByRole('button', { name: 'Banana' })).toBeVisible();
        await expect(args.onFetch).toHaveBeenLastCalledWith('banana', expect.any(AbortSignal));
        await expect(canvas.getByRole('status')).toHaveTextContent('banana');
        await expect(canvas.queryByRole('alert')).toBeNull();
    }
};

export const SelectAfterFetchFailure: Story = {
    ...SelectedLabelFailure,
    play: async ({ canvas, userEvent }) => {
        await expect(await canvas.findByRole('alert')).toHaveTextContent(localization.autocompleteFetchError);
        await expect(canvas.getByRole('status')).toHaveTextContent('apple');
        await userEvent.type(canvas.getByRole('textbox'), '{ArrowDown}');
        await userEvent.click(await canvas.findByRole('button', { name: 'Banana' }));
        await expect(canvas.getByRole('status')).toHaveTextContent('banana');
        await expect(canvas.queryByRole('alert')).toBeNull();
    }
};

export const ReadOnly: Story = {
    args: {
        label: 'Read-only autocomplete',
        readOnly: true,
        onSearch: fn(async () => ({ options, page: 0, hasNextPage: false })),
        onFetch: async (value) => options.find((option) => option.value === value) ?? null
    },
    render: (args) => {
        const form = useAppForm({ defaultValues: { basic: args.multiple ? ['apple', 'banana'] : 'apple' } });
        return (
            <>
                <form.AppField
                    name='basic'
                    children={(field) => <field.Autocomplete {...args} />}
                />
                <form.Subscribe selector={(state) => state.values.basic}>
                    {(basic) => <output>{JSON.stringify(basic)}</output>}
                </form.Subscribe>
            </>
        );
    },
    play: async ({ args, canvas, userEvent }) => {
        await expect(await canvas.findByRole('button', { name: 'Apple' })).toBeVisible();
        const input = canvas.getByRole('textbox');
        await expect(input).toHaveAttribute('readonly');
        await expect(input).not.toBeDisabled();
        const dropdown = input.nextElementSibling as HTMLButtonElement;
        await expect(dropdown).toBeDisabled();
        await expect(canvas.queryByRole('button', { name: localization.remove('Apple') })).toBeNull();
        await userEvent.click(dropdown);
        await userEvent.type(input, '{ArrowDown}{Enter}');
        await expect(input).toHaveFocus();
        await expect(args.onSearch).not.toHaveBeenCalled();
        await expect(canvas.getByRole('status')).toHaveTextContent(args.multiple ? '["apple","banana"]' : '"apple"');
    }
};

export const ReadOnlyMultiple: Story = {
    ...ReadOnly,
    args: { ...ReadOnly.args, multiple: true }
};

export const BecomeReadOnly: Story = {
    args: ReadOnly.args,
    render: (args) => {
        const [readOnly, setReadOnly] = useState(false);
        const form = useAppForm({ defaultValues: { basic: 'apple' } });
        return (
            <>
                <form.AppField
                    name='basic'
                    children={(field) => (
                        <field.Autocomplete
                            {...args}
                            readOnly={readOnly}
                        />
                    )}
                />
                <button
                    type='button'
                    onClick={() => setReadOnly(true)}
                >
                    Make read-only
                </button>
                <form.Subscribe selector={(state) => state.values.basic}>{(basic) => <output>{basic}</output>}</form.Subscribe>
            </>
        );
    },
    play: async ({ canvas, userEvent }) => {
        await expect(await canvas.findByRole('button', { name: 'Apple' })).toBeVisible();
        await userEvent.type(canvas.getByRole('textbox'), '{ArrowDown}');
        const banana = await canvas.findByRole('button', { name: 'Banana' });
        // Keep focus inside the popup so blur does not close it before the prop changes.
        canvas.getByRole('button', { name: 'Make read-only' }).click();
        await waitFor(() => expect(banana).not.toBeInTheDocument());
        await userEvent.type(canvas.getByRole('textbox'), '{ArrowDown}{Enter}');
        await expect(canvas.getByRole('status')).toHaveTextContent('apple');
    }
};
