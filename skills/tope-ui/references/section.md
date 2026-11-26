# Section

## When to use

Use `Section` to **group related content under a heading** inside a `Page`: a block of form fields ("Address"), a detail block, a table with its own title. It can show small icon buttons next to the title (edit, add, delete).

- By default it is a bordered box with a header bar and padded content. With `hasBorder={false}` it is plain content under a title with a bottom line.
- Children are laid out in a column with a gap. Use `Grid` and `Column` inside it for multi-column forms.
- It is a layout component with no form context.

## Import

```tsx
import { Section } from '@tfilo/tope-ui';
```

```tsx
import { PencilIcon } from '@heroicons/react/16/solid';

<Section
    title='Address'
    actions={[{ icon: PencilIcon, title: 'Edit address', onClick: () => openAddressDialog() }]}
>
    <Grid maxRows={2}>
        <Column>
            <form.AppField name='address.street'>{(field) => <field.Input label='Street' />}</form.AppField>
        </Column>
        <Column>
            <form.AppField name='address.city'>{(field) => <field.Input label='City' />}</form.AppField>
        </Column>
    </Grid>
</Section>

<Section
    title='Notes'
    titleType='h3'
    hasBorder={false}
>
    <List items={['First note', 'Second note']} />
</Section>
```

## Props

| Prop        | Type                                   | Required | Default | Description                                                                               |
| ----------- | -------------------------------------- | -------- | ------- | ----------------------------------------------------------------------------------------- |
| `title`     | `string`                               | No       | -       | Section title. Not rendered when blank.                                                   |
| `titleType` | `'h2' \| 'h3' \| 'h4' \| 'h5' \| 'h6'` | No       | `'h2'`  | Heading element of the title. It only changes the element, not the look.                  |
| `hasBorder` | `boolean`                              | No       | `true`  | Bordered box with a header bar, or `false` for plain content with a line under the title. |
| `actions`   | `SectionAction[]`                      | No       | -       | Icon buttons at the top right of the header. See [Actions](#actions).                     |
| `children`  | `ReactNode`                            | No       | -       | Content of the section.                                                                   |

`Section` accepts only these props, there is no `className` and no `data-testid`.

### Actions

Each action is an icon-only button:

| Field      | Type                                                                 | Required | Description                                            |
| ---------- | -------------------------------------------------------------------- | -------- | ------------------------------------------------------ |
| `icon`     | `Icon`                                                               | Yes      | Icon component, e.g. from `@heroicons/react/16/solid`. |
| `title`    | `string`                                                             | Yes      | Tooltip and accessible name of the button.             |
| `onClick`  | `(e: MouseEvent<HTMLButtonElement>) => Promise<void> \| void`        | Yes      | Called when the button is clicked.                     |
| `disabled` | `boolean`                                                            | No       | Disables the button.                                   |
| `variant`  | `'primary' \| 'secondary' \| 'danger' \| 'outline' \| 'transparent'` | No       | Button variant, `transparent` by default.              |

### Behavior notes

- The header is rendered only when there is a `title` or at least one action.
- Keep headings in order: a `Section` in a `Page` (`h1`) uses `h2`, a nested section can use `titleType='h3'`.
- A long title wraps inside the header, actions stay on the right.

## Types

```ts
export type SectionAction = {
    icon: Icon;
    title: string;
    onClick: NonNullable<ButtonProps<'button'>['onClick']>;
    disabled?: boolean;
    variant?: ButtonProps<'button'>['variant'];
};

export type SectionProps = PropsWithChildren<{
    title?: string;
    titleType?: 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
    hasBorder?: boolean;
    actions?: SectionAction[];
}>;
```

## Testing

`Section` has no `data-testid` prop and renders no test ids, neither for the section nor for its action buttons. Find the title by its heading role and text, and the action buttons by their accessible name (the action `title`). Elements inside the section keep their own test ids.

| Element       | Selector                                  |
| ------------- | ----------------------------------------- |
| Section title | role `heading`, name is the `title`       |
| Action button | role `button`, name is the action `title` |

Cypress example:

```ts
cy.contains('h2', 'Address').should('be.visible');
cy.get('button[title="Edit address"]').click();
```

Playwright example:

```ts
await expect(page.getByRole('heading', { name: 'Address' })).toBeVisible();
await page.getByRole('button', { name: 'Edit address' }).click();
```
