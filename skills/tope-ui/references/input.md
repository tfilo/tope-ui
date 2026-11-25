# Input

Single-line text input with optional label, error messages and action buttons or icons at its start and end. Supports text-like native types (`text`, `email`, `password`, `date`, ...) and `number`.

## When to use

- You need a single-line value bound to a form field: text, email, password, URL, date, number, etc.
- You need small inline actions next to the value (clear, copy, show/hide password, unit icon).

Do NOT use for choosing from a list of options (use Select or Autocomplete).

## Import

Component should be always imported using useAppForm and used using form.AppField see example below.

```tsx
import { useAppForm } from '@tfilo/tope-ui';
```

## Critical: must be used inside a TanStack Form field

`Input` reads its state via `useFieldContext()`. It has **no `value`, `onChange`, `onBlur` or `name` props**, and it does not work standalone.

- Render it inside a field of a form created with the library's `useAppForm`, registered as a field component.
- Value type is `string | number | null`. For `type='number'` the field stores `number | null`. For every other type it stores `string`.
- Empty text value is `''`. Empty (or unparsable) number value is `null`. A `null`/`undefined` field value is rendered as an empty input.
- Never pass `value`, `onChange`, `onBlur` or `name`. They are omitted from the props type.
- Field name comes from the field context and is set as the input's `name`.

```tsx
<form.AppField name='email'>
    {(field) => (
        <field.Input
            id='email'
            data-testid='email'
            type='email'
            label='Email'
            required
        />
    )}
</form.AppField>
```

Number field:

```tsx
<form.AppField name='age'>
    {(field) => (
        <field.Input
            id='age'
            data-testid='age'
            type='number'
            label='Age'
            min={0}
        />
    )}
</form.AppField>
```

With actions:

```tsx
<form.AppField name='password'>
    {(field) => (
        <field.Input
            id='password'
            data-testid='password'
            type={visible ? 'text' : 'password'}
            label='Password'
            endAction={{
                icon: visible ? EyeOffIcon : EyeIcon,
                title: visible ? 'Hide password' : 'Show password',
                onClick: () => setVisible((v) => !v)
            }}
        />
    )}
</form.AppField>
```

## Props

