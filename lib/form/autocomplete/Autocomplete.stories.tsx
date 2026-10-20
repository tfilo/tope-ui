import { useEffect, useRef, useState } from 'react';
import { renderToString } from 'react-dom/server';
import { hydrateRoot } from 'react-dom/client';
import { Modal } from '../../general/modal';
import type { Option } from '../../common/Option';

import { expect, fn, waitFor } from 'storybook/test';
import type { Meta, StoryObj } from '@storybook/react-vite';

import { useAppForm } from '../../hooks/form';
import type { AutocompleteProps } from './Autocomplete.types';
import { Autocomplete } from './Autocomplete';
import { Button } from '../../general/button';

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
        await expect(canvas.getByRole('combobox')).toBeVisible();
        await expect(canvas.getByLabelText('Autocomplete', { selector: 'input' })).toBeVisible();
        await expect(canvas.getByLabelText('Autocomplete', { selector: 'input' }).tagName).toBe('INPUT');
        // wait for 800ms here to allow useEffects to settle
        await new Promise((resolve) => setTimeout(resolve, 800));
        await expect(canvas.queryByText('Guava')).toBeVisible();
        await expect(canvas.getByText('Guava').tagName).toBe('BUTTON');
        await userEvent.type(canvas.getByRole('combobox'), '{ArrowDown}Apple');
        // wait for fetch to finish
        await new Promise((resolve) => setTimeout(resolve, 1700));
        canvas
            .queryAllByRole('option')
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
        await expect(canvas.getByRole('combobox')).toBeVisible();
        await expect(canvas.getByLabelText('MultiAutocomplete', { selector: 'input' })).toBeVisible();
        await expect(canvas.getByLabelText('MultiAutocomplete', { selector: 'input' }).tagName).toBe('INPUT');
        // wait for 800ms here to allow useEffects to settle
        await new Promise((resolve) => setTimeout(resolve, 800));
        await expect(canvas.queryByText('Guava')).toBeVisible();
        await expect(canvas.getByText('Guava').tagName).toBe('BUTTON');
        await expect(canvas.queryByText('Kiwi')).toBeVisible();
        await expect(canvas.getByText('Kiwi').tagName).toBe('BUTTON');
        await userEvent.type(canvas.getByRole('combobox'), '{ArrowDown}Apple');
        // wait for fetch to finish
        await new Promise((resolve) => setTimeout(resolve, 1700));
        canvas
            .queryAllByRole('option')
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
        await expect(canvas.getByRole('combobox')).toBeVisible();
        await expect(canvas.getByLabelText('Autocomplete', { selector: 'input' })).toBeVisible();
        await expect(canvas.getByLabelText('Autocomplete', { selector: 'input' }).tagName).toBe('INPUT');
        await expect(canvas.getByLabelText('Autocomplete', { selector: 'input' })).toBeDisabled();
        // wait for 800ms here to allow useEffects to settle
        await new Promise((resolve) => setTimeout(resolve, 800));
        await expect(canvas.queryByText('Guava')).toBeVisible();
        await expect(canvas.getByText('Guava').tagName).toBe('BUTTON');
        await expect(canvas.queryByText('Remove Guava')).toBeNull();
        await userEvent.type(canvas.getByRole('combobox'), '{ArrowDown}Apple');
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
                selector: 'input',
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
        const byLabel = canvas.getByLabelText('Label', { exact: false, selector: 'input' });
        const byError = canvas.getByLabelText('This field is required!');
        await expect(canvas.getByRole('combobox')).toBeVisible();
        await expect(byLabel).toBeVisible();
        await expect(byError).toBeVisible();
        // Element retrieved by its label should be same as element retrieved by error label
        await expect(byLabel).toStrictEqual(byError);

        // Check that label is before and error after element
        await expect(
            canvas.getByRole('combobox').parentElement?.parentElement?.parentElement?.parentElement?.previousSibling
        ).toHaveTextContent('Label');
        await expect(
            canvas.getByRole('combobox').parentElement?.parentElement?.parentElement?.parentElement?.nextSibling
        ).toHaveTextContent('This field is required!');
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
        await expect(canvas.getByRole('combobox')).toHaveAttribute('aria-label', 'Labelless autocomplete');
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
        const input = canvas.getByRole('combobox');
        const form = input.closest('form');

        if (!form) throw new globalThis.Error('Autocomplete must be rendered inside a form');

        await userEvent.type(input, 'Apple');
        await userEvent.click(await canvas.findByRole('option', { name: 'Apple' }));

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
    let reject!: (reason: unknown) => void;
    const promise = new Promise<Option | null>((done, fail) => {
        resolve = done;
        reject = fail;
    });

    return { promise, resolve, reject };
};

