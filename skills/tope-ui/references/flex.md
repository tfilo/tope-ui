# Flex

## When to use

Use `Flex` for a **one-dimensional group of elements** with unified spacing: the buttons under a form, a stack of sections, a toolbar. Use it instead of writing `flex` classes by hand.

- `direction='row'` (default) puts the children side by side, **aligned to the right** by default. This fits form buttons (submit, reset).
- `direction='column'` stacks the children vertically.
- It is a layout component with no form context.

Do **not** use it for a multi-column form layout, use `Grid` and `Column`.

## Import

```tsx
import { Flex } from '@tfilo/tope-ui';
```

```tsx
<Flex>
    <form.AppForm>
        <form.SubscribeButton>Submit</form.SubscribeButton>
    </form.AppForm>
    <form.AppForm>
        <form.ResetButton>Reset</form.ResetButton>
    </form.AppForm>
</Flex>

<Flex
    direction='column'
    gap='lg'
>
    <Section title='Personal data'>{/* ... */}</Section>
    <Section title='Address'>{/* ... */}</Section>
</Flex>
```

## Props

| Prop                  | Type                                                  | Required | Default                                  | Description                                                              |
| --------------------- | ----------------------------------------------------- | -------- | ---------------------------------------- | ------------------------------------------------------------------------ |
| `children`            | `ReactNode`                                           | No       | -                                        | Items of the group.                                                      |
| `direction`           | `'row' \| 'column'`                                   | No       | `'row'`                                  | Horizontal row or vertical column.                                       |
| `gap`                 | `'none' \| 'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl'`      | No       | `'md'`                                   | Space between the children, from the theme spacing scale.                |
| `justify`             | `'none' \| 'start' \| 'center' \| 'end' \| 'between'` | No       | `'end'` for `row`, `'none'` for `column` | Alignment along the main axis. **Not allowed** for `direction='column'`. |
| `additionalClassName` | `string`                                              | No       | `''`                                     | Extra Tailwind classes appended to the container.                        |
| `data-testid`         | `string`                                              | No       | -                                        | Test id of the container. See [Testing](#testing).                       |

### Behavior notes

- The container always takes the full width of its parent.
- A row stacks its children vertically on the smallest screens and becomes a horizontal row from the `mobile` breakpoint up, so buttons do not overflow on phones.
- `justify` is a type error with `direction='column'`.

## Types

```ts
type FlexProps = PropsWithChildren<
    | { direction?: 'row'; justify?: 'none' | 'start' | 'center' | 'end' | 'between'; gap?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' }
    | { direction?: 'column'; justify?: never; gap?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' }
> & {
    additionalClassName?: string;
    'data-testid'?: string;
};
```

## Testing

`data-testid` is set directly on the container `<div>`. No other test ids are rendered.

| Element | data-testid |
| ------- | ----------- |
| Flex    | `{testid}`  |

Cypress example:

```ts
cy.get('[data-testid="form-actions"]').find('button[type="submit"]').click();
```

Playwright example:

```ts
await page.getByTestId('form-actions').locator('button[type="submit"]').click();
```
