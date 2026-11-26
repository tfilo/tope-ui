# Select

## When to use

Use `Select` when the user picks one value (or several) from a **local, reasonably small list of options** that is already available in the app: statuses, roles, countries, units, etc. Options can be grouped.

- Options are passed as an array prop, there is no search field and no async loading.
- Single selection (value is a `string`) or multiple selection (`multiple`, value is a `string[]`). Selected values are displayed as tags.
- `compact` renders a single selection as a plain dropdown button showing the selected label.

Do **not** use it for large or remote option lists or when the user needs to search, use `Autocomplete` (`references/autocomplete.md`).

## Import

Component should be always imported using useAppForm and used using form.AppField see example below.

```tsx
import { useAppForm } from '@tfilo/tope-ui';
```

Important: must be used inside a TanStack Form field.

`Select` reads its state via `useFieldContext()`. It has **no `value`, `onChange`, `onBlur` or `name` props**, and it does not work standalone.

- Render it inside a field of a form created with the library's `useAppForm`, registered as a field component.
- Value type is `string` for single and `string[]` for `multiple`.
- Empty single value is `''`. Empty multiple value is `[]`.
- Never pass `value`, `onChange` or `onBlur`. They are omitted from the props type.
- Field name comes from the field context and is set as the trigger button's `name`.

```tsx
const form = useAppForm({
    defaultValues: {
        country: '',
        languages: [] as string[]
    },
    onSubmit: ({ value }) => {
        // value.country is string, value.languages is string[]
    }
});

<form.AppField name='country'>
    {(field) => (
        <field.Select
            id='country'
            data-testid='country'
            label='Country'
            required
            options={[
                { value: 'SK', label: 'Slovakia' },
                { value: 'CZ', label: 'Czechia' },
                { value: 'AT', label: 'Austria', disabled: true }
            ]}
        />
    )}
</form.AppField>;
```

Multiple selection. The default value must be an array:

```tsx
<form.AppField name='languages'>
    {(field) => (
        <field.Select
            label='Languages'
            multiple
            allowEmptyOption
            options={[
                { value: 'sk', label: 'Slovak' },
                { value: 'en', label: 'English' }
            ]}
        />
    )}
</form.AppField>
```

Option groups and compact variant:

```tsx
<form.AppField name='country'>
    {(field) => (
        <field.Select
            label='Country'
            compact
            placeholder='Select country'
            getSelectedLabel={(option) => option.value}
            options={[
                {
                    label: 'Central Europe',
                    options: [
                        { value: 'SK', label: 'Slovakia' },
                        { value: 'CZ', label: 'Czechia' }
                    ]
                },
                {
                    label: 'Other',
                    options: [{ value: 'US', label: 'United States' }]
                }
            ]}
        />
    )}
</form.AppField>
```

Validation is done by TanStack Form validators on the field. `required` is visual only, so check the value in a validator:

```tsx
<form.AppField
    name='country'
    validators={{
        onChange: ({ value }) => (value === '' ? 'Country is required' : undefined)
    }}
>
    {(field) => (
        <field.Select
            label='Country'
            required
            options={countries}
        />
    )}
</form.AppField>
```

## Props

