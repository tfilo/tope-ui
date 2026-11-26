# Input

## When to use

Use `Input` for **single-line text entry**: text, email, password, tel, url, search and numbers. It can show icons or icon buttons before and after the text (`startAction`, `endAction`), e.g. a show/hide password button or a clear button.

- Non-numeric types store a `string`.
- `type='number'` stores `number | null`.

Do **not** use it for:

- Multi-line text, use `TextArea` (`references/textarea.md`).
- Choosing from options, use `Select` (`references/select.md`) or `Autocomplete` (`references/autocomplete.md`).
- Dates and times, use `DateTimeInput` (`references/date-time-input.md`).
- Files, use `FileInput` (`references/file-input.md`), and booleans, use `Switch` (`references/switch.md`).
- `type='checkbox'`, `'radio'` or `'file'`, the value is always controlled as text or number.
- Identifiers such as ZIP codes, phone numbers or IBAN with `type='number'`. Leading zeros are lost, use a text input with `inputMode='numeric'` instead.

## Import

Component should be always imported using useAppForm and used using form.AppField see example below.

```tsx
import { useAppForm } from '@tfilo/tope-ui';
```

Important: must be used inside a TanStack Form field.

`Input` reads its state via `useFieldContext()`. It has **no `value`, `onChange`, `onBlur` or `name` props**, and it does not work standalone.

- Render it inside a field of a form created with the library's `useAppForm`, registered as a field component.
- Value type is `string` for all types except `type='number'`, where it is `number | null`.
- Empty text value is `''`. Empty (or invalid) number value is `null`.
- Never pass `value`, `onChange`, `onBlur` or `name`. They are omitted from the props type.
- Field name comes from the field context and is set as the input's `name`.

```tsx
const form = useAppForm({
    defaultValues: {
        name: '',
        age: null as number | null
    },
    onSubmit: ({ value }) => {
        // value.name is string, value.age is number | null
    }
});

<form.AppField name='name'>
    {(field) => (
        <field.Input
            id='name'
            data-testid='name'
            label='Name'
            placeholder='John Doe'
            required
        />
    )}
</form.AppField>;

<form.AppField name='age'>
    {(field) => (
        <field.Input
            label='Age'
            type='number'
            min={0}
        />
    )}
</form.AppField>;
```

Actions. `endAction` (or `startAction`) takes one action or an array of actions. Example with show/hide password button:

```tsx
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/16/solid';

const [showPassword, setShowPassword] = useState(false);

<form.AppField name='password'>
    {(field) => (
        <field.Input
            label='Password'
            type={showPassword ? 'text' : 'password'}
            endAction={{
                icon: showPassword ? EyeSlashIcon : EyeIcon,
                title: showPassword ? 'Hide password' : 'Show password',
                onClick: () => setShowPassword((show) => !show)
            }}
        />
    )}
</form.AppField>;
```

Validation is done by TanStack Form validators on the field. `required` is visual only (star and native `required` attribute, the examples use forms with `noValidate`), so check values in a validator. Number fields must be checked against `null`:

```tsx
<form.AppField
    name='age'
    validators={{
        onChange: ({ value }) => {
            if (value === null) return 'Age is required';
            if (value < 0) return 'Age must not be negative';
            return undefined;
        }
    }}
>
    {(field) => (
        <field.Input
            label='Age'
            type='number'
            required
        />
    )}
</form.AppField>
```

## Props