const FetchRaceExample = (args: AutocompleteProps) => {
    const [requests] = useState(() => ({ apple: deferredOption(), banana: deferredOption(), apricot: deferredOption() }));
    const [mounted, setMounted] = useState(true);
    const form = useAppForm({ defaultValues: { basic: args.multiple ? ([] as string[]) : '' } });
    const onFetch = (value: string) => requests[value as keyof typeof requests].promise;

    return (
        <div className='flex flex-col gap-lg'>
            {mounted && (
                <form.AppField name='basic'>
                    {(field) => (
                        <field.Autocomplete
                            {...args}
                            autoComplete='off'
                            onFetch={onFetch}
                        />
                    )}
                </form.AppField>
            )}
            {(['apple', 'banana', 'apricot'] as const).map((value) => (
                <div
                    key={value}
                    className='flex flex-wrap gap-md'
                >
                    <Button
                        variant='outline'
                        onClick={() => form.setFieldValue('basic', args.multiple ? [value] : value)}
                    >
                        Set {value}
                    </Button>
                    <Button
                        variant='outline'
                        onClick={() => requests[value].resolve(options.find((option) => option.value === value)!)}
                    >
                        Resolve {value}
                    </Button>
                    <Button
                        variant='outline'
                        onClick={() => requests[value].reject(new globalThis.Error('Lookup failed'))}
                    >
                        Reject {value}
                    </Button>
                </div>
            ))}
            <Button
                variant='outline'
                onClick={() => form.reset()}
            >
                Reset field
            </Button>
            <Button
                variant='outline'
                onClick={() => setMounted(false)}
            >
                Unmount field
            </Button>
            <form.Subscribe selector={(state) => state.values.basic}>
                {(value) => <output aria-label='Stored value'>{JSON.stringify(value)}</output>}
            </form.Subscribe>
        </div>
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
        await waitFor(() => expect(canvas.getByRole('combobox')).toBeDisabled());
        await click('Set banana');
        await click('Resolve banana');
        await waitFor(() => expect(canvas.getByLabelText('Odstrániť Banana')).toBeVisible());
        await expect(canvas.getByRole('combobox')).toBeEnabled();
        await click('Resolve apple');
        await expect(stored).toHaveTextContent(expected('banana'));
        await expect(canvas.queryByLabelText('Odstrániť Apple')).toBeNull();
        await expect(canvas.getByLabelText('Odstrániť Banana')).toBeVisible();

        // Reset after initialization too: an older displayed selection must not write back.
        await click('Set apricot');
        await waitFor(() => expect(canvas.getByRole('combobox')).toBeDisabled());
        await click('Reset field');
        await waitFor(() => expect(canvas.getByRole('combobox')).toBeEnabled());
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
        await waitFor(() => expect(canvas.getByRole('combobox')).toBeDisabled());
        await userEvent.click(canvas.getByRole('button', { name: 'Reset field' }));
        await waitFor(() => expect(canvas.getByRole('combobox')).toBeEnabled());
        await userEvent.click(canvas.getByRole('button', { name: 'Resolve apple' }));
        await expect(canvas.getByLabelText('Stored value')).toHaveTextContent('""');
        await expect(canvas.queryByLabelText('Odstrániť Apple')).toBeNull();
    }
};

export const UnmountDuringFetch: Story = {
    ...StaleFetchSingle,
    play: async ({ canvas, userEvent }) => {
        await userEvent.click(canvas.getByRole('button', { name: 'Set apple' }));
        await waitFor(() => expect(canvas.getByRole('combobox')).toBeDisabled());
        await userEvent.click(canvas.getByRole('button', { name: 'Unmount field' }));
        await userEvent.click(canvas.getByRole('button', { name: 'Resolve apple' }));
        await expect(canvas.queryByRole('combobox')).toBeNull();
        await expect(canvas.getByLabelText('Stored value')).toHaveTextContent('"apple"');
    }
};

