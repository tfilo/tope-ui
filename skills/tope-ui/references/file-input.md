# FileInput

File picker bound to a form field. Opens the native file dialog through a button and shows selected files as removable tags. Supports single and multiple selection.

## When to use

- You need the user to select one `File` or several `File`s as part of a form.
- The files are uploaded on submit (for example as `FormData`).

Do NOT use for drag-and-drop zones, image previews, upload progress, or displaying already uploaded files. None of these are supported.

## Import

Component should be always imported using useAppForm and used using form.AppField see example below.

```tsx
import { useAppForm } from '@tfilo/tope-ui';
```

## Critical: must be used inside a TanStack Form field

`FileInput` reads its state via `useFieldContext<File | File[] | null>()`. It has **no `value` or `onChange` props**, and it does not work standalone.

- Render it inside a field of a form created with the library's `useAppForm`, registered as a field component.
- Value type is `File | null` for single and `File[]` for `multiple`.
- Empty single value is `null`. Empty multiple value is `[]`. **Not `''` and not `undefined`.**
- The `multiple` prop decides the shape of the value. The default value in the form must match it.
- Field name comes from the field context and is set as the `name` of the hidden `<input type='file'>`.
- The component accepts **only the props listed below**. It does not extend `InputHTMLAttributes`, so no `title`, `placeholder` or `onChange`. `aria-label` and `data-testid` are supported explicitly.

```tsx
const form = useAppForm({
    defaultValues: {
        avatar: null as File | null,
        attachments: [] as File[]
    },
    onSubmit: async ({ value }) => {
        const body = new FormData();
        if (value.avatar) body.append('avatar', value.avatar);
        value.attachments.forEach((file) => body.append('attachments', file));
        await uploadFiles(body);
    }
});

<form.AppField name='avatar'>
    {(field) => (
        <field.FileInput
            id='avatar'
            label='Avatar'
            accept='image/*'
            required
            data-testid='avatar'
        />
    )}
</form.AppField>

<form.AppField name='attachments'>
    {(field) => (
        <field.FileInput
            id='attachments'
            label='Attachments'
            multiple
            data-testid='attachments'
        />
    )}
</form.AppField>
```

## Props

