# Content

## When to use

Use `Content` as the **main content area of the application**: it centers the page and limits its maximum width. Render it once in the app shell, below `Header`, and put the routed pages inside it.

- It is the outermost wrapper of page content. Titles, sections and forms go into `Page`, which is placed inside `Content`.
- It is a layout component with no form context.

Do **not** nest several `Content` components or use it to group parts of a page, use `Section` or `Flex` for that.

## Import

```tsx
import { Content, Header } from '@tfilo/tope-ui';
```

Usually in the main router file:

```tsx
function App() {
    return (
        <>
            <Header menu={menu} />
            <Content>
                <Outlet /> {/* router outlet */}
            </Content>
        </>
    );
}
```

## Props

| Prop          | Type        | Required | Default | Description                                      |
| ------------- | ----------- | -------- | ------- | ------------------------------------------------ |
| `children`    | `ReactNode` | No       | -       | Page content, usually a `Page`.                  |
| `data-testid` | `string`    | No       | -       | Test id of the wrapper. See [Testing](#testing). |

`Content` accepts only these props, there is no `className`.

### Behavior notes

- The content is centered, takes the full width up to a maximum of about 1280px (`max-w-7xl`) and grows to fill the remaining height when its parent is a flex column.
- The content scrolls horizontally inside the wrapper when it is wider than the screen, for example a wide `Table`.

## Types

```ts
React.FC<
    React.PropsWithChildren<{
        'data-testid'?: string;
    }>
>;
```

## Testing

`data-testid` is set directly on the wrapper `<div>`. No other test ids are rendered.

| Element | data-testid |
| ------- | ----------- |
| Content | `{testid}`  |

Cypress example:

```ts
cy.get('[data-testid="content"]').should('be.visible');
```

Playwright example:

```ts
await expect(page.getByTestId('content')).toBeVisible();
```