| Prop          | Type                                                         | Required | Default                | Description                                                                                                                                                 |
| ------------- | ------------------------------------------------------------ | -------- | ---------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `label`       | `string`                                                     | No       | -                      | Label rendered above the input and linked to it via `htmlFor`.                                                                                              |
| `required`    | `boolean`                                                    | No       | `false`                | **Visual only**: shows a red asterisk and sets the native `required` attribute. It does not validate in TanStack Form.                                      |
| `error`       | `string`                                                     | No       | -                      | Externally provided error message. When set (not `undefined`), it **replaces** the field validation errors. Leave it `undefined` to show validator errors. |
| `type`        | `InputHTMLAttributes<HTMLInputElement>['type']`              | No       | native default (text)  | Native input type. `'number'` stores `number \| null`, other types store `string`.                                                                          |
| `startAction` | `InputActionProps \| InputActionProps[]`                     | No       | -                      | Icons or icon buttons displayed before the text. See [Actions](#actions).                                                                                   |
| `endAction`   | `InputActionProps \| InputActionProps[]`                     | No       | -                      | Icons or icon buttons displayed after the text. See [Actions](#actions).                                                                                    |
| `disabled`    | `boolean`                                                    | No       | `false`                | Disables the input and all actions. Styled as disabled.                                                                                                     |
| `readOnly`    | `boolean`                                                    | No       | `false`                | Native read-only input. Actions stay enabled.                                                                                                               |
| `id`          | `string`                                                     | No       | `input-{useId()}`      | DOM id of the input (the label points to it). Used as is, without prefix.                                                                                   |
| `data-testid` | `string`                                                     | No       | -                      | Base test id, all inner elements derive their test id from it. See [Testing](#testing).                                                                     |
| other props   | `InputHTMLAttributes<HTMLInputElement>`                      | No       | -                      | Spread to the inner `<input>`, e.g. `placeholder`, `min`, `max`, `step`, `maxLength`, `autoComplete`, `inputMode`, `aria-*`, `onKeyDown`.                   |

Props that are always overridden internally even if passed: `name` (taken from the field), `value`, `onChange`, `onBlur`. Do not pass `className`, it would replace the library's input styling.

### Actions

Each action is an object:

| Field      | Type                           | Required | Description                                                                                                         |
| ---------- | ------------------------------ | -------- | ------------------------------------------------------------------------------------------------------------------- |
| `icon`     | `Icon`                         | Yes      | Icon component, e.g. from `@heroicons/react/16/solid`.                                                              |
| `title`    | `string`                       | Yes      | Accessible name and tooltip of the action.                                                                          |
| `onClick`  | `() => void \| Promise<void>`  | No       | When set, the action is a button. Without it, the action is a non-interactive icon.                                 |
| `disabled` | `boolean`                      | No       | Disables the button. Always disabled when the input is `disabled`.                                                  |

Do not pass `_idx` and `_position`, they are internal.

### Behavior notes

- The field value is updated on every keystroke, text is not trimmed.
- With `type='number'` the value is `null` for empty or invalid input, otherwise a `number` (`0` included). Default value must be `null` or a number, never `''`. `min`, `max` and `step` do not prevent typing other values, validate in a validator.
- An action button is disabled while its async `onClick` is running.
- Validation errors are displayed only after the field is touched (input blurred) or after a form submit attempt.

## Types

```ts
export interface InputActionProps {
    /** IDX, internal prop */
    _idx: number;
    /** Position, internal prop */
    _position: 'start' | 'end';
    icon: Icon;
    onClick?: () => void | Promise<void>;
    title: string;
    disabled?: boolean;
    'data-testid'?: string;
}

interface BaseProps {
    type?: InputHTMLAttributes<HTMLInputElement>['type'];
    label?: string;
    error?: string;
    startAction?: Array<Omit<InputActionProps, '_idx' | '_position'>> | Omit<InputActionProps, '_idx' | '_position'>;
    endAction?: Array<Omit<InputActionProps, '_idx' | '_position'>> | Omit<InputActionProps, '_idx' | '_position'>;
    'data-testid'?: string;
}

export interface InputProps
    extends Omit<InputHTMLAttributes<HTMLInputElement>, keyof BaseProps | 'value' | 'onChange' | 'onBlur' | 'name'>, BaseProps {}
```

## Testing

All test ids are derived from the `data-testid` prop. In the table `{testid}` is the value passed to `data-testid`; without the prop no test ids are rendered.

| Element                                                         | data-testid                   |
| --------------------------------------------------------------- | ----------------------------- |
| Input element                                                   | `{testid}`                    |
| Label                                                           | `{testid}_label`              |
| Validation / `error` message (`idx` is zero-based)              | `{testid}_error_{idx}`        |
| Start action, button or icon (`idx` is zero-based)              | `{testid}_start_action_{idx}` |
| End action, button or icon (`idx` is zero-based)                | `{testid}_end_action_{idx}`   |

Cypress example, typing a value and clicking an action:

```ts
cy.get('[data-testid="name"]').type('John Doe');
cy.get('[data-testid="name"]').should('have.value', 'John Doe');
cy.get('[data-testid="password_end_action_0"]').click();
```

Playwright example, typing a value and clicking an action:

```ts
await page.getByTestId('name').fill('John Doe');
await expect(page.getByTestId('name')).toHaveValue('John Doe');
await page.getByTestId('password_end_action_0').click();
```