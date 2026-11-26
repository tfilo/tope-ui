# LoadingOverlay

## When to use

Use `LoadingOverlay` to **cover a page or a section with a blurred "loading" layer** while its data is loading or an action is running, e.g. while a TanStack Query `isPending` is true.

- It renders nothing when `active` is `false`.
- It appears with a **200 ms delay**, so quick loads do not flash an overlay.
- It is a standalone component with no form context.

Do **not** wrap a `Table` that uses `onFetch` with it, the table shows its own loader.

## Import

```tsx
import { LoadingOverlay } from '@tfilo/tope-ui';
```

The overlay is absolutely positioned and fills the **nearest positioned ancestor**, so the parent must be `relative`. Make the content below inert while the overlay is active, so users cannot tab into it:

```tsx
const { data, isPending } = useQuery(vehiclesQueryOptions);

<main className='relative'>
    <div
        inert={isPending}
        aria-busy={isPending}
    >
        <VehicleList vehicles={data} />
    </div>
    <LoadingOverlay active={isPending} />
</main>;
```

## Props

| Prop          | Type      | Required | Default                | Description                                                  |
| ------------- | --------- | -------- | ---------------------- | ------------------------------------------------------------ |
| `active`      | `boolean` | Yes      | -                      | Shows the overlay when `true`, renders nothing when `false`. |
| `label`       | `string`  | No       | `localization.loading` | Text shown under the spinner (Slovak by default).            |
| `data-testid` | `string`  | No       | -                      | Test id of the overlay. See [Testing](#testing).             |

### Behavior notes

- The overlay does not block keyboard focus or screen readers by itself, use `inert` and `aria-busy` on the covered content as in the example above.
- The spinner and label are wrapped in an element with `role='status'`, so the label is announced.
- The spinner animation is disabled for users who prefer reduced motion.
- The label is centered in the visible part of the viewport (sticky), also on long pages.

## Types

```ts
export type LoadingOverlayProps = {
    active: boolean;
    label?: string;
    'data-testid'?: string;
};
```

## Testing

| Element                 | data-testid / selector |
| ----------------------- | ---------------------- |
| Overlay                 | `{testid}`             |
| Status text and spinner | role `status`          |

The overlay becomes visible 200 ms after `active` turns `true`. Assertions retry in Cypress and Playwright, so use `be.visible` / `toBeVisible` and do not add fixed waits.

Cypress example:

```ts
cy.get('[data-testid="page-loading"]').should('be.visible');
cy.get('[data-testid="page-loading"]').should('not.exist');
```

Playwright example:

```ts
await expect(page.getByTestId('page-loading')).toBeVisible();
await expect(page.getByTestId('page-loading')).toHaveCount(0);
```