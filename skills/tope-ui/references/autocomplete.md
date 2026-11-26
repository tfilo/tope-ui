# Autocomplete

## When to use

Use `Autocomplete` when the user picks one value (or several) from a **large or remote dataset** that is loaded on demand: countries, customers, products, users, etc.

- Options are loaded asynchronously by a search callback (`onSearch`) as the user types, with **pagination on scroll**.
- The form stores only the option `value` (an ID/code). The label is resolved by a second callback (`onFetch`), so a pre-filled value (edit forms, form reset) is displayed correctly even if it is not in the first page of search results.
- Supports single selection (value is a `string`) and multiple selection (`multiple`, value is a `string[]`), displayed as removable tags.

Do **not** use it when:

- The option list is small and static, use `Select` (`references/select.md`).
- The user enters free text that is not picked from a list, use `Input` (`references/input.md`).
- You need a standalone, uncontrolled component. `Autocomplete` only works inside a TanStack Form field.

Runtime requirements: React 19.2+ (uses `useEffectEvent`) and a modern browser (uses the Popover API and CSS anchor positioning for the dropdown).

## Import

Component should be always imported using useAppForm and used using form.AppField see example below.

```tsx
import { useAppForm } from '@tfilo/tope-ui';
```

Important: must be used inside a TanStack Form field.

`Autocomplete` reads its state via `useFieldContext()`. It has **no `value` or `onChange` props**, and it does not work standalone.

- Render it inside a field of a form created with the library's `useAppForm`, registered as a field component.
- Value type is `string` for single and `string[]` for `multiple`.
- Empty single value is `''`. Empty multiple value is `[]`.
- Never pass `value`, `onChange` or `ref`. They are omitted from the props type.
- Field name comes from the field context and is set as the input's `name`.

```tsx
<form.AppField name='country'>
    {(field) => (
        <field.Autocomplete
            id='country'
            data-testid='country'
            label='Country'
            required
            onSearch={searchCountries}
            onFetch={fetchCountry}
        />
    )}
</form.AppField>
```

Multiple selection. The default value must be an array:

```tsx
const form = useAppForm({
    defaultValues: {
        countries: [] as string[]
    },
    onSubmit: ({ value }) => {
        // value.countries is string[]
    }
});

<form.AppField name='countries'>
    {(field) => (
        <field.Autocomplete
            label='Countries'
            multiple
            onSearch={searchCountries}
            onFetch={fetchCountry}
        />
    )}
</form.AppField>;
```

Validation is done by TanStack Form validators on the field. Errors are displayed under the input automatically:

```tsx
<form.AppField
    name='country'
    validators={{
        onChange: ({ value }) => (value === '' ? 'Country is required' : undefined)
    }}
>
    {(field) => (
        <field.Autocomplete
            label='Country'
            required
            onSearch={searchCountries}
            onFetch={fetchCountry}
        />
    )}
</form.AppField>
```

## Props

