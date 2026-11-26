# Column

## When to use

Use `Column` as a **direct child of `Grid`** to place content in a grid cell and, optionally, make it **span several grid columns**: a wide text area next to narrow inputs, a full-width note in a form.

- Without `colspan` it is a plain cell that takes one grid column.
- It is a layout component with no form context. Form fields (`Input`, `Autocomplete`, ...) are placed inside it.

Do **not** use it outside of `Grid`, `colspan` only has effect in a grid. For one-dimensional layouts (a row of buttons) use `Flex`.

## Import

```tsx
import { Column, Grid } from '@tfilo/tope-ui';
```

```tsx
<Grid maxRows={4}>
    <Column>
        <form.AppField name='name'>{(field) => <field.Input label='Name' />}</form.AppField>
    </Column>
    <Column>
        <form.AppField name='surname'>{(field) => <field.Input label='Surname' />}</form.AppField>
    </Column>
    <Column colspan={2}>
        <form.AppField name='note'>{(field) => <field.TextArea label='Note' />}</form.AppField>
    </Column>
</Grid>
```

## Props

| Prop          | Type               | Required | Default | Description                                                                           |
| ------------- | ------------------ | -------- | ------- | ------------------------------------------------------------------------------------- |
| `children`    | `ReactNode`        | No       | -       | Content of the cell.                                                                  |
| `colspan`     | `1 \| 2 \| 3 \| 4` | No       | `1`     | Number of grid columns the cell spans on desktop.                                     |
| `className`   | `string`           | No       | `''`    | Extra Tailwind classes appended to the cell, they do not replace the library classes. |
| `data-testid` | `string`           | No       | -       | Test id of the cell. See [Testing](#testing).                                         |

### Behavior notes

- `colspan` applies on desktop only. On tablet and mobile every cell with `colspan` 2 to 4 takes the full row.
- Keep `colspan` lower than or equal to the number of columns of the parent `Grid` (`maxRows`). A larger span creates extra grid columns.

## Types

```ts
export type ColumnProps = PropsWithChildren<{
    colspan?: 4 | 3 | 2 | 1;
    className?: string;
    'data-testid'?: string;
}>;
```

## Testing

`data-testid` is set directly on the cell `<div>`. No other test ids are rendered.

| Element | data-testid |
| ------- | ----------- |
| Column  | `{testid}`  |

Cypress example:

```ts
cy.get('[data-testid="note-column"]').find('textarea').type('Hello');
```

Playwright example:

```ts
await page.getByTestId('note-column').locator('textarea').fill('Hello');
```