| Prop          | Type      | Required | Default     | Description                                                                                                                                                                                                                                                                                              |
| ------------- | --------- | -------- | ----------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `label`       | `string`  | no       | `undefined` | Renders as label of component. Preferred way to give the control an accessible name. Always provide it unless the layout really has no visible label (then use `aria-label`).                                                                                                                            |
| `aria-label`  | `string`  | no       | `undefined` | Accessible name set on the textbox element. Use only when there is no visible `label`. **Ignored when `label` or any error is rendered**, see [Accessibility](#accessibility).                                                                                                                           |
| `error`       | `string`  | no       | `undefined` | External error. **Overrides** form validation errors when set. When not blank, the whole input is shown in the danger color.                                                                                                                                                                             |
| `multiple`    | `boolean` | no       | `undefined` | Multi-select. Field value becomes `File[]`.                                                                                                                                                                                                                                                              |
| `accept`      | `string`  | no       | `undefined` | Passed to the native input (e.g. `'image/*'`, `'.pdf,.docx'`). Only a hint for the file dialog, **not validation**.                                                                                                                                                                                      |
| `disabled`    | `boolean` | no       | `undefined` | Disables the button, the hidden input and the tags.                                                                                                                                                                                                                                                      |
| `readOnly`    | `boolean` | no       | `undefined` | Disables the select button and tag removal. Files already in the value are still shown.                                                                                                                                                                                                                  |
| `required`    | `boolean` | no       | `undefined` | Marks the label as required (visual only, validation is up to the form) and sets `aria-required` on the textbox element.                                                                                                                                                                                 |
| `id`          | `string`  | no       | auto        | Base id. The visible textbox element id becomes `file-input-${id}`. See [Ids](#ids).                                                                                                                                                                                                                     |
| `data-testid` | `string`  | no       | `undefined` | Playwright attribute. Set as-is on the textbox element (`<data-testid>`), and derived on tags (`<data-testid>_tag_<idx>`), the upload button (`<data-testid>_btn`), the hidden input (`<data-testid>_hidden-input`), the label (`<data-testid>_label`) and error messages (`<data-testid>_error_<idx>`). |

### Types

```ts
interface FileInputProps {
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

// Field value
type FileInputValue = File | File[] | null; // File | null when single, File[] when multiple
```

## Ids

- The base id is `id` if passed, otherwise a generated `useId()` value. The textbox element id is always `file-input-<baseId>`. Everything below is derived from that id.
- Without `id`, the generated value is not stable between renders/environments and can contain characters that need escaping in CSS selectors. **Pass `data-testid` (or an explicit `id`) whenever the field is targeted from Playwright.**
- With `id='avatar'`:
    - visible element (`div[role='textbox']`): `file-input-avatar`
    - label: `file-input-avatar-label`
    - errors: always `file-input-avatar-error-<idx>`, starting at `0`. A single error (external `error` prop or one form error) is `file-input-avatar-error-0`. There is no id without index.
- The hidden `<input type='file'>` has **no id**. It has `name` (the field name) and, when `data-testid` is set, `data-testid='<data-testid>_hidden-input'`.

## Accessibility

- The visible element is a focusable `div` with `role='textbox'` and `tabIndex=0` (not a native input). Label and error `htmlFor` point to it, and click on them is forwarded as focus (see Behavior).
- `aria-labelledby` is set on the textbox and lists, in order: the label id (if `label` is not blank), then all rendered error ids. It is omitted when there is neither label nor error.
- `aria-label` is passed to the textbox. Per the accessible name computation, **`aria-labelledby` wins over `aria-label`**. Therefore:
    - with `label`, `aria-label` has no effect on the name,
    - without `label`, `aria-label` is used only while no error is shown. When an error appears, the accessible name becomes the error text.
    - Prefer `label`. Use `aria-label` alone only for label-less layouts, and be aware of the error case.
- `required` sets `aria-required` on the textbox, and the `*` in the label has an `aria-description` from `localization.requiredField`.
- Error messages are rendered with `role='alert'`.
- The upload button is icon-only, its accessible name is `localization.selectFile`.

## Validation

`accept` does not validate anything, because the user can bypass the dialog filter. Validate type, size and count in the form. The component shows errors only after the field is touched.

```tsx
<form.AppField
    name='avatar'
    validators={{
        onChange: ({ value }) => {
            if (value === null) return 'File is required';
            if (!value.type.startsWith('image/')) return 'Only images are allowed';
            if (value.size > 5 * 1024 * 1024) return 'Max size is 5 MB';
            return undefined;
        }
    }}
>
    {(field) => (
        <field.FileInput
            id='avatar'
            label='Avatar'
            accept='image/*'
            required
        />
    )}
</form.AppField>
```

For `multiple`, validate `value.length === 0` for required, and check each file.

## Submitting

The value contains `File` objects, which are **not JSON-serializable**. Submit with `FormData` (see the example above) or read the files manually (e.g. `file.arrayBuffer()`). Never `JSON.stringify` the form values.

## Behavior

- **Selecting:** only the upload button opens the file dialog. Clicking the text area or the tags does not.
- **Selection replaces the previous one**, also in `multiple` mode. New files are **not appended** to the existing list. To support adding files, the consumer would need a different approach.
- **Same file again:** selecting the same file twice works, because the native input is reset after every selection and the files live in form state.
- **Cancelling the dialog:** the value does not change.
- **Tags:** each selected file is a `Tag` with the file name. Removable via its remove button, unless `readOnly`. Removing the last file in `multiple` mode leaves `[]`, in single mode `null`.
- **Blur:** blur of the textbox area or of the upload button calls `field.handleBlur()` (marks the field touched).
- **Errors:** form errors are shown only after the field is touched. The `error` prop, if set, replaces them.
- **Label click:** clicking the label or an error text focuses the textbox area, like a native input.
- **Initial value:** only `File` objects can be displayed. There is no way to show an already uploaded file (stored on the server) by name. Keep such files outside this component or render them separately.
- No drag and drop, no file preview, no size or count limits, no upload progress.

## Keyboard

| Key             | Context       | Action                                                                |
| --------------- | ------------- | --------------------------------------------------------------------- |
| `Tab`           | any           | Standard focus order: textbox area, tag remove buttons, upload button |
| `Enter`/`Space` | upload button | Opens the file dialog (native button behavior)                        |
| `Enter`/`Space` | tag remove    | Removes the file (native button behavior)                             |

The textbox area is focusable but has no key handling. Pressing keys on it does not open the dialog.

## Localization

Text of the upload button comes from `localization.selectFile` in `utils/constants`. It is the accessible name of the button, since the button shows only an icon. Do not hardcode this string. Override it via the library's localization mechanism.

## Common mistakes

- Using `''` or `undefined` as default value. Use `null` for single and `[]` for `multiple`.
- Forgetting `multiple` while the default value is an array (or the reverse). The value then changes shape on the first selection.
- Passing `value`/`onChange`/`ref`, or extra attributes like `title` or `placeholder`. They are not part of the props type.
- Omitting both `label` and `aria-label`. The control then has no accessible name (except error text when shown).
- Relying on `aria-label` together with `label` or visible errors. `aria-labelledby` takes precedence, so `aria-label` is not announced.
- Treating `accept` as validation. Validate `file.type` and `file.size` in the form.
- Expecting new files to be added to the existing selection in `multiple` mode. They replace it.
- Sending the form value as JSON. Use `FormData`.
- Using it outside a form field context. It throws or misbehaves.
- Expecting to display or edit files already stored on the server.
- Selecting several files with the same name in `multiple` mode, which produces duplicate tag keys (React warning).
- Targeting elements in Playwright by `#<id>` without the `file-input-` prefix, or by a single `-error` id. Prefer `data-testid`.
- Expecting `data-testid` errors to have no index. Error messages are always `<data-testid>_error_<idx>`, starting at `0`, even for a single error.
