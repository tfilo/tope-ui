# Modal

## When to use

Use `Modal` for a **confirmation or information dialog** that blocks the page until the user decides: confirm a delete, discard changes, show a notice.

- It renders a native `<dialog>` opened with `showModal()`, so focus is trapped, the page behind is inert and `Escape` is handled by the browser.
- It has a title, a body and a **Cancel** and **Confirm** button. Cancel can be hidden.
- It is a standalone component with no form context.

Do **not** use it for a large form or a multi-step flow, use a page.

## Import

```tsx
import { Modal } from '@tfilo/tope-ui';
```

`Modal` is **controlled**: it never closes itself. Every way of closing calls `onClose`, and the parent must set `openModal` to `false`.

```tsx
const [open, setOpen] = useState(false);

<Button
    variant='danger'
    onClick={() => setOpen(true)}
>
    Delete
</Button>

<Modal
    data-testid='delete-modal'
    openModal={open}
    variant='danger'
    title='Delete vehicle'
    body='This action cannot be undone.'
    confirmLabel='Delete'
    onClose={async (confirm) => {
        setOpen(false);
        if (confirm) await deleteVehicle(id);
    }}
/>;
```

Information dialog without the cancel button:

```tsx
<Modal
    openModal={open}
    title='Saved'
    body='Your changes were saved.'
    cancelLabel={null}
    onClose={() => setOpen(false)}
/>
```

## Props

| Prop           | Type                                          | Required | Default                           | Description                                                                                                          |
| -------------- | --------------------------------------------- | -------- | --------------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| `openModal`    | `boolean`                                     | Yes      | -                                 | Shows the modal when `true`, closes it when `false`.                                                                 |
| `title`        | `string`                                      | Yes      | -                                 | Title displayed at the top, in bold.                                                                                 |
| `body`         | `ReactNode`                                   | Yes      | -                                 | Content of the modal: text or any React elements.                                                                    |
| `onClose`      | `(confirm: boolean) => Promise<void> \| void` | No       | -                                 | Called with `true` for the confirm button, and with `false` for the cancel button, `Escape` and backdrop click.      |
| `variant`      | `'primary' \| 'danger'`                       | No       | `'primary'`                       | Color of the icon and the confirm button. `danger` also uses a warning icon.                                         |
| `size`         | `'normal' \| 'large'`                         | No       | `'normal'`                        | Maximum width, about 600px for `normal` and 1200px for `large`, never more than 90% of the viewport.                 |
| `confirmLabel` | `string`                                      | No       | `localization.modal.confirmLabel` | Text of the confirm button.                                                                                          |
| `cancelLabel`  | `string \| null`                              | No       | `localization.modal.cancelLabel`  | Text of the cancel button. `null` hides the cancel button.                                                           |
| `icon`         | `Icon`                                        | No       | by `variant`                      | Icon next to the title. Default is an info icon, or a warning icon for `danger`.                                     |
| `closedby`     | `'any' \| 'closerequest' \| 'none'`           | No       | `'any'`                           | `any`: `Escape` and backdrop click close. `closerequest`: only `Escape`. `none`: neither, only the buttons close it. |
| `data-testid`  | `string`                                      | No       | -                                 | Base test id. See [Testing](#testing).                                                                               |
| other props    | `DialogHTMLAttributes<HTMLDialogElement>`     | No       | -                                 | Spread to the `<dialog>`, e.g. `id`, `aria-*`. `className` is ignored.                                               |

### Behavior notes

- The parent owns the state. If `onClose` does not set `openModal` to `false`, the modal stays open.
- `Escape` and backdrop click call `onClose(false)` and do not close the dialog by themselves. Use `closedby` to disable them.
- `onClose` is awaited and errors are caught and logged with `console.error`. The buttons are not disabled while an async `onClose` runs.
- The confirm button is a plain button, not a submit button. If the body contains a form, call the form submit from `onClose(true)`.
- The `<dialog>` and its `body` are always in the DOM, even when closed. Render an expensive body conditionally.
- Texts (default button labels) come from the library localization (`setLocalization`), Slovak by default.

## Types

```ts
export interface ModalProps extends Omit<DialogHTMLAttributes<HTMLDialogElement>, 'onClose'> {
    openModal: boolean;
    title: string;
    body: ReactNode;
    size?: 'normal' | 'large';
    onClose?: (confirm: boolean) => Promise<void> | void;
    variant?: 'primary' | 'danger';
    confirmLabel?: string;
    cancelLabel?: string | null;
    icon?: Icon;
    'data-testid'?: string;
}
```

## Testing

| Element        | data-testid        |
| -------------- | ------------------ |
| Dialog         | `{testid}`         |
| Cancel button  | `{testid}_cancel`  |
| Confirm button | `{testid}_confirm` |

The cancel button has no test id when `cancelLabel` is `null`. A closed dialog is not visible, so assert with `be.visible` / `toBeVisible`.

Cypress example:

```ts
cy.get('[data-testid="delete-modal"]').should('be.visible');
cy.get('[data-testid="delete-modal_confirm"]').click();
cy.get('[data-testid="delete-modal"]').should('not.be.visible');
```

Playwright example:

```ts
await expect(page.getByTestId('delete-modal')).toBeVisible();
await page.getByTestId('delete-modal_confirm').click();
await expect(page.getByTestId('delete-modal')).toBeHidden();
```