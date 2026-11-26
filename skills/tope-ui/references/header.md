# Header

## When to use

Use `Header` as the **application header** with the main navigation and the user's profile and logout buttons. Render it once in the app shell, above `Content`.

- The menu consists of buttons, and of dropdowns that group several navigation actions.
- The profile and logout buttons are shown only when you pass `onProfile` / `onLogout`, so a logged-out user can see only a menu, or nothing.
- It renders `null` when there is no menu item and neither `onProfile` nor `onLogout`.
- It is a layout component with no form context. Navigation is done by your callbacks, it does not know about the router.

## Import

```tsx
import { Header, type MenuItem } from '@tfilo/tope-ui';
```

```tsx
import { HomeIcon, UsersIcon, Cog6ToothIcon } from '@heroicons/react/16/solid';

const menu: MenuItem[] = [
    {
        label: 'Home',
        icon: HomeIcon,
        active: pathname === '/',
        onClick: () => router.navigate({ to: '/' })
    },
    {
        label: 'Administration',
        icon: Cog6ToothIcon,
        menu: [
            { label: 'Users', icon: UsersIcon, active: pathname === '/users', onClick: () => router.navigate({ to: '/users' }) },
            { label: 'Roles', icon: UsersIcon, active: pathname === '/roles', onClick: () => router.navigate({ to: '/roles' }) }
        ]
    }
];

<Header
    data-testid='header'
    menu={menu}
    onProfile={() => router.navigate({ to: '/profile' })}
    onLogout={isLoggedIn ? handleLogout : undefined}
/>;
```

## Props

| Prop          | Type                                                          | Required | Default | Description                                                                   |
| ------------- | ------------------------------------------------------------- | -------- | ------- | ----------------------------------------------------------------------------- |
| `menu`        | `MenuItem[]`                                                  | No       | `[]`    | Navigation items. See [Menu items](#menu-items).                              |
| `onProfile`   | `(e: MouseEvent<HTMLButtonElement>) => Promise<void> \| void` | No       | -       | Shows the profile button on the right.                                        |
| `onLogout`    | `(e: MouseEvent<HTMLButtonElement>) => Promise<void> \| void` | No       | -       | Shows the logout button on the right. Pass `undefined` for a logged-out user. |
| `data-testid` | `string`                                                      | No       | -       | Base test id. See [Testing](#testing).                                        |

### Menu items

A menu item is **either** a button **or** a dropdown, never both:

| Field     | Type                                                          | Required           | Description                                                                                            |
| --------- | ------------------------------------------------------------- | ------------------ | ------------------------------------------------------------------------------------------------------ |
| `label`   | `string`                                                      | Yes                | Item text. Must be **unique** in the menu (used as the React key). Also the title and accessible name. |
| `icon`    | `Icon`                                                        | Yes                | Item icon, e.g. from `@heroicons/react/16/solid`.                                                      |
| `active`  | `boolean`                                                     | No                 | Marks the current page: highlighted item with `aria-current='page'`.                                   |
| `onClick` | `(e: MouseEvent<HTMLButtonElement>) => Promise<void> \| void` | Button item only   | Called when the item is clicked.                                                                       |
| `menu`    | `{ icon, label, active?, onClick }[]`                         | Dropdown item only | Navigation actions listed in the dropdown. The dropdown item is active when any of them is active.     |

### Behavior notes

- Compute `active` from the current route yourself, the header does not track it.
- Below the tablet breakpoint the menu shows only icons, the label stays as the title and accessible name. Always provide a clear `label`.
- The menu scrolls horizontally when it does not fit.
- Texts of the profile and logout buttons come from the library localization (`setLocalization`), Slovak by default.

## Types

```ts
type MenuAction = {
    icon: Icon;
    label: string;
    active?: boolean;
    onClick: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => Promise<void> | void;
};

export type MenuItem = Omit<MenuAction, 'onClick'> &
    ({ onClick: MenuAction['onClick']; menu?: never } | { onClick?: never; menu: MenuAction[] });

export type HeaderProps = {
    menu?: MenuItem[];
    onLogout?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => Promise<void> | void;
    onProfile?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => Promise<void> | void;
    'data-testid'?: string;
};
```

## Testing

All test ids are derived from the `data-testid` prop. In the table `{testid}` is the value passed to `data-testid`; without the prop no test ids are rendered. The `<header>` element itself has no test id.

| Element                                                                        | data-testid                                |
| ------------------------------------------------------------------------------ | ------------------------------------------ |
| Menu button, or dropdown trigger (`idx` is the zero-based position in `menu`)  | `{testid}_menu_item_{idx}`                 |
| Action in a dropdown menu item (`optIdx` is the zero-based position in `menu`) | `{testid}_menu_item_{idx}_option_{optIdx}` |
| Profile button                                                                 | `{testid}_profile`                         |
| Logout button                                                                  | `{testid}_logout`                          |

Cypress example, navigating through a dropdown menu item and logging out:

```ts
cy.get('[data-testid="header_menu_item_1"]').click();
cy.get('[data-testid="header_menu_item_1_option_0"]').click();
cy.get('[data-testid="header_logout"]').click();
```

Playwright example:

```ts
await page.getByTestId('header_menu_item_1').click();
await page.getByTestId('header_menu_item_1_option_0').click();
await page.getByTestId('header_logout').click();
```
