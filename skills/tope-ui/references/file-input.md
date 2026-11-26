# FileInput

## When to use

Use `FileInput` when the user selects **one or more files from disk** as part of a form. Selected files are displayed as tags with the file name.

- It only **holds `File` objects in form state**. It does not upload anything, the app sends the files itself, e.g. with `FormData` in `onSubmit`.
- Supports single selection (value is `File | null`) and multiple selection (`multiple`, value is `File[]`).

Do **not** use it for drag and drop (not supported) or to display files that are already stored on a server. The value must be `File` objects, so a stored file cannot be shown by name through this component.

## Import

Component should be always imported using useAppForm and used using form.AppField see example below.

```tsx
import { useAppForm } from '@tfilo/tope-ui';
```

Important: must be used inside a TanStack Form field.

`FileInput` reads its state via `useFieldContext()`. It has **no `value` or `onChange` props**, and it does not work standalone.

- Render it inside a field of a form created with the library's `useAppForm`, registered as a field component.
- Value type is `File | null` for single and `File[]` for `multiple`.
- Empty single value is `null`. Empty multiple value is `[]`.
- Never pass `value`, `onChange` or `ref`. Props that are not listed in [Props](#props) are not supported and are not passed to the native input.
- Field name comes from the field context and is set as the hidden native input's `name`.

```tsx
const form = useAppForm({
    defaultValues: {
        attachment: null as File | null
    },
    onSubmit: async ({ value }) => {
        const body = new FormData();
        if (value.attachment) body.append('attachment', value.attachment);
        await fetch('/api/upload', { method: 'POST', body });
    }
});

<form.AppField name='attachment'>
    {(field) => (
        <field.FileInput
            id='attachment'
            data-testid='attachment'
            label='Attachment'
            accept='image/*,.pdf'
            required
        />
    )}
</form.AppField>;
```

Multiple selection. The default value must be an array:

```tsx
const form = useAppForm({
    defaultValues: {
        attachments: [] as File[]
    },
    onSubmit: async ({ value }) => {
        const body = new FormData();
        value.attachments.forEach((file) => body.append('attachments', file));
        await fetch('/api/upload', { method: 'POST', body });
    }
});

<form.AppField name='attachments'>{(field) => <field.FileInput label='Attachments' multiple />}</form.AppField>;
```

Validation is done by TanStack Form validators on the field. `required` is visual only and `accept` is only a hint for the file picker, so check presence, type and size in a validator:

```tsx
<form.AppField
    name='attachment'
    validators={{
        onChange: ({ value }) => {
            if (value === null) return 'File is required';
            if (value.size > 5 * 1024 * 1024) return 'File must be smaller than 5 MB';
            return undefined;
        }
    }}
>
    {(field) => (
        <field.FileInput
            label='Attachment'
            accept='.pdf'
            required
        />
    )}
</form.AppField>
```

## Props

| Prop          | Type      | Required | Default                | Description                                                                                                                                                  |
| ------------- | --------- | -------- | ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `label`       | `string`  | No       | -                      | Label rendered above the field and linked to it via `htmlFor`.                                                                                               |
| `required`    | `boolean` | No       | `false`                | **Visual only**: shows a red asterisk and sets `aria-required`. It does not validate.                                                                        |
| `error`       | `string`  | No       | -                      | Externally provided error message. When set (not `undefined`), it **replaces** the field validation errors. Leave it `undefined` to show validator errors.  |
| `accept`      | `string`  | No       | -                      | Native `accept` attribute of the file picker, e.g. `image/*,.pdf`. Only a hint, users can still pick other files.                                            |
| `multiple`    | `boolean` | No       | `false`                | Enables multiple file selection. Field value must then be `File[]`.                                                                                          |
| `disabled`    | `boolean` | No       | `false`                | Disables the select button and the tags. Styled as disabled.                                                                                                 |
| `readOnly`    | `boolean` | No       | `false`                | Selected files are displayed but cannot be changed. The select button is disabled and tags have no remove button.                                            |
| `id`          | `string`  | No       | generated by `useId()` | Base id. The real DOM id of the field is `file-input-{id}` (the label points to it).                                                                         |
| `aria-label`  | `string`  | No       | -                      | Accessible name of the field. Use it when `label` is not set.                                                                                                |
| `data-testid` | `string`  | No       | -                      | Base test id, all inner elements derive their test id from it. See [Testing](#testing).                                                                      |

### Behavior notes

- Selecting files **replaces** the current selection, also with `multiple`, it does not append. Individual files are removed with the remove button on their tag.
- Tags show the file name only. The tag remove button label comes from `localization.remove(name)`.
- Selecting the same file again works, the native input is cleared after each selection and the files are kept only in form state. Do not rely on native form submission, read the files from the form value.
- `File` objects are not serializable, send them with `FormData`. The value cannot be restored from server data, so edit forms must handle already stored files separately.
- `form.reset()` and `setFieldValue` update the displayed tags.
- Clicking the label or an error message focuses the field.
- Validation errors are displayed only after the field is touched (focus leaves the field or the select button) or after a form submit attempt.
- Texts (select button title, remove button label, required star description) come from the library localization (`setLocalization`), Slovak by default.

## Types

```ts
export interface FileInputProps {
    multiple?: boolean;
    label?: string;
    id?: string;
    disabled?: boolean;
    required?: boolean;
    readOnly?: boolean;
    accept?: string;
    error?: string;
    'data-testid'?: string;
    'aria-label'?: string;
}
```

## Testing

All test ids are derived from the `data-testid` prop. In the table `{testid}` is the value passed to `data-testid`; without the prop no test ids are rendered.

| Element                                                       | data-testid              |
| ------------------------------------------------------------- | ------------------------ |
| Field showing the tags (`role='textbox'`)                     | `{testid}`               |
| Label                                                         | `{testid}_label`         |
| Validation / `error` message (`idx` is zero-based)            | `{testid}_error_{idx}`   |
| Select file button                                            | `{testid}_btn`           |
| Hidden native `<input type='file'>`                           | `{testid}_hidden-input`  |
| Selected file tag (`idx` is zero-based, in order of display)  | `{testid}_tag_{idx}`     |

Set files in tests directly on the hidden native input, no need to click the select button or handle the OS file dialog. The tag remove button has no test id, find it by its accessible name (`localization.remove(name)`, e.g. `Odstrániť report.pdf` by default) inside the tag.

Cypress example, selecting files:

```ts
cy.get('[data-testid="attachments_hidden-input"]').selectFile(['cypress/fixtures/report.pdf', 'cypress/fixtures/photo.png'], { force: true });
cy.get('[data-testid="attachments_tag_0"]').should('contain.text', 'report.pdf');
cy.get('[data-testid="attachments_tag_1"]').should('contain.text', 'photo.png');
```

Playwright example, selecting files:

```ts
await page.getByTestId('attachments_hidden-input').setInputFiles(['tests/fixtures/report.pdf', 'tests/fixtures/photo.png']);
await expect(page.getByTestId('attachments_tag_0')).toContainText('report.pdf');
await expect(page.getByTestId('attachments_tag_1')).toContainText('photo.png');
```