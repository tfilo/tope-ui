# Tag

## When to use

Use `Tag` for a **small label (chip)** that shows a short text, optionally clickable and/or removable: selected filters, categories, statuses, recipients.

- Without callbacks it is a static label.
- With `onClick` it is a clickable chip, with `onRemove` it shows a remove button.
- It is a standalone component with no form context. `Select`, `Autocomplete` and `FileInput` already render their selected values as tags, do not build those yourself.

## Import

```tsx
import { Tag } from '@tfilo/tope-ui';
```

```tsx
<Tag label='Draft' variant='secondary' />

<Tag
    label='Slovakia'
    variant='outline'
    onRemove={() => removeFilter('SK')}
/>

<Tag
    label='Active'
    onClick={() => toggleFilter('active')}
/>
```

## Props

| Prop          | Type                                                | Required | Default     | Description                                                                       |
| ------------- | --------------------------------------------------- | -------- | ----------- | --------------------------------------------------------------------------------- |
| `label`       | `string`                                            | Yes      | -           | Text displayed in the tag. Also used in the accessible name of the remove button. |
| `variant`     | `'primary' \| 'secondary' \| 'danger' \| 'outline'` | No       | `'primary'` | Visual variant.                                                                   |
| `onClick`     | `() => void \| Promise<void>`                       | No       | -           | Makes the tag clickable (pointer cursor, keyboard focusable).                     |
| `onRemove`    | `() => void \| Promise<void>`                       | No       | -           | Shows a remove button (x) after the label.                                        |
| `disabled`    | `boolean`                                           | No       | `false`     | Disables the tag and hides the remove button.                                     |
| `title`       | `string`                                            | No       | -           | Native tooltip text.                                                              |
| `data-testid` | `string`                                            | No       | -           | Base test id. See [Testing](#testing).                                            |

Do not pass `className`, it replaces all library styling.

### Behavior notes

- The tag is a `<span>` containing a label `<button>` and, when `onRemove` is set and the tag is not disabled, a remove `<button>`.
- Without `onClick` the label button is not focusable (`tabIndex=-1`), only the remove button is.
- The remove button has the accessible name from `localization.remove(label)`, e.g. `Odstrániť Slovakia` in the default Slovak localization.
- The tag has an outer margin (`m-xs`), so tags placed in a row are spaced without extra gap classes.

## Types

```ts
export interface TagProps {
    label: string;
    title?: string;
    onRemove?: () => void | Promise<void>;
    onClick?: () => void | Promise<void>;
    disabled?: boolean;
    variant?: 'primary' | 'secondary' | 'danger' | 'outline';
    className?: string;
    'data-testid'?: string;
}
```

## Testing

All test ids are derived from the `data-testid` prop. In the table `{testid}` is the value passed to `data-testid`; without the prop no test ids are rendered. The label button has no test id, find it by role and text.

| Element                           | data-testid / selector             |
| --------------------------------- | ---------------------------------- |
| Tag (`<span>` around the buttons) | `{testid}`                         |
| Remove button                     | `{testid}_remove`                  |
| Label button                      | role `button`, name is the `label` |

Cypress example, removing a tag:

```ts
cy.get('[data-testid="country-filter"]').should('contain.text', 'Slovakia');
cy.get('[data-testid="country-filter_remove"]').click();
cy.get('[data-testid="country-filter"]').should('not.exist');
```

Playwright example, removing a tag:

```ts
await expect(page.getByTestId('country-filter')).toContainText('Slovakia');
await page.getByTestId('country-filter_remove').click();
await expect(page.getByTestId('country-filter')).toHaveCount(0);
```