export const StaleFetchKeepsLoading: Story = {
    ...StaleFetchSingle,
    play: async ({ canvas, userEvent }) => {
        await userEvent.click(canvas.getByRole('button', { name: 'Set apple' }));
        await waitFor(() => expect(canvas.getByRole('combobox')).toBeDisabled());
        await userEvent.click(canvas.getByRole('button', { name: 'Set banana' }));
        await userEvent.click(canvas.getByRole('button', { name: 'Resolve apple' }));
        await expect(canvas.getByRole('combobox')).toBeDisabled();
        await expect(canvas.getByLabelText('Stored value')).toHaveTextContent('"banana"');
        await expect(canvas.queryByLabelText('Odstrániť Apple')).toBeNull();
        await userEvent.click(canvas.getByRole('button', { name: 'Resolve banana' }));
        await waitFor(() => expect(canvas.getByRole('combobox')).toBeEnabled());
        await expect(canvas.getByLabelText('Odstrániť Banana')).toBeVisible();
    }
};

export const AccessibleKeyboardSingle: Story = {
    args: {
        label: 'Fruit',
        onSearch: async () => ({ options: [options[0], options[4], options[3]], page: 0, hasNextPage: false }),
        onFetch: async (value) => options.find((option) => option.value === value) ?? null
    },
    parameters: { a11y: { test: 'error' }, onChange: fn() },
    play: async ({ canvas, userEvent, args }) => {
        const input = canvas.getByRole('combobox', { name: 'Fruit' });
        const toggle = canvas.getByRole('button', { name: 'Vybrať možnosti' });
        await expect(input).toHaveAttribute('aria-expanded', 'false');
        await userEvent.click(input);
        await userEvent.keyboard('{ArrowUp}');
        await expect(input).toHaveAttribute('aria-expanded', 'false');
        await expect(canvas.queryByRole('listbox')).toBeNull();
        await userEvent.tab();
        await expect(toggle).toHaveFocus();
        await userEvent.keyboard(' ');
        await canvas.findByRole('listbox', { name: 'Fruit' });
        await expect(toggle).toHaveFocus();
        await userEvent.keyboard(' ');
        await expect(toggle).toHaveAttribute('aria-expanded', 'false');
        await expect(toggle).toHaveFocus();
        await userEvent.tab({ shift: true });
        await expect(input).toHaveFocus();
        await userEvent.click(toggle);
        await expect(input).toHaveFocus();
        const list = await canvas.findByRole('listbox', { name: 'Fruit' });
        await expect(input).toHaveAttribute('aria-controls', list.id);
        await expect(toggle).toHaveAttribute('aria-controls', list.id);
        await expect(toggle).toHaveAttribute('aria-expanded', 'true');
        await expect(list).toHaveAttribute('aria-multiselectable', String(!!args.multiple));
        const apple = await canvas.findByRole('option', { name: 'Apple' });
        const banana = canvas.getByRole('option', { name: 'Banana' });
        const disabled = canvas.getByRole('option', { name: 'Blackberry' });
        await expect(disabled).toBeDisabled();
        await expect(disabled).toHaveAttribute('aria-disabled', 'true');
        await expect(apple).toHaveAttribute('aria-selected', 'false');
        await userEvent.click(disabled);
        await expect(input).toHaveAttribute('aria-expanded', 'true');
        await userEvent.keyboard('{ArrowDown}');
        await expect(input).toHaveAttribute('aria-activedescendant', apple.id);
        await userEvent.keyboard('{ArrowDown}');
        await expect(input).toHaveAttribute('aria-activedescendant', banana.id);
        await expect(input).toHaveFocus();
        await userEvent.keyboard('{ArrowUp}');
        await expect(input).toHaveAttribute('aria-activedescendant', apple.id);
        // Up beyond the first enabled option restores the original close-to-input behavior.
        await userEvent.keyboard('{ArrowUp}');
        await expect(input).toHaveFocus();
        await expect(input).toHaveAttribute('aria-expanded', 'false');
        await expect(input).not.toHaveAttribute('aria-activedescendant');
        await expect(canvas.queryByRole('listbox')).toBeNull();
        await expect(toggle).toHaveAttribute('aria-expanded', 'false');
        await userEvent.keyboard('{ArrowUp}{ArrowUp}');
        await expect(input).toHaveAttribute('aria-expanded', 'false');
        // Typing continues directly in the input and opens a new search without selecting anything.
        await userEvent.keyboard('Ap');
        await expect(input).toHaveValue('Ap');
        await expect(canvas.queryByLabelText('Odstrániť Apple')).toBeNull();
        await canvas.findByRole('option', { name: 'Apple' });
        await userEvent.keyboard('{ArrowDown}{Enter}');
        await expect(canvas.getByLabelText('Odstrániť Apple')).toBeVisible();
        await expect(input).toHaveFocus();
        await expect(input).toHaveAttribute('aria-expanded', 'false');
        await expect(input).not.toHaveAttribute('aria-activedescendant');
        await userEvent.keyboard('{ArrowDown}');
        await expect(await canvas.findByRole('option', { name: 'Apple' })).toHaveAttribute('aria-selected', 'true');
        await userEvent.keyboard('{ArrowDown}{Enter}');
        await expect(canvas.getByLabelText('Odstrániť Banana')).toBeVisible();
        if (args.multiple) {
            await expect(canvas.getByLabelText('Odstrániť Apple')).toBeVisible();
        } else {
            await expect(canvas.queryByLabelText('Odstrániť Apple')).toBeNull();
        }
        await userEvent.keyboard('{ArrowDown}{Escape}');
        await expect(input).toHaveFocus();
        await expect(input).toHaveAttribute('aria-expanded', 'false');
        await expect(input).not.toHaveAttribute('aria-activedescendant');
        // Leave the list open so automated axe checks also cover popup semantics.
        await userEvent.click(toggle);
        await canvas.findByRole('option', { name: 'Banana' });
    }
};

