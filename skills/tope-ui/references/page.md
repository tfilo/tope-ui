# Page

## When to use

Use `Page` as the **root element of one screen (route)**: it gives the screen consistent padding, an optional title and an optional back button, and spaces its children evenly.

- Render one `Page` per route, inside `Content`. Put `Section`, `Grid`, `Table` and form buttons inside it.
- With `onBack` it shows a back button before the title, for detail and edit screens.
- It is a layout component with no form context. For a form screen, the `<form>` element wraps the `Page`, as in the second example below.

## Import

```tsx
import { Page } from '@tfilo/tope-ui';
```

```tsx
<Page
    data-testid='vehicle-page'
    title='Vehicle detail'
    onBack={() => router.navigate({ to: '/vehicles' })}
>
    <Section title='Basic data'>{/* ... */}</Section>
    <Flex>{/* form buttons */}</Flex>
</Page>
```

Page inside a form:

```tsx
<form
    onSubmit={(e) => {
        e.preventDefault();
        form.handleSubmit();
    }}
    noValidate
>
    <Page title='New vehicle'>{/* fields and buttons */}</Page>
</form>
```

## Props

| Prop          | Type                                           | Required | Default | Description                                                              |
| ------------- | ---------------------------------------------- | -------- | ------- | ------------------------------------------------------------------------ |
| `title`       | `string`                                       | No       | -       | Page title. Not rendered when blank.                                     |
| `titleType`   | `'h1' \| 'h2' \| 'h3' \| 'h4' \| 'h5' \| 'h6'` | No       | `'h1'`  | Heading element of the title. It only changes the element, not the look. |
| `onBack`      | `() => void \| Promise<void>`                  | No       | -       | Shows a back button before the title and calls it on click.              |
| `children`    | `ReactNode`                                    | No       | -       | Page content. Children are laid out in a column with a gap.              |
| `data-testid` | `string`                                       | No       | -       | Base test id. See [Testing](#testing).                                   |

### Behavior notes

- The header row (back button and title) is rendered only when there is a `title` or `onBack`.
- Keep one `h1` per screen. Use `titleType='h2'` or lower for a `Page` that is not the main screen heading.
- The back button text (accessible name) comes from the library localization (`setLocalization`), Slovak by default.

## Types

```ts
export type PageProps = PropsWithChildren<{
    title?: string;
    titleType?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
    onBack?: () => void | Promise<void>;
    'data-testid'?: string;
}>;
```

## Testing

All test ids are derived from the `data-testid` prop. In the table `{testid}` is the value passed to `data-testid`; without the prop no test ids are rendered.

| Element                     | data-testid      |
| --------------------------- | ---------------- |
| Page (root `<div>`)         | `{testid}`       |
| Title heading               | `{testid}_title` |
| Back button (with `onBack`) | `{testid}_back`  |

Cypress example:

```ts
cy.get('[data-testid="vehicle-page_title"]').should('have.text', 'Vehicle detail');
cy.get('[data-testid="vehicle-page_back"]').click();
```

Playwright example:

```ts
await expect(page.getByTestId('vehicle-page_title')).toHaveText('Vehicle detail');
await page.getByTestId('vehicle-page_back').click();
```
