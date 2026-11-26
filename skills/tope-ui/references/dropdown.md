# Dropdown

## When to use

Use `Dropdown` for a **button that opens a menu of actions**: "More" menus, row actions, user menus, a page picker.

- Each option is an action (`onClick`), not a form value. To choose a value in a form use `Select` or `Autocomplete`.
- Built on native popover, so the menu closes on `Escape` and on click outside. It needs a modern browser (Popover API and CSS anchor positioning).
- It is a standalone component with no form context.

## Import

```tsx
import { Dropdown } from '@tfilo/tope-ui';
```

```tsx
import { PencilIcon, TrashIcon } from '@heroicons/react/16/solid';

<Dropdown
    data-testid='actions'
    buttonProps={{ variant: 'outline' }}
    options={[
        { label: 'Edit', icon: PencilIcon, onClick: () => edit(id) },
        { label: 'Delete', icon: TrashIcon, onClick: () => remove(id) },
        { label: 'Archive', disabled: true, onClick: () => archive(id) }
    ]}
>
    Actions
</Dropdown>
```

Icon-only "dots" menu. There are no children, so give the trigger an accessible name with `aria-label` or `title`:

```tsx
import { EllipsisVerticalIcon } from '@heroicons/react/16/solid';

<Dropdown
    showChevron={false}
    buttonProps={{
        icon: EllipsisVerticalIcon,
        showChildren: false,
        variant: 'transparent',
        'aria-label': 'More actions'
    }}
    options={[{ label: 'Edit', onClick: () => edit(id) }]}
/>
```

## Props

| Prop          | Type                                                       | Required | Default | Description                                                                                                           |
| ------------- | ---------------------------------------------------------- | -------- | ------- | --------------------------------------------------------------------------------------------------------------------- |
| `options`     | `DropdownOption[]`                                         | Yes      | -       | Menu items, see [Options](#options).                                                                                  |
| `children`    | `ReactNode`                                                | No       | -       | Content of the trigger button.                                                                                        |
| `showChevron` | `boolean`                                                  | No       | `true`  | Shows a down chevron after the trigger content. Disable it for a dots menu.                                           |
| `buttonProps` | `Omit<ButtonProps<'button'>, 'as' \| 'ref' \| 'children'>` | No       | -       | Props of the trigger `Button`, e.g. `variant`, `icon`, `disabled`, `aria-label`, `title`. See `references/button.md`. |
| `data-testid` | `string`                                                   | No       | -       | Base test id. See [Testing](#testing).                                                                                |

### Options

| Field      | Type                                                          | Required | Description                                                                               |
| ---------- | ------------------------------------------------------------- | -------- | ----------------------------------------------------------------------------------------- |
| `label`    | `string`                                                      | Yes      | Option text. Must be **unique** within the dropdown (used as the React key).              |
| `onClick`  | `(e: MouseEvent<HTMLButtonElement>) => Promise<void> \| void` | Yes      | Called when the option is clicked, after the menu closes. An async result is not awaited. |
| `icon`     | `Icon`                                                        | No       | Icon before the label.                                                                    |
| `disabled` | `boolean`                                                     | No       | Option is shown but cannot be clicked.                                                    |
| `active`   | `boolean`                                                     | No       | Highlights the option and sets `aria-current='page'`, e.g. for the current page.          |

### Behavior notes

- The menu closes right after an option is clicked.
- The list is limited to about 200px (or half of the viewport height) and scrolls.
- For an icon-only trigger set `buttonProps.icon` together with `buttonProps.showChildren: false`, `children` are then not rendered.
- `Table` uses `Dropdown` for its page picker.

## Types

```ts
type DropdownOption = {
    label: string;
    disabled?: boolean;
    active?: boolean;
    icon?: Icon;
    onClick: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => Promise<void> | void;
};

export type DropdownProps = React.PropsWithChildren<{
    showChevron?: boolean;
    buttonProps?: Omit<ButtonProps<'button'>, 'as' | 'ref' | 'children'>;
    options: DropdownOption[];
    'data-testid'?: string;
}>;
```

## Testing

| Element                                                       | data-testid             |
| ------------------------------------------------------------- | ----------------------- |
| Trigger button                                                | `{testid}`              |
| Option button (`idx` is the zero-based position in `options`) | `{testid}_option_{idx}` |

Options are always in the DOM but visible only while the menu is open, so click the trigger first.

Cypress example:

```ts
cy.get('[data-testid="actions"]').click();
cy.get('[data-testid="actions_option_1"]').click();
```

Playwright example:

```ts
await page.getByTestId('actions').click();
await page.getByTestId('actions_option_1').click();
```