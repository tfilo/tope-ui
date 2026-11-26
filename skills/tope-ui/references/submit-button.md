# SubscribeButton

## When to use

Use `SubscribeButton` as the **submit button of a form** built with `useAppForm`. It is registered on the form as `form.SubscribeButton`. Clicking it submits the surrounding `<form>`, which runs validation and then the form's `onSubmit`.

- It is a regular `Button` (`type='submit'`), not a form field. It has no value and no `name`.
- It subscribes to the form state and is **disabled while the form is submitting**, so users cannot submit twice.

Do **not** use it for buttons that do not submit the form, use a regular `Button`.

## Import

Component should be always imported using useAppForm and used using form.AppForm see example below.

```tsx
import { useAppForm } from '@tfilo/tope-ui';
```

Important: must be rendered inside `<form.AppForm>` and inside a `<form>` element.

`SubscribeButton` reads the form via `useFormContext()`. It does not work outside of a form created with the library's `useAppForm`, and it does not work outside of `form.AppForm`, which provides that context.

- Use it as `form.SubscribeButton`, never import it directly.
- `form.AppForm` may wrap one button or both form buttons.
- It does not need to be rendered inside `form.AppField`.
- The `<form>` element must call `form.handleSubmit()` in its `onSubmit` (with `e.preventDefault()`), otherwise nothing is submitted.

```tsx
const form = useAppForm({
    defaultValues: {
        name: ''
    },
    onSubmit: async ({ value }) => {
        await saveName(value.name);
    }
});

<form
    onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
    }}
    noValidate
>
    {/* fields */}
    <form.AppForm>
        <form.SubscribeButton data-testid='submit'>Submit</form.SubscribeButton>
    </form.AppForm>
</form>;
```

## Props

Props are the `Button` props without `as`, `ref` and `type`.

| Prop           | Type                                                                 | Required | Default     | Description                                                                          |
| -------------- | -------------------------------------------------------------------- | -------- | ----------- | ------------------------------------------------------------------------------------ |
| `children`     | `ReactNode`                                                          | No       | -           | Button content, usually the text.                                                    |
| `variant`      | `'primary' \| 'secondary' \| 'danger' \| 'outline' \| 'transparent'` | No       | `'primary'` | Visual variant.                                                                      |
| `icon`         | `Icon`                                                               | No       | -           | Icon rendered before the children.                                                   |
| `showChildren` | `boolean`                                                            | No       | `true`      | When `false`, only the icon is shown and a string child is used as the button title. |
| `onClick`      | `(e: MouseEvent<HTMLButtonElement>) => void`                         | No       | -           | Called on click, before the submit. Call `e.preventDefault()` to cancel the submit.  |
| `disabled`     | `boolean`                                                            | No       | `false`     | Disables the button. It is also disabled while the form is submitting.               |
| `data-testid`  | `string`                                                             | No       | -           | Test id of the button. See [Testing](#testing).                                      |
| other props    | `Button` props and native `<button>` attributes                      | No       | -           | E.g. `textDecoration`, `additionalClassName`, `title`, `aria-*`.                     |

### Behavior notes

- The button is disabled only while the form is submitting, **not** when the form is invalid. Clicking an invalid form shows validation errors on all fields.
- "Submitting" lasts as long as the `onSubmit` promise. Make `onSubmit` `async` and `await` the request, otherwise the button is enabled again immediately.

## Types

```ts
export const SubscribeButton: React.FC<Omit<ButtonProps<'button'>, 'as' | 'ref' | 'type'>>;
```

## Testing

The button is a single `<button>` element, `data-testid` is set directly on it. No other test ids are rendered.

| Element       | data-testid |
| ------------- | ----------- |
| Submit button | `{testid}`  |

Cypress example, submitting a form:

```ts
cy.get('[data-testid="name"]').type('John Doe');
cy.get('[data-testid="submit"]').click();
```

Playwright example, submitting a form:

```ts
await page.getByTestId('name').fill('John Doe');
await page.getByTestId('submit').click();
```