| Prop                       | Type                           | Required | Default     | Description                                                                                                                                                                                                                                        |
| -------------------------- | ------------------------------ | -------- | ----------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `type`                     | native `<input>` `type`        | no       | `undefined` | Native input type. `'number'` makes the field store `number \| null`, all other types store `string`.                                                                                                                                              |
| `label`                    | `string`                       | no       | `undefined` | Renders as label of component (`<label htmlFor>` bound to the input). Not rendered when blank.                                                                                                                                                     |
| `error`                    | `string`                       | no       | `undefined` | External error. **Overrides** form validation errors when not `undefined` (even an empty string hides form errors). Shown regardless of touched state.                                                                                             |
| `startAction`              | `InputAction \| InputAction[]` | no       | `undefined` | Buttons or icons rendered before the input, see [Actions](#actions).                                                                                                                                                                               |
| `endAction`                | `InputAction \| InputAction[]` | no       | `undefined` | Buttons or icons rendered after the input, see [Actions](#actions).                                                                                                                                                                                |
| `disabled`                 | `boolean`                      | no       | `false`     | Disables the input and all action buttons and applies disabled styling to label, border and errors.                                                                                                                                                |
| `readOnly`                 | `boolean`                      | no       | `false`     | Native `readOnly` on the input. Does **not** disable action buttons and has no special styling.                                                                                                                                                    |
| `required`                 | `boolean`                      | no       | `undefined` | Adds `*` to the label and sets native `required` on the input. Validation is done by the form, but see [Common mistakes](#common-mistakes) for native validation.                                                                                  |
| `id`                       | `string`                       | no       | auto        | Id of the `<input>`, used as-is (auto-generated with `useId` as `input-${useId()}` when omitted). Pass it explicitly when you need stable selectors, see [IDs](#ids).                                                                              |
| `data-testid`              | `string`                       | no       | `undefined` | Playwright attribute. Set on the input and used as prefix for data-testid of label, errors and actions, see [data-testid](#playwright-testing---data-testid-attribute).                                                                                                           |
| `title`                    | `string`                       | no       | `undefined` | Spread onto the `<input>` as `title`. Provide it (or `aria-label`) when you don't provide `label` so the input remains accessible.                                                                                                                 |
| other `<input>` attributes | –                              | no       | `undefined` | Spread onto the `<input>` (e.g. `placeholder`, `autoComplete`, `min`, `max`, `step`, `maxLength`, `inputMode`). `name`, `id`, `value`, `onChange`, `onBlur` and `data-testid` are always controlled by the component and override anything passed. |

### Types

```ts
export interface InputAction {
    /** Icon component */
    icon: Icon;
    /** Accessible title. Also used as the button label / icon title */
    title: string;
    /** When set, the action renders as a button, otherwise as a plain icon */
    onClick?: () => void | Promise<void>;
    /** Disables the action button */
    disabled?: boolean;
}
```

> `InputActionProps` in the source also contains internal props `_idx`, `_position` and `data-testid`. They are set by `Input` itself. Do not pass them.

## Actions

`startAction` and `endAction` accept a single action or an array. Each side is rendered in its own bordered group next to the input.

- **With `onClick`:** rendered as a transparent icon `Button`. `title` is its accessible name.
- **Without `onClick`:** rendered as a non-interactive icon with `title` on the icon. Use it for decoration such as a unit or type indicator.
- `onClick` may be async. The button is disabled while the returned promise is pending, then enabled again.
- The button is disabled when `action.disabled` or the input's `disabled` is `true`. `readOnly` does not disable it.
- Errors thrown from `onClick` are not caught by the component (it only resets the pending state). Handle errors inside the callback.
- Keep `title` unique within one side, it is used as part of the React key.

## IDs

`id` is used as-is on the input. When omitted, `input-${useId()}` is used instead. Related ids are derived from it:

| Element                   | Id                   |
| ------------------------- | -------------------- |
| `<input>`                 | `${id}`              |
| Label                     | `${id}-label`        |
| Error messages (by index) | `${id}-error-${idx}` |

- Unlike Autocomplete, there is no prefix. `<input id='email'>` for `id='email'`.
- Label and error `<label>` elements use `htmlFor` pointing to the input id. Errors have `role='alert'`.
- Auto-generated ids are not stable between renders/environments. Use an explicit `id` or `data-testid` for tests and when referencing the element.
- Use unique `id` per field on a page.

## Playwright testing - data-testid attribute

When `data-testid='x'` is passed, it is set on the `<input>` itself and these attributes are derived for inner elements:

| Element                                                | data-testid             |
| ------------------------------------------------------ | ----------------------- |
| `<input>`                                              | `x`                     |
| Label                                                  | `x_label`               |
| Error messages (by index, form errors or `error` prop) | `x_error_${idx}`        |
| Start action (button or icon, by index)                | `x_start_action_${idx}` |
| End action (button or icon, by index)                  | `x_end_action_${idx}`   |

`${idx}` is 0-based and is the index within its own side (`startAction` / `endAction`). Without `data-testid`, none of these attributes are rendered. A `data-testid` set on an individual action object is ignored.

## Callback contracts

### `action.onClick()`

- Takes no arguments and may return `void` or a `Promise<void>`.
- While the returned promise is pending the action button is disabled, which prevents double submits.
- Not called when the action is disabled.
- Not available for actions without `onClick`, those render as plain icons.

## Behavior

- **Value:** every change calls `field.handleChange`. For `type='number'` the value is `valueAsNumber`, or `null` when empty or not parsable. For other types it is the raw string.
- **Blur:** leaving the input calls `field.handleBlur()` (marks the field touched).
- **Errors:** form errors are shown only after the field is touched, one message per line (strings or objects with `message`, e.g. Standard Schema issues). Blank messages are dropped. The `error` prop, if set, replaces them and is shown immediately. When any error is shown the whole control (border and messages) is rendered in `danger` color.
- **Disabled:** input, action buttons, label, border and error messages get disabled styling. Error messages are still rendered.
- **Focus:** the whole bordered control (input and actions) shows the focus outline when anything inside has focus.
- **Layout:** the wrapper is `flex-1`, so it fills the available width of its parent.
- **Form submit:** nothing is intercepted. `Enter` in the input follows the native form behavior.

## Keyboard

The component adds no custom key handling. The input behaves as a native `<input>`, and action buttons are reachable with `Tab` and activated with `Enter` / `Space`. Plain icon actions are not focusable.

## Localization

Texts come from `localization` in `utils/constants`: only `requiredField` (used as description of the required `*` in the label). Do not hardcode it. Override it via the library's localization mechanism. `title` of actions and `label` are supplied by the consumer and are not localized by the library.

## Common mistakes

- Passing `value`/`onChange`/`onBlur`/`name`. They are not accepted, so bind through the form field.
- Passing `id` or `data-testid` expecting different behavior from Autocomplete. For Input, `id` is used as-is without prefix.
- Using it outside a form field context. It throws or misbehaves.
- Mismatched field default and `type`. Use `null` (or a number) as default for `type='number'` and `''` (or a string) for other types.
- Expecting `type='number'` to give `''` for empty input. It gives `null`.
- Passing `className` or `style` to restyle the input. `className` replaces the component's own input classes (flex, padding, focus reset) because it is spread after them.
- Passing `error=''` to "clear" the error: it still overrides form validation errors. Pass `undefined` instead.
- Passing `required` and expecting only a visual marker. It is also applied as native `required` on the `<input>`, so a native form submit may be blocked by the browser. Use `noValidate` on the `<form>` when validation is handled by TanStack Form.
- Using `readOnly` to lock the whole control. Action buttons stay active, use `disabled` or `disabled` on the action instead.
- Throwing from `action.onClick` and expecting the component to handle it. Catch errors in the callback.
- Missing `label` and `title` / `aria-label`. The input then has no accessible name.
- Passing `_idx`, `_position` or per-action `data-testid`. They are internal and overridden.
- Targeting action icons by `title` in tests. Use `data-testid` (`x_start_action_0`).
