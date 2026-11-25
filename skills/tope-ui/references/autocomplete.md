# Autocomplete

Searchable select with async option loading, pagination, and single or multiple selection. Selected options are shown as tags inside the input area.

## When to use

- Option list is large or comes from an API (server-side search + pagination).
- You need single (`string`) or multi (`string[]`) selection bound to a form field.

Do NOT use for short, static lists. Use the library's Select component for those.

## Import

Component should be always imported using useAppForm and used using form.AppField see example below.

```tsx
import { useAppForm } from '@tfilo/tope-ui';
```

## Critical: must be used inside a TanStack Form field

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

## Props

| Prop                       | Type                                                                                                   | Required | Default     | Description                                                                                                                                                                                                           |
| -------------------------- | ------------------------------------------------------------------------------------------------------ | -------- | ----------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `onSearch`                 | `(query: string, page: number, pageSize: number, abortSignal: AbortSignal) => Promise<OnSearchResult>` | yes      |             | Loads options for the dropdown.                                                                                                                                                                                       |
| `onFetch`                  | `(value, abortSignal?) => Promise<Option \| null>`                                                     | yes      |             | Resolves a single option by its value, to render tags for existing form values.                                                                                                                                       |
| `label`                    | `string`                                                                                               | no       | `undefined` | Renders as label of component (`<label htmlFor>` bound to the input).                                                                                                                                                 |
| `error`                    | `string`                                                                                               | no       | `undefined` | External error. **Overrides** form validation errors when not `undefined` (even an empty string hides form errors). Shown regardless of touched state.                                                                |
| `multiple`                 | `boolean`                                                                                              | no       | `false`     | Multi-select. Field value becomes `string[]`.                                                                                                                                                                         |
| `pageSize`                 | `number`                                                                                               | no       | `10`        | Passed to `onSearch`. Also affects dropdown max height, see [Dropdown height](#dropdown-height).                                                                                                                      |
| `disabled`                 | `boolean`                                                                                              | no       | `false`     | Disables input, toggle button, tags (and their remove action) and the retry button, applies disabled styling, and closes the dropdown.                                                                                |
| `readOnly`                 | `boolean`                                                                                              | no       | `false`     | Disables opening, searching, selecting and tag removal. Closes the dropdown.                                                                                                                                          |
| `required`                 | `boolean`                                                                                              | no       | `undefined` | Adds `*` to the label and sets `aria-required` on the input. Visual only, validation is done by the form.                                                                                                             |
| `id`                       | `string`                                                                                               | no       | auto        | Base id (auto-generated with `useId` when omitted). Never used as-is, see [IDs](#ids). Pass it explicitly when you need stable selectors.                                                                             |
| `data-testid`              | `string`                                                                                               | no       | `undefined` | Playwright attribute. Set on the input and used as prefix for data-testid of all inner elements, see [data-testid](#playwright-testing---data-testid-attribute).                                                                                     |
| `title`                    | `string`                                                                                               | no       | `undefined` | Spread onto the `<input>` as `title`. Provide it when you don't provide `label` so the input remains accessible.                                                                                                      |
| other `<input>` attributes | –                                                                                                      | no       | `undefined` | Spread onto the `<input>` (e.g. `placeholder`, `autoComplete`). `name`, `id`, `value`, `readOnly`, `disabled`, `onChange`, `onKeyDown` and `ref` are always controlled by the component and override anything passed. |

### Types

```ts
export interface Option {
    value: string;
    label: string;
    disabled?: boolean;
}

type OnSearchResult = {
    hasNextPage: boolean;
    page: number; // page that was just loaded (0-based)
    options: Option[];
};
```

## IDs

`id` is a base id. The component derives every id from `autocomplete-${id}` (when `id` is omitted, `useId()` is used instead):

| Element                   | Id / name                         |
| ------------------------- | --------------------------------- |
| `<input>`                 | `autocomplete-${id}`              |
| Label                     | `autocomplete-${id}-label`        |
| Error messages (by index) | `autocomplete-${id}-error-${idx}` |
| Options list (`<ul>`)     | `autocomplete-${id}-options`      |
| CSS anchor name (popover) | `--autocomplete_${id}`            |

- `<input id='autocomplete-country'>` for `id='country'`. Do not look the input up by the raw `id`.
- Label and error `<label>` elements use `htmlFor` pointing to the input id.
- Auto-generated ids are not stable between renders/environments. Use an explicit `id` or `data-testid` for tests and when referencing the element.
- Use unique `id` per field on a page, the anchor name for the dropdown position is derived from it.

## Playwright testing - data-testid attribute

When `data-testid='x'` is passed, it is set on the `<input>` itself and these attributes are derived for inner elements:

| Element                                                | data-testid             |
| ------------------------------------------------------ | ----------------------- |
| `<input>`                                              | `x`                     |
| Label                                                  | `x_label`               |
| Error messages (by index, form errors or `error` prop) | `x_error_${idx}`        |
| Retry button shown when `onFetch` failed               | `x_retry_btn`           |
| Selected tag (by index)                                | `x_tag_${idx}`          |
| Open/close (chevron) button                            | `x_btn`                 |
| Options list `<ul>`                                    | `x_options`             |
| Option `<button>`                                      | `x_option_${value}_btn` |
| "No options" row                                       | `x_option_noOptions`    |
| "Loading" row                                          | `x_option_loading`      |
| Search/pagination retry `<button>`                     | `x_option_error_btn`    |

`${value}` is `option.value`, `${idx}` is 0-based. Without `data-testid`, none of these attributes are rendered.

## Callback contracts

### `onSearch(query, page, pageSize, abortSignal)`

- `page` is **0-based**. The first call uses `page = 0`. Next pages use `result.page + 1`.
- Return `page` equal to the page you loaded and `hasNextPage` accurately. Pagination stops when it is `false`.
- Called on **every** input change while the dropdown is open, with no debounce. Debounce on the consumer side if the API is expensive.
- **Always forward `abortSignal`** to `fetch` or the query function. Running search and next-page requests are aborted when the user types again, closes the dropdown, or the component unmounts. Aborted results are ignored.
- Throwing (other than `AbortError`) shows an inline retry row at the end of the dropdown list. Retry repeats the failed page (first page repeats the search).

### `onFetch(value, abortSignal?)`

- Called to resolve a form value into a displayable option, on mount and whenever the form value changes externally (e.g. `form.reset`, `setFieldValue`).
- Called once per value (in parallel) for multiple. Values are trimmed and blank values are ignored.
- Skipped when the form value is exactly the current selection (same values, same count), so selecting in the UI does not trigger a refetch.
- Return `null` when the option does not exist. A tag is shown with `value` as label, in `danger` variant, with the `unavailableOption` tooltip.
- Throwing (other than `AbortError`) shows an error with a retry button below the input (`localization.autocompleteFetchError`) and the wrapper switches to the error state. If one of multiple values fails, the whole fetch is considered failed.
- The input, toggle button and retry button are disabled while fetching.
- The component does not write to the form field until the initial `onFetch` has finished (successfully or not). Selection made by the user before that is not possible because the input is disabled.

Example with `fetch`:

```tsx
const searchCountries = async (query: string, page: number, pageSize: number, signal: AbortSignal): Promise<OnSearchResult> => {
    const res = await fetch(`/api/countries?q=${encodeURIComponent(query)}&page=${page}&size=${pageSize}`, { signal });
    if (!res.ok) throw new Error('Search failed');
    const data = await res.json();
    return {
        page,
        hasNextPage: data.hasNext,
        options: data.items.map((c: Country) => ({ value: c.code, label: c.name }))
    };
};

const fetchCountry = async (value: string, signal?: AbortSignal): Promise<Option | null> => {
    const res = await fetch(`/api/countries/${value}`, { signal });
    if (res.status === 404) return null;
    if (!res.ok) throw new Error('Fetch failed');
    const c = await res.json();
    return { value: c.code, label: c.name };
};
```

With TanStack Query, use `queryClient.fetchQuery({ queryKey, queryFn: ({ signal }) => ..., staleTime })` inside these callbacks and pass the abort signal through. Do not use `useQuery` for this. The component controls when requests happen.

## Behavior

- **Opening:** click the chevron button, press `ArrowDown` in the input, or start typing. Opening triggers a search with the current text. The chevron button toggles (click again closes).
- **Selection:** clicking a selected option again unselects it. In single mode, selecting replaces the previous value. After every selection, in both modes, the dropdown closes, typed text is cleared and focus returns to the input. In multiple mode, reopen the dropdown to pick another option.
- **Tags:** each selected option is a removable `Tag` (not removable when `readOnly`). Removing a tag clears typed text. Removing the only tag in single mode sets the field to `''`.
- **Unavailable values:** values for which `onFetch` returned `null` are shown as `danger` tags with `unavailableOption` tooltip. They stay in the field value until removed.
- **Pagination:** loads the next page when the dropdown scrolls within 8px of the bottom (and `hasNextPage` is `true`, nothing is loading and no error is pending).
- **Rows in dropdown:** `loading` row while searching or loading next page, `noOptions` row when search finished with no results, retry row when search/pagination failed.
- **Blur:** leaving the component (focus moves outside of input, tags, button and dropdown) closes the dropdown, clears typed text and calls `field.handleBlur()` (marks the field touched). Selecting an option does not mark the field touched by itself.
- **Errors:** form errors are shown only after the field is touched, one message per line (strings or objects with `message`, e.g. Standard Schema issues). The `error` prop, if set, replaces them and is shown immediately. When any error is shown (or `onFetch` failed) the whole control is rendered in `danger` color.
- **Disabled option:** `option.disabled` makes it non-selectable and skipped by keyboard navigation.
- **Form submit:** `Enter` in the input never submits the surrounding form (default is prevented).
- Dropdown uses the Popover API (`popover='manual'`) and CSS anchor positioning. Requires a modern browser.

### Dropdown height

Max height is `min(pageSize - 1, 5) * 36 + 8` px, so at most 5 rows are visible and the list scrolls. Use `pageSize` of at least 6 for the full 5 rows. Very small values (`1`, `2`) make the dropdown too small to be usable.

## Keyboard

| Key                     | Context                | Action                                                                                                                                  |
| ----------------------- | ---------------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| `ArrowDown`             | input / chevron button | Open the dropdown (if closed) and focus the first enabled option                                                                        |
| `ArrowDown` / `ArrowUp` | option                 | Move focus. Skips disabled options. `ArrowUp` on the first option returns to the input and closes the dropdown.                         |
| `Enter`                 | input                  | Selects the first loaded option if text is entered (does nothing if that option is disabled). Without text it just closes the dropdown. |
| `Enter`                 | option                 | Select the focused option                                                                                                               |
| `Escape`                | input / option         | Close the dropdown (returns focus to the input from an option). Typed text is kept.                                                     |

## Localization

Texts come from `localization` in `utils/constants`: `retry`, `autocompleteFetchError`, `autocompleteSearchError`, `noOptions`, `loading`, `unavailableOption`, `openDropdown`, `closeDropdown`, and `requiredField` (used by the label wrapper for the required `*`). Do not hardcode these strings. Override them via the library's localization mechanism.

## Common mistakes

- Passing `value`/`onChange`/`ref`. They are not accepted, so bind through the form field.
- Passing `name`, `id`, `onKeyDown` expecting them to be applied to the input as-is. The component controls them.
- Using it outside a form field context. It throws or misbehaves.
- Forgetting `multiple` while the field's default value is an array (or the reverse). Single expects `string`, multiple expects `string[]`.
- Not forwarding `abortSignal`, which causes race conditions and wasted requests.
- Returning wrong `page` or `hasNextPage` from `onSearch`, which leads to duplicate pages or endless loading.
- Unstable or non-existent values in the form: they render as danger "unavailable" tags because `onFetch` returned `null`.
- Passing `error=''` to "clear" the error: it still overrides form validation errors. Pass `undefined` instead.
- Targeting the input by the raw `id` in tests. The real id is `autocomplete-${id}`.
- Very small `pageSize` (below 6), which shrinks the dropdown height.
