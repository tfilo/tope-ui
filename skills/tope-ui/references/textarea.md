# TextArea

## When to use

Use `TextArea` for **multi-line free text**: notes, descriptions, comments, messages. With `maxLength` it shows a character counter (`12/200`).

- Value is a `string`.

Do **not** use it for single-line text, use `Input` (`references/input.md`).

## Import

Component should be always imported using useAppForm and used using form.AppField see example below.

```tsx
import { useAppForm } from '@tfilo/tope-ui';
```

Important: must be used inside a TanStack Form field.

`TextArea` reads its state via `useFieldContext()`. It has **no `value`, `onChange` or `onBlur` props**, and it does not work standalone.

- Render it inside a field of a form created with the library's `useAppForm`, registered as a field component.
- Value type is `string`. Empty value is `''`. Default value must be a string, never `undefined` or `null`.
- Never pass `value`, `onChange`, `onBlur` or `name`. They are omitted from the props type.
- Field name comes from the field context and is set as the textarea's `name`.

```tsx
const form = useAppForm({
    defaultValues: {
        note: ''
    },
    onSubmit: ({ value }) => {
        // value.note is string
    }
});

<form.AppField name='note'>
    {(field) => (
        <field.TextArea
            id='note'
            data-testid='note'
            label='Note'
            placeholder='Write a note'
            rows={6}
            maxLength={200}
        />
    )}
</form.AppField>;
```

Validation is done by TanStack Form validators on the field. `required` is visual only (star and native `required` attribute, the examples use forms with `noValidate`), so check the value in a validator:

```tsx
<form.AppField
    name='note'
    validators={{
        onChange: ({ value }) => {
            if (value.trim() === '') return 'Note is required';
            if (value.length < 10) return 'Note must have at least 10 characters';
            return undefined;
        }
    }}
>
    {(field) => (
        <field.TextArea
            label='Note'
            required
        />
    )}
</form.AppField>
```

## Props

| Prop          | Type                                          | Required | Default              | Description                                                                                                                                                |
| ------------- | --------------------------------------------- | -------- | -------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `label`       | `string`                                      | No       | -                    | Label rendered above the textarea and linked to it via `htmlFor`.                                                                                          |
| `required`    | `boolean`                                     | No       | `false`              | **Visual only**: shows a red asterisk and sets the native `required` attribute. It does not validate in TanStack Form.                                     |
| `error`       | `string`                                      | No       | -                    | Externally provided error message. When set (not `undefined`), it **replaces** the field validation errors. Leave it `undefined` to show validator errors. |
| `maxLength`   | `number`                                      | No       | -                    | Native maximum length. Also shows a `count/maxLength` counter under the field, hidden while an error is displayed.                                         |
| `rows`        | `number`                                      | No       | `4`                  | Number of visible text rows.                                                                                                                               |
| `disabled`    | `boolean`                                     | No       | `false`              | Disables the textarea. Styled as disabled.                                                                                                                 |
| `readOnly`    | `boolean`                                     | No       | `false`              | Native read-only textarea.                                                                                                                                 |
| `id`          | `string`                                      | No       | `textarea-{useId()}` | DOM id of the textarea (the label points to it). Used as is, without prefix.                                                                               |
| `data-testid` | `string`                                      | No       | -                    | Base test id, all inner elements derive their test id from it. See [Testing](#testing).                                                                    |
| other props   | `TextareaHTMLAttributes<HTMLTextAreaElement>` | No       | -                    | Spread to the inner `<textarea>`, e.g. `placeholder`, `minLength`, `spellCheck`, `autoComplete`, `aria-*`, `onKeyDown`.                                    |

Props that are always overridden internally even if passed: `name` (taken from the field), `value`, `onChange`, `onBlur`. Do not pass `className`, it would replace the library's textarea styling.

### Behavior notes

- The field value is updated on every keystroke, text is not trimmed.
- The counter is positioned below the field's border, so keep free space under the component. It counts the same way as the native `maxLength` limit.
- A form-level `onKeyDown` that calls `preventDefault()` on `Enter` (used to stop submitting on Enter) also blocks new lines in a `TextArea`. Skip textareas in it:

    ```tsx
    onKeyDown={(e) => {
        if (e.key === 'Enter' && !(e.target instanceof HTMLTextAreaElement)) e.preventDefault();
    }}
    ```

- Validation errors are displayed only after the field is touched (textarea blurred) or after a form submit attempt.
- Texts (counter description, required star description) come from the library localization (`setLocalization`), Slovak by default.

## Types

```ts
interface BaseProps {
    label?: string;
    error?: string;
    'data-testid'?: string;
}

export interface TextAreaProps
    extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, keyof BaseProps | 'value' | 'onChange' | 'onBlur' | 'name'>, BaseProps {}
```

## Testing

All test ids are derived from the `data-testid` prop. In the table `{testid}` is the value passed to `data-testid`; without the prop no test ids are rendered.

| Element                                            | data-testid / selector      |
| -------------------------------------------------- | --------------------------- |
| Textarea element                                   | `{testid}`                  |
| Label                                              | `{testid}_label`            |
| Validation / `error` message (`idx` is zero-based) | `{testid}_error_{idx}`      |
| Character counter (only with `maxLength`)          | no test id, find it by text |

Error messages also have `role='alert'`.

Cypress example, typing a value and checking the counter (`maxLength={200}`):

```ts
cy.get('[data-testid="note"]').type('Hello world');
cy.get('[data-testid="note"]').should('have.value', 'Hello world');
cy.contains('11/200').should('be.visible');
```

Playwright example, filling a multi-line value:

```ts
await page.getByTestId('note').fill('Line one\nLine two');
await expect(page.getByTestId('note')).toHaveValue('Line one\nLine two');
await expect(page.getByText('17/200')).toBeVisible();
```