export const AccessibleKeyboardMultiple: Story = {
    ...AccessibleKeyboardSingle,
    args: { ...AccessibleKeyboardSingle.args, multiple: true }
};

const AccessibleInstances = () => {
    const form = useAppForm({ defaultValues: { first: '', second: '' } });
    const props = {
        onSearch: async () => ({ options: [options[0]], page: 0, hasNextPage: false }),
        onFetch: async () => null
    };

    return (
        <>
            <form.AppField name='first'>
                {(field) => (
                    <field.Autocomplete
                        {...props}
                        label='First fruit'
                    />
                )}
            </form.AppField>
            <form.AppField name='second'>
                {(field) => (
                    <field.Autocomplete
                        {...props}
                        label='Second fruit'
                    />
                )}
            </form.AppField>
        </>
    );
};

export const IndependentRelationships: Story = {
    args: AccessibleKeyboardSingle.args,
    render: () => <AccessibleInstances />,
    parameters: { a11y: { test: 'error' } },
    play: async ({ canvas, canvasElement, userEvent }) => {
        const inputs = canvas.getAllByRole('combobox');
        await expect(inputs[0].id).not.toBe(inputs[1].id);
        for (const input of inputs) {
            await userEvent.click(input);
            await userEvent.keyboard('{ArrowDown}');
            const list = await canvas.findByRole('listbox');
            await expect(input).toHaveAttribute('aria-controls', list.id);
            const option = await canvas.findByRole('option');
            await expect(input).toHaveAttribute('aria-activedescendant', option.id);
            await userEvent.keyboard('{Escape}');
        }
        const ids = Array.from(canvasElement.querySelectorAll('[id]'), (element) => element.id);
        await expect(new Set(ids).size).toBe(ids.length);
    }
};

const HydrationExample = ({ onHydrated }: { onHydrated: () => void }) => {
    useEffect(onHydrated, [onHydrated]);

    return (
        <>
            <AccessibleInstances />
            <Modal
                title='Hydrated first'
                body='Body'
                openModal={false}
            />
            <Modal
                title='Hydrated second'
                body='Body'
                openModal={false}
            />
        </>
    );
};

