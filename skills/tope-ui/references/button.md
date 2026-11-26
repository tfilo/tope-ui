# Button

## When to use

Use `Button` for any **clickable action**: save, cancel, open a dialog, navigate, toolbar and table row actions.

- Renders a `<button>` by default. `as` renders another element or component (`'a'`, a router `Link`) with the same look.
- Icon-only buttons (`showChildren={false}`) are used for compact actions, e.g. edit/delete in table rows.
- It is a standalone component with no form context. To submit or reset a form use `form.SubscribeButton` and `form.ResetButton` (`references/submit-button.md`, `references/reset-button.md`), which are built on `Button`.

## Import

```tsx
import { Button } from '@tfilo/tope-ui';
```

```tsx
import { TrashIcon } from '@heroicons/react/16/solid';

<Button onClick={handleSave}>Save</Button>

<Button
    variant='danger'
    icon={TrashIcon}
    showChildren={false}
    onClick={handleDelete}
>
    Delete
</Button>
```

As a link. Props of the rendered element are typed from `as`:

```tsx
import { Link } from '@tanstack/react-router';

<Button
    as={Link}
    to='/users'
    variant='outline'
>
    Users
</Button>

<Button
    as='a'
    href='https://example.com'
    variant='transparent'
    textDecoration='underline'
>
    Documentation
</Button>
```

## Props

| Prop                  | Type                                                                 | Required | Default                       | Description                                                                                                                |
| --------------------- | -------------------------------------------------------------------- | -------- | ----------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| `children`            | `ReactNode`                                                          | No       | -                             | Button content. Not rendered when `showChildren` is `false`.                                                               |
| `variant`             | `'primary' \| 'secondary' \| 'danger' \| 'outline' \| 'transparent'` | No       | `'primary'`                   | Visual variant. `danger` for destructive actions, `transparent` for inline and toolbar actions.                            |
| `icon`                | `Icon`                                                               | No       | -                             | Icon component rendered before the children, e.g. from `@heroicons/react/16/solid`.                                        |
| `showChildren`        | `boolean`                                                            | No       | `true`                        | When `false`, only the icon is shown. A **string** child is then used as the button `title` (tooltip and accessible name). |
| `textDecoration`      | `'underline' \| 'none'`                                              | No       | `'none'`                      | Underlines the content, useful for link-like buttons.                                                                      |
| `additionalClassName` | `string`                                                             | No       | `'min-w-[32px] min-h-[32px]'` | Tailwind classes appended to the base styles. Passing a value **replaces** the default minimal size classes.               |
| `as`                  | `ElementType`                                                        | No       | `'button'`                    | Element or component to render instead of `<button>`.                                                                      |
| `ref`                 | `RefObject`                                                          | No       | -                             | Ref to the rendered element.                                                                                               |
| `disabled`            | `boolean`                                                            | No       | `false`                       | Disables the button (native attribute, styled as disabled).                                                                |
| `data-testid`         | `string`                                                             | No       | -                             | Test id of the rendered element. See [Testing](#testing).                                                                  |
| other props           | props of the element or component in `as`                            | No       | -                             | E.g. `onClick`, `type`, `title`, `aria-*`, `href` for `as='a'`.                                                            |

Do not pass `className`, it replaces all library styling (variant, size, focus). Use `additionalClassName` instead.

### Behavior notes

- For a real `<button>` the library sets `type='button'`, so it never submits a surrounding form by accident. Pass `type='submit'` explicitly only when needed.
- Icon-only buttons must have a **string** child (kept as the accessible name), otherwise they have no accessible name.
- Buttons with visible text are full width on the smallest screens and fit their content from the `mobile` breakpoint up. Icon-only buttons always fit their content.
- `onClick` may be async, `Button` does not track a pending state. Disable the button yourself while a request runs.
- An explicit `title` prop wins over the title taken from the string child.

## Types

```ts
type ButtonProps<T extends ElementType> = {
    children?: ReactNode;
    variant?: 'primary' | 'secondary' | 'danger' | 'outline' | 'transparent';
    icon?: Icon;
    textDecoration?: 'underline' | 'none';
    showChildren?: boolean;
    additionalClassName?: string;
    className?: string;
    as?: T;
    ref?: RefObject<unknown | null>;
} & Omit<React.ComponentPropsWithRef<T>, 'children' | 'variant' | 'icon' | 'textDecoration' | 'showChildren' | 'additionalClassName' | 'className' | 'as'>;
```

## Testing

`data-testid` is set directly on the rendered element. No other test ids are rendered.

| Element | data-testid |
| ------- | ----------- |
| Button  | `{testid}`  |

Cypress example:

```ts
cy.get('[data-testid="save"]').should('be.enabled').click();
```

Playwright example:

```ts
await expect(page.getByTestId('save')).toBeEnabled();
await page.getByTestId('save').click();
```