| Prop          | Type                                                                                                       | Required | Default                | Description                                                                                                                                                                  |
| ------------- | ---------------------------------------------------------------------------------------------------------- | -------- | ---------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `onSearch`    | `(query: string, page: number, pageSize: number, abortSignal: AbortSignal) => Promise<OnSearchResult>`     | Yes      | -                      | Loads one page of options for the typed query. See [onSearch contract](#onsearch-contract).                                                                                  |
| `onFetch`     | `(value: string, abortSignal?: AbortSignal) => Promise<Option \| null>`                                     | Yes      | -                      | Resolves a single option by its value, used to display the current value. See [onFetch contract](#onfetch-contract).                                                         |
| `label`       | `string`                                                                                                   | No       | -                      | Label rendered above the input and linked to it via `htmlFor`.                                                                                                               |
| `required`    | `boolean`                                                                                                  | No       | `false`                | **Visual only**: shows a red asterisk and sets `aria-required`. It does not validate, add a validator to the field.                                                          |
| `error`       | `string`                                                                                                   | No       | -                      | Externally provided error message. When set (not `undefined`), it **replaces** the field validation errors. Leave it `undefined` to show errors from TanStack Form validators. |
| `multiple`    | `boolean`                                                                                                  | No       | `false`                | Enables multiple selection. Field value must then be `string[]`.                                                                                                             |
| `pageSize`    | `number`                                                                                                   | No       | `10`                   | Number of options requested per page. Also controls dropdown height (see [Behavior notes](#behavior-notes)).                                                                 |
| `disabled`    | `boolean`                                                                                                  | No       | `false`                | Disables the input, the open button and tag removal. Styled as disabled.                                                                                                     |
| `readOnly`    | `boolean`                                                                                                  | No       | `false`                | Value is displayed but cannot be changed. Dropdown cannot be opened and tags have no remove button.                                                                         |
| `id`          | `string`                                                                                                   | No       | generated by `useId()` | Base id. The real DOM id of the input is `autocomplete-{id}` (the label points to it).                                                                                       |
| `data-testid` | `string`                                                                                                   | No       | -                      | Base test id, all inner elements derive their test id from it. See [Testing](#testing).                                                                                      |
| other props   | `InputHTMLAttributes<HTMLInputElement>` without `value`, `onChange`, `ref`                                 | No       | -                      | Spread to the inner `<input>`, e.g. `placeholder`, `autoComplete`, `aria-*`, `title`.                                                                                        |

Props that are always overridden internally even if passed: `name` (taken from the field), `value`, `onChange`, `onKeyDown`, `id` (prefixed), `disabled` (also disabled while the current value is being fetched), `readOnly`, `data-testid`. Do not pass `className`, it would replace the library's input styling.

### onSearch contract

```ts
onSearch(query: string, page: number, pageSize: number, abortSignal: AbortSignal): Promise<OnSearchResult>
```

- `page` is **zero-based**. The first request is `page = 0`, scrolling to the bottom of the dropdown requests `page + 1`.
- It is called with an **empty `query`** when the dropdown is opened without typed text, so the empty query must return a sensible default list.
- It is called on every keystroke without debouncing. The previous request is aborted, so **always pass `abortSignal` to `fetch`/your HTTP client**. Aborted requests are ignored silently.
- Return `page` equal to the requested page and `hasNextPage: true` while more pages exist. Next page is loaded only when `hasNextPage` is `true`.
- If the promise rejects (other than abort), the dropdown shows a localized error with a retry button.

```tsx
import type { OnSearchResult } from '@tfilo/tope-ui';

const searchCountries = async (query: string, page: number, pageSize: number, signal: AbortSignal): Promise<OnSearchResult> => {
    const res = await fetch(`/api/countries?q=${encodeURIComponent(query)}&page=${page}&size=${pageSize}`, { signal });
    if (!res.ok) throw new Error('Search failed');
    const data: { items: { code: string; name: string }[]; totalPages: number } = await res.json();
    return {
        page,
        hasNextPage: page + 1 < data.totalPages,
        options: data.items.map((c) => ({ value: c.code, label: c.name }))
    };
};
```

### onFetch contract

```ts
onFetch(value: string, abortSignal?: AbortSignal): Promise<Option | null>
```

- Called for every value in the field (once for `string`, once per item for `string[]`) on mount and whenever the field value changes from outside (e.g. `form.reset()`, `form.setFieldValue`, loaded default values). It is not called for values the user just picked from the dropdown.
- Return `null` when the value no longer exists. The value is then shown as a red "unavailable" tag, using the raw value as its label.
- If the promise rejects (other than abort), an error with a retry button is shown below the input, and the input is disabled until the retry succeeds.

```tsx
import type { Option } from '@tfilo/tope-ui';

const fetchCountry = async (value: string, signal?: AbortSignal): Promise<Option | null> => {
    const res = await fetch(`/api/countries/${encodeURIComponent(value)}`, { signal });
    if (res.status === 404) return null;
    if (!res.ok) throw new Error('Fetch failed');
    const c: { code: string; name: string } = await res.json();
    return { value: c.code, label: c.name };
};
```

### Behavior notes

- The selected option(s) are displayed as tags inside the field, also in single mode. The text in the input is only the current search query and is cleared when the input loses focus.
- Selecting an already selected option **unselects** it. In single mode, selecting another option replaces the current one.
- The dropdown closes after each selection, also in `multiple` mode.
- Options with `disabled: true` are shown but cannot be selected.
- Keyboard: `ArrowDown` opens the dropdown and moves through options, `ArrowUp` moves back (and returns to the input from the first option), `Enter` in the input selects the first found option when text is typed, `Escape` closes the dropdown.
- The field is marked as touched when focus leaves the whole component, validation errors from the field are displayed only after that (or after a form submit attempt).
- Dropdown height is limited to `min(pageSize - 1, 5)` rows, so the list can scroll and trigger loading of the next page. Do not use very small `pageSize` values (below 5).
- Texts (no options, loading, retry, errors, open/close dropdown aria labels) come from the library localization (`setLocalization`), Slovak by default.

## Types

```ts
export interface Option {
    value: string;
    label: string;
    disabled?: boolean;
}

export type OnSearchResult = {
    /** true when another page can be requested */
    hasNextPage: boolean;
    /** page number of this result, same as the requested page (zero-based) */
    page: number;
    options: Option[];
};

interface BaseProps {
    label?: string;
    error?: string;
    onSearch: (query: string, page: number, pageSize: number, abortSignal: AbortSignal) => Promise<OnSearchResult>;
    onFetch: (value: string, abortSignal?: AbortSignal) => Promise<Option | null>;
    pageSize?: number;
    'data-testid'?: string;
}

export interface AutocompleteProps
    extends Omit<InputHTMLAttributes<HTMLInputElement>, keyof BaseProps | 'ref' | 'value' | 'onChange'>, BaseProps {}
```

## Testing

All test ids are derived from the `data-testid` prop. In the table `{testid}` is the value passed to `data-testid`; without the prop no test ids are rendered.

| Element                                                         | data-testid                    |
| --------------------------------------------------------------- | ------------------------------ |
| Input element                                                   | `{testid}`                     |
| Label                                                           | `{testid}_label`               |
| Validation / `error` message (`idx` is zero-based)              | `{testid}_error_{idx}`         |
| Open/close dropdown button                                      | `{testid}_btn`                 |
| Selected option tag (`idx` is zero-based, in order of display)  | `{testid}_tag_{idx}`           |
| Options list (`<ul>` in the dropdown)                           | `{testid}_options`             |
| Option button (`value` is `Option.value`)                       | `{testid}_option_{value}_btn`  |
| "No options" row                                                | `{testid}_option_noOptions`    |
| "Loading" row (while searching or loading next page)            | `{testid}_option_loading`      |
| Retry button after failed search or next page load              | `{testid}_option_error_btn`    |
| Retry button after failed `onFetch`                             | `{testid}_retry_btn`           |

Options are rendered only while the dropdown is open and are cleared when it closes. Wait for `{testid}_option_loading` to disappear before clicking an option.

Cypress example, selecting an option by typing:

```ts
cy.get('[data-testid="country"]').type('Slov');
cy.get('[data-testid="country_option_loading"]').should('not.exist');
cy.get('[data-testid="country_option_SK_btn"]').click();
cy.get('[data-testid="country_tag_0"]').should('contain.text', 'Slovakia');
```

Playwright example, selecting an option by typing:

```ts
await page.getByTestId('country').fill('Slov');
await expect(page.getByTestId('country_option_loading')).toHaveCount(0);
await page.getByTestId('country_option_SK_btn').click();
await expect(page.getByTestId('country_tag_0')).toContainText('Slovakia');
```