export const StableHydrationIds: Story = {
    args: AccessibleKeyboardSingle.args,
    render: () => <div>Server-rendered controls are hydrated during this interaction test.</div>,
    play: async ({ canvasElement }) => {
        const onHydrated = fn();
        const onRecoverableError = fn();
        const example = <HydrationExample onHydrated={onHydrated} />;
        const host = document.createElement('div');
        host.innerHTML = renderToString(example, { identifierPrefix: 'hydration-' });
        canvasElement.append(host);
        const ids = () => Array.from(host.querySelectorAll('[id]'), (element) => element.id);
        const serverIds = ids();
        const root = hydrateRoot(host, example, { identifierPrefix: 'hydration-', onRecoverableError });
        try {
            await waitFor(() => expect(onHydrated).toHaveBeenCalledOnce());
            await expect(ids()).toEqual(serverIds);
            await expect(new Set(ids()).size).toBe(ids().length);
            await expect(onRecoverableError).not.toHaveBeenCalled();
            for (const element of host.querySelectorAll('[aria-controls], [aria-labelledby]')) {
                const target = element.getAttribute('aria-controls') ?? element.getAttribute('aria-labelledby');
                await expect(serverIds).toContain(target);
            }
        } finally {
            root.unmount();
            host.remove();
        }
    }
};

const controlledRequest = <T,>() => {
    let resolve!: (value: T) => void;
    let reject!: (reason: unknown) => void;
    const promise = new Promise<T>((done, fail) => {
        resolve = done;
        reject = fail;
    });

    return { promise, resolve, reject };
};

const RequestFailureExample = ({
    lookup = false,
    pagination = false,
    loadingRace = false
}: {
    lookup?: boolean;
    pagination?: boolean;
    loadingRace?: boolean;
}) => {
    const [requests] = useState(() => ({
        latest: controlledRequest<import('./Autocomplete.types').OnSearchResult>(),
        initial: controlledRequest<import('./Autocomplete.types').OnSearchResult>(),
        obsolete: controlledRequest<import('./Autocomplete.types').OnSearchResult>(),
        lookup: controlledRequest<Option | null>()
    }));
    const [fetchCalls, setFetchCalls] = useState(0);
    const form = useAppForm({ defaultValues: { basic: lookup ? 'apple' : '' } });
    const result = { options: [options[0]], hasNextPage: pagination, page: 0 };

    return (
        <div className='flex flex-col gap-lg'>
            <form.AppField name='basic'>
                {(field) => (
                    <field.Autocomplete
                        label='Requests'
                        autoComplete='off'
                        pageSize={1}
                        onSearch={(query, page, _size, signal) => {
                            if (pagination) return page === 0 ? Promise.resolve(result) : requests.initial.promise;
                            if (query === '') return requests.initial.promise;
                            if (query === 'a') {
                                return new Promise((_resolve, reject) => {
                                    signal.addEventListener('abort', () => reject(new DOMException('Cancelled', 'AbortError')), {
                                        once: true
                                    });
                                });
                            }
                            if (query === 'ab') return requests.obsolete.promise;

                            return loadingRace ? requests.latest.promise : Promise.resolve(result);
                        }}
                        onFetch={() => {
                            setFetchCalls((calls) => calls + 1);
                            return fetchCalls === 0 ? requests.lookup.promise : Promise.resolve(options[0]);
                        }}
                    />
                )}
            </form.AppField>
            <div
                className='flex flex-wrap gap-md'
                onMouseDown={(event) => event.preventDefault()}
            >
                <Button
                    variant='outline'
                    onClick={() => requests.latest.resolve(result)}
                >
                    Resolve latest
                </Button>
                <Button
                    variant='outline'
                    onClick={() => requests.initial.reject(new globalThis.Error('Offline'))}
                >
                    Fail request
                </Button>
                <Button
                    variant='outline'
                    onClick={() => requests.obsolete.reject(new globalThis.Error('Late failure'))}
                >
                    Fail obsolete
                </Button>
                <Button
                    variant='outline'
                    onClick={() => requests.lookup.reject(new globalThis.Error('Lookup failed'))}
                >
                    Fail lookup
                </Button>
            </div>
            <form.Subscribe selector={(state) => state.values.basic}>
                {(value) => <output aria-label='Stored value'>{value}</output>}
            </form.Subscribe>
        </div>
    );
};

