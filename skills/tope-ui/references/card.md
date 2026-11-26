# Card

## When to use

Use `Card` for an **image tile with a title and description** in a grid of items: products, vehicles, projects, categories. It can be a clickable tile (open detail) and can show a small action button in the corner (e.g. edit).

- With `onClick` the whole card is a `<button>` with hover and focus effects. Without it, it is a plain `<div>`.
- The image is a CSS background, a built-in placeholder is used when `imageUrl` is empty.
- Below the tablet breakpoint the card switches to a compact horizontal layout (small image on the left), unless `compactOnMobile` is `false`.
- It is a standalone component with no form context. It has no `children`, content is given by props. Place cards in a `Grid` / `Column` layout.

## Import

```tsx
import { Card } from '@tfilo/tope-ui';
```

```tsx
<Card
    data-testid='vehicle-1'
    imageUrl='/images/octavia.jpg'
    title='Skoda Octavia'
    description='2.0 TDI, 2021'
    onClick={() => navigate({ to: '/vehicles/$id', params: { id: '1' } })}
    onAction={() => openEditDialog('1')}
    actionLabel='Edit vehicle'
/>
```

## Props

| Prop              | Type                                                          | Required | Default              | Description                                                                                                        |
| ----------------- | ------------------------------------------------------------- | -------- | -------------------- | ------------------------------------------------------------------------------------------------------------------ |
| `title`           | `string`                                                      | No       | -                    | Card headline.                                                                                                     |
| `description`     | `string`                                                      | No       | -                    | Card description text under the title.                                                                             |
| `imageUrl`        | `string`                                                      | No       | built-in placeholder | Image URL, used when not blank.                                                                                    |
| `onClick`         | `(e: MouseEvent<HTMLButtonElement>) => Promise<void> \| void` | No       | -                    | Makes the whole card a button with hover and focus effects.                                                        |
| `onAction`        | `(e: MouseEvent<HTMLButtonElement>) => Promise<void> \| void` | No       | -                    | Shows an icon button in the top right corner. Its click does **not** trigger `onClick`.                            |
| `actionIcon`      | `Icon`                                                        | No       | `PencilSquareIcon`   | Icon of the action button.                                                                                         |
| `actionLabel`     | `string`                                                      | No       | `localization.edit`  | Accessible name and tooltip of the action button.                                                                  |
| `ariaLabel`       | `string`                                                      | No       | -                    | `aria-label` of the card element. Set it when the card has no title, or the title is not a good name for the card. |
| `compactOnMobile` | `boolean`                                                     | No       | `true`               | Compact horizontal layout below the tablet breakpoint. Set `false` to keep the square image card on small screens. |
| `data-testid`     | `string`                                                      | No       | -                    | Base test id. See [Testing](#testing).                                                                             |

`Card` accepts only these props, there is no `className`.

### Behavior notes

- The action button is rendered next to the card element, not inside it, so there are no nested buttons.
- The image is not an `<img>`, so it has no alt text. Put the meaning into `title` or `ariaLabel`.
- Title and description are plain strings. Texts (the default `actionLabel`) come from the library localization (`setLocalization`), Slovak by default.

## Types

```ts
export type CardProps = {
    imageUrl?: string;
    ariaLabel?: string;
    title?: string;
    description?: string;
    compactOnMobile?: boolean;
    onClick?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => Promise<void> | void;
    actionIcon?: Icon;
    actionLabel?: string;
    onAction?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => Promise<void> | void;
    'data-testid'?: string;
};
```

## Testing

| Element                                                     | data-testid       |
| ----------------------------------------------------------- | ----------------- |
| Card element (`<button>` with `onClick`, otherwise `<div>`) | `{testid}`        |
| Action button (only with `onAction`)                        | `{testid}_action` |

Cypress example:

```ts
cy.get('[data-testid="vehicle-1_action"]').click();
cy.get('[data-testid="vehicle-1"]').click();
```

Playwright example:

```ts
await page.getByTestId('vehicle-1_action').click();
await page.getByTestId('vehicle-1').click();
```