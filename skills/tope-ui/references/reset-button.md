# ResetButton

## When to use

Use `ResetButton` for a **"Reset" / "Clear" action of a form** built with `useAppForm`. Clicking it calls `form.reset()`, which puts all field values back to the form's `defaultValues` and clears the touched state and validation errors. All field components (`Input`, `Autocomplete`, `FileInput`, ...) follow the reset.

- It is a regular `Button` (`type='reset'`, `variant='danger'` by default), not a form field. It has no value and no `name`.

Do **not** use it for an action that should reset only some fields or restore values other than `defaultValues`, use a regular `Button` and call the TanStack Form API yourself.

## Import

Component should be always imported using useAppForm and used using form.AppForm see example below.

```tsx
import { useAppForm } from '@tfilo/tope-ui';
```

Important: must be rendered inside `<form.AppForm>`.

`ResetButton` reads the form via `useFormContext()`. It does not work outside of a form created with the library's `useAppForm`, and it does not work outside of `form.AppForm`, which provides that context.

- Use it as `form.ResetButton`, never import it directly.
- `form.AppForm` may wrap one button or both form buttons.
- It does not need to be rendered inside `form.AppField`.

```tsx
<form onSubmit={(e) => { e.preventDefault(); form.handleSubmit(); }} noValidate>
    {/* fields */}
    <form.AppForm>
        <form.ResetButton data-testid='reset'>Reset</form.ResetButton>
    </form.AppForm>
</form>
```

## Props

Props are the `Button` props without `as`, `ref` and `type`.

| Prop           | Type                                                                 | Required | Default    | Description                                                                          |
| -------------- | -------------------------------------------------------------------- | -------- | ---------- | ------------------------------------------------------------------------------------ |
| `children`     | `ReactNode`                                                          | No       | -          | Button content, usually the text.                                                    |
| `variant`      | `'primary' \| 'secondary' \| 'danger' \| 'outline' \| 'transparent'` | No       | `'danger'` | Visual variant.                                                                      |
| `icon`         | `Icon`                                                               | No       | -          | Icon rendered before the children.                                                   |
| `showChildren` | `boolean`                                                            | No       | `true`     | When `false`, only the icon is shown and a string child is used as the button title. |
| `onClick`      | `(e: MouseEvent<HTMLButtonElement>) => void`                         | No       | -          | Called **after** `form.reset()`. The reset cannot be cancelled from it.              |
| `disabled`     | `boolean`                                                            | No       | `false`    | Disables the button.                                                                 |
| `data-testid`  | `string`                                                             | No       | -          | Test id of the button. See [Testing](#testing).                                      |
| other props    | `Button` props and native `<button>` attributes                      | No       | -          | E.g. `textDecoration`, `additionalClassName`, `title`, `aria-*`.                     |

### Behavior notes

- Values return to the `defaultValues` passed to `useAppForm`, not to the last submitted values.
- The button is not disabled while the form is submitting. Pass `disabled` yourself if needed.

## Types

```ts
export const ResetButton: React.FC<Omit<ButtonProps<'button'>, 'as' | 'ref' | 'type'>>;
```

## Testing

The button is a single `<button>` element, `data-testid` is set directly on it. No other test ids are rendered.

| Element      | data-testid |
| ------------ | ----------- |
| Reset button | `{testid}`  |

Cypress example, resetting a form:

```ts
cy.get('[data-testid="name"]').type('John Doe');
cy.get('[data-testid="reset"]').click();
cy.get('[data-testid="name"]').should('have.value', '');
```

Playwright example, resetting a form:

```ts
await page.getByTestId('name').fill('John Doe');
await page.getByTestId('reset').click();
await expect(page.getByTestId('name')).toHaveValue('');
```