// toBeVisible alone does not detect content clipped by a scroll container.
const expectInsidePopover = async (element: HTMLElement) => {
    const popover = element.closest('[popover]')!;
    const bounds = popover.getBoundingClientRect();
    const content = element.getBoundingClientRect();
    await expect(content.top).toBeGreaterThanOrEqual(bounds.top);
    await expect(content.bottom).toBeLessThanOrEqual(bounds.bottom);
};

export const RequestFailures: Story = {
    args: { onSearch: async () => ({ options: [], page: 0, hasNextPage: false }), onFetch: async () => null },
    render: () => <RequestFailureExample />,
    play: async ({ canvas, userEvent }) => {
        const input = canvas.getByRole('combobox');
        await userEvent.type(input, '{ArrowDown}');
        const loading = await canvas.findByText('Načítava sa...');
        await expectInsidePopover(loading);
        const loadingHeight = loading.getBoundingClientRect().height;
        await userEvent.click(canvas.getByRole('button', { name: 'Fail request' }));
        const alert = await canvas.findByRole('alert');
        await expect(alert).toHaveTextContent('Možnosti sa nepodarilo načítať');
        await expect(alert.getBoundingClientRect().height).toBe(loadingHeight);
        await expectInsidePopover(alert);
        // Reject an aborted request, then an obsolete request after a newer success.
        await userEvent.type(input, 'abc');
        await expect(await canvas.findByRole('option', { name: 'Apple' })).toBeVisible();
        await expect(canvas.queryByRole('alert')).toBeNull();
        await userEvent.click(canvas.getByRole('button', { name: 'Fail obsolete' }));
        await expect(canvas.getByRole('option', { name: 'Apple' })).toBeVisible();
        await expect(canvas.queryByRole('alert')).toBeNull();
        await userEvent.click(canvas.getByRole('option', { name: 'Apple' }));
        await expect(canvas.getByLabelText('Stored value')).toHaveTextContent('apple');
    }
};

export const NextPageFailure: Story = {
    args: { onSearch: async () => ({ options: [], page: 0, hasNextPage: false }), onFetch: async () => null },
    render: () => <RequestFailureExample pagination />,
    play: async ({ canvas, userEvent }) => {
        await userEvent.type(canvas.getByRole('combobox'), '{ArrowDown}');
        const apple = await canvas.findByRole('option', { name: 'Apple' });
        const scroller = apple.closest('ul')!.parentElement!;
        scroller.scrollTop = scroller.scrollHeight;
        scroller.dispatchEvent(new Event('scroll', { bubbles: true }));
        await waitFor(() => expect(canvas.getByText('Načítava sa...')).toBeVisible());
        await userEvent.click(canvas.getByRole('button', { name: 'Fail request' }));
        const alert = await canvas.findByRole('alert');
        await expect(alert).toBeVisible();
        await expectInsidePopover(alert);
        await expect(apple).toBeVisible();
        await expectInsidePopover(apple);
        await expect(canvas.queryByText('Načítava sa...')).toBeNull();
        await userEvent.click(apple);
        await expect(canvas.getByLabelText('Stored value')).toHaveTextContent('apple');
    }
};

export const LookupFailure: Story = {
    args: { onSearch: async () => ({ options: [], page: 0, hasNextPage: false }), onFetch: async () => null },
    render: () => <RequestFailureExample lookup />,
    play: async ({ canvas, userEvent }) => {
        await waitFor(() => expect(canvas.getByRole('combobox')).toBeDisabled());
        await userEvent.click(canvas.getByRole('button', { name: 'Fail lookup' }));
        await expect(await canvas.findByRole('alert')).toBeVisible();
        await expect(canvas.getByRole('combobox')).toBeEnabled();
        await expect(canvas.getByLabelText('Stored value')).toHaveTextContent('apple');
        await userEvent.click(canvas.getByRole('button', { name: 'Skúsiť znova' }));
        await expect(await canvas.findByLabelText('Odstrániť Apple')).toBeVisible();
        await expect(canvas.queryByRole('alert')).toBeNull();
    }
};

