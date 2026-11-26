# Grid

## When to use

Use `Grid` for a **responsive multi-column layout**: form fields side by side, a set of `Card` tiles, key-value blocks. Cells are `Column` components (or any other element).

- On desktop it has up to 4 columns, on tablet 2 and on mobile 1, with a fixed gap between cells.
- Use `Column` with `colspan` for a cell that spans more columns.
- It is a layout component with no form context.

Do **not** use it for a simple row of buttons, use `Flex`.

## Import

```tsx
import { Column, Grid } from '@tfilo/tope-ui';
```

```tsx
<Grid maxRows={2}>
    <Column>
        <form.AppField name='street'>{(field) => <field.Input label='Street' />}</form.AppField>
    </Column>
    <Column>
        <form.AppField name='city'>{(field) => <field.Input label='City' />}</form.AppField>
    </Column>
</Grid>
```

## Props

| Prop          | Type          | Required | Default | Description                                                               |
| ------------- | ------------- | -------- | ------- | ------------------------------------------------------------------------- |
| `children`    | `ReactNode`   | No       | -       | Grid cells, usually `Column` components.                                  |
| `maxRows`     | `4 \| 2 \| 1` | No       | `4`     | **Number of columns on desktop** (despite its name). See the table below. |
| `data-testid` | `string`      | No       | -       | Test id of the grid. See [Testing](#testing).                             |

Columns per screen size:

| `maxRows` | Desktop | Tablet | Mobile |
| --------- | ------- | ------ | ------ |
| `4`       | 4       | 2      | 1      |
| `2`       | 2       | 2      | 1      |
| `1`       | 1       | 1      | 1      |

### Behavior notes

- Despite its name, `maxRows` is the maximum number of **columns** per row on desktop, extra cells wrap into new rows.
- Cells have a fixed gap, there is no prop to change it.
- `Grid` accepts only these props, there is no `className`.

## Types

```ts
export type GridProps = PropsWithChildren<{
    maxRows?: 4 | 2 | 1;
    'data-testid'?: string;
}>;
```

## Testing

`data-testid` is set directly on the grid `<div>`. No other test ids are rendered.

| Element | data-testid |
| ------- | ----------- |
| Grid    | `{testid}`  |

Cypress example:

```ts
cy.get('[data-testid="address-grid"]').children().should('have.length', 2);
```

Playwright example:

```ts
await expect(page.getByTestId('address-grid').locator('> *')).toHaveCount(2);
```
