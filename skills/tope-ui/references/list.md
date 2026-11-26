# List

## When to use

Use `List` to display **a simple bulleted or numbered list** of short items: requirements, steps, feature lists, validation hints.

- `listType='unordered'` renders `<ul>` with bullets, `'ordered'` renders `<ol>` with numbers.
- Items are strings, numbers or React elements.
- It is a standalone component with no form context.

Do **not** use it for tabular data, use `Table`. For a list of actions use `Dropdown`.

## Import

```tsx
import { List } from '@tfilo/tope-ui';
```

```tsx
<List items={['Name is required', 'Email must be valid']} />

<List
    listType='ordered'
    data-testid='steps'
    items={['Fill in the form', <strong key='submit'>Submit</strong>, 'Wait for confirmation']}
/>
```

## Props

| Prop          | Type                                             | Required | Default       | Description                                    |
| ------------- | ------------------------------------------------ | -------- | ------------- | ---------------------------------------------- |
| `items`       | `(ReactElement \| string \| number \| bigint)[]` | No       | `[]`          | Items of the list, each rendered as an `<li>`. |
| `listType`    | `'unordered' \| 'ordered'`                       | No       | `'unordered'` | Bulleted (`<ul>`) or numbered (`<ol>`) list.   |
| `data-testid` | `string`                                         | No       | -             | Base test id. See [Testing](#testing).         |

`List` accepts only these props, there is no `className` and no `children`.

### Behavior notes

- Markers are rendered inside the content box (`list-inside`).
- An empty `items` array renders an empty list element.

## Types

```ts
export interface ListProps {
    listType?: 'unordered' | 'ordered';
    items?: (ReactElement | string | number | bigint)[];
    'data-testid'?: string;
}
```

## Testing

| Element                    | data-testid           |
| -------------------------- | --------------------- |
| List (`<ul>` or `<ol>`)    | `{testid}`            |
| Item (`idx` is zero-based) | `{testid}_item_{idx}` |

Cypress example:

```ts
cy.get('[data-testid="steps"]').children().should('have.length', 3);
cy.get('[data-testid="steps_item_0"]').should('contain.text', 'Fill in the form');
```

Playwright example:

```ts
await expect(page.getByTestId('steps').locator('li')).toHaveCount(3);
await expect(page.getByTestId('steps_item_0')).toContainText('Fill in the form');
```