export const ObsoleteFailureKeepsLoading: Story = {
    args: RequestFailures.args,
    render: () => <RequestFailureExample loadingRace />,
    play: async ({ canvas, userEvent }) => {
        const input = canvas.getByRole('combobox');
        await userEvent.type(input, 'abc');
        await userEvent.click(canvas.getByRole('button', { name: 'Fail obsolete' }));
        await expect(canvas.getByText('Načítava sa...')).toBeVisible();
        await expect(canvas.queryByRole('alert')).toBeNull();
        await userEvent.click(canvas.getByRole('button', { name: 'Resolve latest' }));
        await expect(await canvas.findByRole('option', { name: 'Apple' })).toBeVisible();
        await expect(canvas.queryByText('Načítava sa...')).toBeNull();
    }
};

export const ObsoleteLookupFailure: Story = {
    ...StaleFetchSingle,
    play: async ({ canvas, userEvent }) => {
        await userEvent.click(canvas.getByRole('button', { name: 'Set apple' }));
        await waitFor(() => expect(canvas.getByRole('combobox')).toBeDisabled());
        await userEvent.click(canvas.getByRole('button', { name: 'Set banana' }));
        await userEvent.click(canvas.getByRole('button', { name: 'Reject apple' }));
        await expect(canvas.getByRole('combobox')).toBeDisabled();
        await expect(canvas.queryByRole('alert')).toBeNull();
        await userEvent.click(canvas.getByRole('button', { name: 'Resolve banana' }));
        await expect(await canvas.findByLabelText('Odstrániť Banana')).toBeVisible();
        await expect(canvas.getByRole('combobox')).toBeEnabled();
        await expect(canvas.getByLabelText('Stored value')).toHaveTextContent('"banana"');
    }
};

// Leave the failure visible after play finishes so it can be inspected in Storybook.
export const SearchFailure: Story = {
    args: {
        label: 'Search request failure',
        autoComplete: 'off',
        pageSize: 1,
        onSearch: async () => {
            throw new globalThis.Error('Simulated network failure');
        },
        onFetch: async () => null
    },
    play: async ({ canvas, userEvent }) => {
        await userEvent.type(canvas.getByRole('combobox'), '{ArrowDown}');
        const alert = await canvas.findByRole('alert');
        await expect(alert).toHaveTextContent('Možnosti sa nepodarilo načítať');
        await expectInsidePopover(alert);
    }
};

const KeyboardPaginationExample = () => {
    const [requests] = useState(() => ({
        first: controlledRequest<import('./Autocomplete.types').OnSearchResult>(),
        retry: controlledRequest<import('./Autocomplete.types').OnSearchResult>()
    }));
    const attempts = useRef(0);
    const [pages, setPages] = useState<number[]>([]);
    const form = useAppForm({ defaultValues: { fruit: '' } });

    return (
        <div className='flex flex-col gap-lg'>
            <form.AppField name='fruit'>
                {(field) => (
                    <field.Autocomplete
                        label='Keyboard pagination'
                        autoComplete='off'
                        pageSize={2}
                        onSearch={(_query, page) => {
                            setPages((previous) => [...previous, page]);
                            if (page === 0) {
                                return Promise.resolve({ options: [options[0], options[3]], page: 0, hasNextPage: true });
                            }

                            attempts.current += 1;
                            return attempts.current === 1 ? requests.first.promise : requests.retry.promise;
                        }}
                        onFetch={async () => null}
                    />
                )}
            </form.AppField>
            <div
                className='flex flex-wrap gap-md'
                onMouseDown={(event) => event.preventDefault()}
            >
                <Button
                    variant='outline'
                    onClick={() => requests.first.reject(new globalThis.Error('Next page failed'))}
                >
                    Reject next page
                </Button>
                <Button
                    variant='outline'
                    onClick={() => requests.retry.resolve({ options: [options[4], options[1]], page: 1, hasNextPage: false })}
                >
                    Resolve next page
                </Button>
            </div>
            <output aria-label='Requested pages'>{JSON.stringify(pages)}</output>
            <form.Subscribe selector={(state) => state.values.fruit}>
                {(value) => <output aria-label='Stored fruit'>{value}</output>}
            </form.Subscribe>
        </div>
    );
};