| Prop               | Type                                      | Required | Default            | Description                                                                                                                                                |
| ------------------ | ----------------------------------------- | -------- | ------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `options`          | `(Option \| OptionGroup)[]`               | Yes      | -                  | Options, optionally grouped. See [Types](#types). Disabled options are shown but cannot be selected.                                                       |
| `label`            | `string`                                  | No       | -                  | Label rendered above the select and linked to the trigger button via `htmlFor`.                                                                            |
| `multiple`         | `boolean`                                 | No       | `false`            | Enables multiple selection. Field value must then be `string[]`.                                                                                           |
| `allowEmptyOption` | `boolean`                                 | No       | `false`            | Allows clearing the selection, including removing the last tag. No empty option is rendered in the dropdown. See [Behavior notes](#behavior-notes).        |
| `compact`          | `boolean`                                 | No       | `false`            | Single selection shown as one dropdown button instead of tags. Ignored when `multiple` is set.                                                             |
| `placeholder`      | `string`                                  | No       | -                  | Text shown when a **compact** select has no value. Not used in the regular variant.                                                                        |
| `getSelectedLabel` | `(option: Option) => string`              | No       | `option.label`     | Label of selected values (tags or compact button). Dropdown labels stay unchanged.                                                                         |
| `required`         | `boolean`                                 | No       | `false`            | **Visual only**: shows a red asterisk and sets `aria-required`. It does not validate.                                                                      |
| `error`            | `string`                                  | No       | -                  | Externally provided error message. When set (not `undefined`), it **replaces** the field validation errors. Leave it `undefined` to show validator errors. |
| `disabled`         | `boolean`                                 | No       | `false`            | Disables the trigger button, options and tags. Styled as disabled.                                                                                         |
| `id`               | `string`                                  | No       | `select-{useId()}` | DOM id of the trigger button (the label points to it). Used as is, without prefix. The options list id is `{id}-options`.                                  |
| `data-testid`      | `string`                                  | No       | -                  | Base test id, all inner elements derive their test id from it. See [Testing](#testing).                                                                    |
| other props        | `ButtonHTMLAttributes<HTMLButtonElement>` | No       | -                  | Spread to the trigger button, e.g. `title`, `aria-label`, `className` (appended to button classes), `onClick`, `onKeyDown`.                                |

Props that are always overridden internally even if passed: `name` (taken from the field), `value`, `onChange`, `onBlur`. `onClick` and `onKeyDown` are called first, call `event.preventDefault()` in them to skip the default open/close and keyboard handling. In the regular variant the trigger is an icon-only button, pass `title` to give it an accessible name.

### Behavior notes

- Options are local and always rendered from the `options` prop. For remote or searchable data use `Autocomplete`.
- A value that is not found in `options` is displayed with the raw value as its label, without any "unavailable" marker. Pass the complete `options` before the field value is set.
- Without `allowEmptyOption`, a single select cannot be cleared (a selected value can only be replaced), and in `multiple` mode the last selected tag cannot be removed. Selecting an already selected option unselects it only when removal is allowed.
- The dropdown closes after each selection, also in `multiple` mode, and focus returns to the trigger button.
- Keyboard: `ArrowDown` on the trigger opens the list and focuses the first enabled option, `ArrowDown` / `ArrowUp` move through options (groups are skipped over), `Enter` selects, `Escape` closes. The list also closes on click outside.
- The dropdown list is limited to about 5 rows and scrolls.
- Validation errors are displayed only after the field is touched (focus leaves the component) or after a form submit attempt.
- Texts come from the library localization (`setLocalization`), Slovak by default. The empty list shows `localization.noOptions`.

## Types

```ts
export interface Option {
    value: string;
    label: string;
    disabled?: boolean;
}

export interface OptionGroup {
    label: string;
    options: Option[];
}

interface BaseProps {
    label?: string;
    compact?: boolean;
    getSelectedLabel?: (option: Option) => string;
    placeholder?: string;
    multiple?: boolean;
    required?: boolean;
    error?: string;
    options: (Option | OptionGroup)[];
    allowEmptyOption?: boolean;
    'data-testid'?: string;
}

export interface SelectProps
    extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof BaseProps | 'value' | 'onChange' | 'onBlur' | 'name'>, BaseProps {}
```

## Testing

All test ids are derived from the `data-testid` prop. In the table `{testid}` is the value passed to `data-testid`; without the prop no test ids are rendered.

| Element                                                                  | data-testid                   |
| ------------------------------------------------------------------------ | ----------------------------- |
| Trigger button (`role='combobox'`, opens and closes the dropdown)        | `{testid}`                    |
| Label                                                                    | `{testid}_label`              |
| Validation / `error` message (`idx` is zero-based)                       | `{testid}_error_{idx}`        |
| Selected value tag, regular variant (`idx` is zero-based, display order) | `{testid}_tag_{idx}`          |
| Options list (`<ul>` in the dropdown)                                    | `{testid}_options`            |
| Option button (`value` is `Option.value`)                                | `{testid}_option_{value}_btn` |
| Option group (`idx` is zero-based position in `options`)                 | `{testid}_option_group_{idx}` |
| "No options" row                                                         | `{testid}_option_noOptions`   |

Option buttons are always in the DOM, but visible only while the dropdown is open. In the compact variant there are no tags, the selected label is the text of the trigger button. The tag remove button has no test id, find it by its accessible name (`localization.remove(name)`, e.g. `Odstrániť Slovakia` by default) inside the tag.

Cypress example, selecting an option:

```ts
cy.get('[data-testid="country"]').click();
cy.get('[data-testid="country_option_SK_btn"]').click();
cy.get('[data-testid="country_tag_0"]').should('contain.text', 'Slovakia');
```

Playwright example, selecting an option:

```ts
await page.getByTestId('country').click();
await page.getByTestId('country_option_SK_btn').click();
await expect(page.getByTestId('country_tag_0')).toContainText('Slovakia');
```