export const KeyboardPagination: Story = {
    args: AccessibleKeyboardSingle.args,
    render: () => <KeyboardPaginationExample />,
    play: async ({ canvas, userEvent }) => {
        const input = canvas.getByRole('combobox', { name: 'Keyboard pagination' });
        const pages = canvas.getByLabelText('Requested pages');
        await userEvent.click(input);
        await userEvent.keyboard('{ArrowDown}');
        await canvas.findByRole('option', { name: 'Banana' });
        await expect(pages).toHaveTextContent('[0]');
        // Both loaded rows fit without scrolling. Reaching the last row must still fetch.
        await userEvent.keyboard('{ArrowDown}');
        await expect(await canvas.findByText('Načítava sa...')).toBeVisible();
        await expect(pages).toHaveTextContent('[0,1]');
        await userEvent.keyboard('{ArrowDown}{ArrowDown}{ArrowDown}');
        await expect(pages).toHaveTextContent('[0,1]');
        await userEvent.click(canvas.getByRole('button', { name: 'Reject next page' }));
        await expect(await canvas.findByRole('alert')).toBeVisible();
        await expect(canvas.getByRole('option', { name: 'Banana' })).toBeVisible();
        await expect(input).toHaveFocus();
        // Another Down retries the failed page without dropping the earlier options.
        await userEvent.keyboard('{ArrowDown}');
        await expect(pages).toHaveTextContent('[0,1,1]');
        await userEvent.click(canvas.getByRole('button', { name: 'Resolve next page' }));
        const apricot = await canvas.findByRole('option', { name: 'Apricot' });
        await expect(canvas.queryByRole('alert')).toBeNull();
        await userEvent.keyboard('{ArrowDown}{ArrowDown}');
        await expect(input).toHaveAttribute('aria-activedescendant', apricot.id);
        await expect(input).toHaveFocus();
        await expect(pages).toHaveTextContent('[0,1,1]');
        await userEvent.keyboard('{Enter}');
        await expect(canvas.getByLabelText('Stored fruit')).toHaveTextContent('apricot');
    }
};

export const KeyboardScrollAlignment: Story = {
    args: {
        label: 'Scrollable options',
        autoComplete: 'off',
        onSearch: async () => ({ options, page: 0, hasNextPage: false }),
        onFetch: async (value) => options.find((option) => option.value === value) ?? null
    },
    play: async ({ canvas, userEvent }) => {
        const input = canvas.getByRole('combobox', { name: 'Scrollable options' });
        const inputTop = input.getBoundingClientRect().top;
        await userEvent.click(input);
        await userEvent.keyboard('{ArrowDown}');
        await canvas.findByRole('option', { name: 'Pear' });
        const enabled = canvas.getAllByRole('option').filter((option) => !option.hasAttribute('disabled'));
        const popup = canvas.getByRole('listbox').parentElement!;
        const expectActiveRowVisible = async (option: HTMLElement) => {
            await expect(input).toHaveAttribute('aria-activedescendant', option.id);
            await waitFor(() => {
                const row = option.parentElement!;
                const bounds = row.getBoundingClientRect();
                const outline = parseFloat(getComputedStyle(row).outlineWidth);
                const viewportTop = popup.getBoundingClientRect().top + popup.clientTop;
                expect(bounds.top - outline).toBeGreaterThanOrEqual(viewportTop);
                expect(bounds.bottom + outline).toBeLessThanOrEqual(viewportTop + popup.clientHeight);
            });
            await expect(input).toHaveFocus();
            await expect(input.getBoundingClientRect().top).toBe(inputTop);
        };

        await expectActiveRowVisible(enabled[0]);
        for (const option of enabled.slice(1)) {
            await userEvent.keyboard('{ArrowDown}');
            await expectActiveRowVisible(option);
        }
        await expect(popup.scrollTop).toBeGreaterThan(0);
        for (const option of enabled.slice(0, -1).reverse()) {
            await userEvent.keyboard('{ArrowUp}');
            await expectActiveRowVisible(option);
        }
        await expect(popup.scrollTop).toBe(0);
        await userEvent.keyboard('{ArrowUp}');
        await expect(input).toHaveAttribute('aria-expanded', 'false');
        await expect(input).toHaveFocus();
    }
};
