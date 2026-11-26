# DateTimeInput

## When to use

Use `DateTimeInput` when the user enters a **local calendar date** or **date with time**, either by typing into the text input or by picking from a calendar popover (with a time slot list in `dateTime` mode).

- `type='date'` (default) stores `YYYY-MM-DD`.
- `type='dateTime'` stores `YYYY-MM-DDTHH:mm:ss`.
- Values are plain local strings, **not** `Date` objects and **without timezone**. Offsets and `Z` timestamps are not supported. Years must be between 1900 and 2100.

Do **not** use it for time-only input, date ranges, or absolute timestamps with timezone.

The calendar is a popover that relies on the Popover API and CSS anchor positioning, so a modern browser is required.

## Import

Component should be always imported using useAppForm and used using form.AppField see example below.

```tsx
import { useAppForm } from '@tfilo/tope-ui';
```

Important: must be used inside a TanStack Form field.

`DateTimeInput` reads its state via `useFieldContext()`. It has **no `value` or `onChange` props**, and it does not work standalone.

- Render it inside a field of a form created with the library's `useAppForm`, registered as a field component.
- Value type is always `string`.
- Empty value is `''`. Text that is not (yet) a valid date is stored as `'UNKNOWN'`.
- Never pass `value` or `onChange`. They are omitted from the props type. The `type` prop only switches between `'date'` and `'dateTime'`, the inner input is always `type='text'`.
- Field name comes from the field context and is set as the input's `name`.

```tsx
<form.AppField name='birthDate'>
    {(field) => (
        <field.DateTimeInput
            id='birthDate'
            data-testid='birthDate'
            label='Birth date'
            required
        />
    )}
</form.AppField>
```

With time. In `dateTime` mode, picking a day closes the picker by default, so set `closeDateTimePickerIfSelected={false}` to let the user pick day and then time:

```tsx
<form.AppField name='startsAt'>
    {(field) => (
        <field.DateTimeInput
            label='Starts at'
            type='dateTime'
            slots={30}
            closeDateTimePickerIfSelected={false}
        />
    )}
</form.AppField>
```

**The component does not report `'UNKNOWN'` as an error.** Always add a validator that rejects it (and an empty value if the field is required). `required` is visual only.

```tsx
<form.AppField
    name='birthDate'
    validators={{
        onChange: ({ value }) => {
            if (value === '') return 'Date is required';
            if (value === 'UNKNOWN') return 'Invalid date';
            return undefined;
        }
    }}
>
    {(field) => (
        <field.DateTimeInput
            label='Birth date'
            required
        />
    )}
</form.AppField>
```

## Props

| Prop                            | Type                                    | Required | Default                                                                      | Description                                                                                                                                                                                                                            |
| ------------------------------- | --------------------------------------- | -------- | ---------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `label`                         | `string`                                | No       | -                                                                            | Label rendered above the input and linked to it via `htmlFor`.                                                                                                                                                                         |
| `required`                      | `boolean`                               | No       | `false`                                                                      | **Visual only**: shows a red asterisk and sets `aria-required`. It does not validate.                                                                                                                                                  |
| `error`                         | `string`                                | No       | -                                                                            | Externally provided error message. When set (not `undefined`), it **replaces** the field validation errors. Leave it `undefined` to show validator errors.                                                                             |
| `type`                          | `'date' \| 'dateTime'`                  | No       | `'date'`                                                                     | Enables time selection and time in the stored value when `'dateTime'`.                                                                                                                                                                 |
| `inputFormat`                   | `string[]`                              | No       | `['dd.MM.yyyy', 'd.M.yyyy']` / `['dd.MM.yyyy HH:mm:ss', 'd.M.yyyy H:mm:ss']` | date-fns patterns for the text input. At least one is required. First is used for display, the others are also tried when parsing typed text. Defaults come from library `config` (`setConfig`), see notes below.                      |
| `placeholder`                   | `string`                                | No       | `DD.MM.YYYY` / `DD.MM.YYYY HH:mm:ss`                                         | Placeholder text. Defaults come from localization (`dateTimeInput.defaultDateInputPlaceholder`, `dateTimeInput.defaultDateTimeInputPlaceholder`). Set it together with a custom `inputFormat`, the default placeholder will not match. |
| `slots`                         | `number`                                | No       | `15`                                                                         | Minutes between time slots in the `dateTime` picker. Integer from 0 to 1440, `0` renders no slots. Other values throw a `RangeError`.                                                                                                  |
| `lastDayInWeek`                 | `WeekDayType`                           | No       | `WeekDay.Sunday`                                                             | Last day of the week in the calendar, so the default week starts on Monday. Use `WeekDay.Saturday` for weeks starting on Sunday.                                                                                                       |
| `closeDateTimePickerIfSelected` | `boolean`                               | No       | `true`                                                                       | Close the calendar after a day or time is picked.                                                                                                                                                                                      |
| `inputIconTitle`                | `string`                                | No       | localized open/close calendar text                                           | Title (accessible name) of the calendar button. Default texts are `dateTimeInput.openCalendar` and `dateTimeInput.closeCalendar` from localization.                                                                                    |
| `disabled`                      | `boolean`                               | No       | `false`                                                                      | Disables the input and the calendar button.                                                                                                                                                                                            |
| `readOnly`                      | `boolean`                               | No       | `false`                                                                      | Input is read-only and the calendar cannot be opened.                                                                                                                                                                                  |
| `id`                            | `string`                                | No       | generated by `useId()`                                                       | Base id. The real DOM id of the input is `date-input-{id}` (the label points to it).                                                                                                                                                   |
| `data-testid`                   | `string`                                | No       | -                                                                            | Base test id, all inner elements derive their test id from it. See [Testing](#testing).                                                                                                                                                |
| other props                     | `InputHTMLAttributes<HTMLInputElement>` | No       | -                                                                            | Spread to the inner `<input>`, e.g. `autoComplete`, `aria-*`, `title`.                                                                                                                                                                 |

Props that are always overridden internally even if passed: `name` (taken from the field), `type`, `value`, `onChange`, `onBlur`, `id` (prefixed). Do not pass `className`, it would replace the library's input styling.

### Behavior notes

- `inputFormat` patterns must contain a full date (and time in `dateTime` mode) and must **not** contain timezone or timestamp tokens (`x`, `X`, `O`, `z`, `t`, `T` outside quotes), otherwise the component throws at render. Passing `inputFormat` **replaces** the defaults completely, e.g. `['dd.MM.yyyy HH:mm:ss', 'd.M.yyyy H:mm:ss']`.
- With the default formats, typed text like `15.06.2026` and the short form `5.6.2026` are both accepted (and `15.06.2026 09:30:00` or `5.6.2026 9:30:00` in `dateTime` mode). The first pattern that parses wins.
- The field value is updated on every keystroke. Until the typed text matches a complete valid date, the value is `'UNKNOWN'`. Clearing the input sets `''`.
- On blur, a valid typed date is reformatted to the first `inputFormat` pattern.
- When the field value changes from outside (`form.reset()`, `setFieldValue`, loaded defaults), the text input and calendar follow it. Set values only in the stored formats (`YYYY-MM-DD` or `YYYY-MM-DDTHH:mm:ss`), anything else is displayed as empty.
- Picking a day without a selected time uses the current time of day. Picking a time slot sets seconds to `0`. Picking a day or time without a selected date uses the current month.
- The calendar closes on `Escape`, on click outside, or after selection (see `closeDateTimePickerIfSelected`).
- Validation errors are displayed only after the field is touched (input blurred) or after a form submit attempt.
- Texts (month and day names, button titles, placeholders) come from `localization.dateTimeInput`, Slovak by default. Day names start with Sunday at index 0. Default input formats come from `config.dateFormat` and `config.dateTimeFormat`. Change them globally once at app start with `setLocalization` / `setConfig` (from `@tfilo/tope-ui`). Both merge only top level keys, so to change anything in `dateTimeInput`, pass the complete `dateTimeInput` object.

## Types

```ts
export const WeekDay = {
    Sunday: 0,
    Monday: 1,
    Tuesday: 2,
    Wednesday: 3,
    Thursday: 4,
    Friday: 5,
    Saturday: 6
} as const;

export type WeekDayType = (typeof WeekDay)[keyof typeof WeekDay];

interface BaseProps {
    label?: string;
    error?: string;
    type?: 'date' | 'dateTime';
    lastDayInWeek?: WeekDayType;
    slots?: number;
    inputFormat?: string[];
    placeholder?: string;
    inputIconTitle?: string;
    closeDateTimePickerIfSelected?: boolean;
    'data-testid'?: string;
}

export interface DateTimeInputProps
    extends Omit<InputHTMLAttributes<HTMLInputElement>, keyof BaseProps | 'type' | 'value' | 'onChange' | 'placeholder'>, BaseProps {}
```

## Testing

All test ids are derived from the `data-testid` prop. In the table `{testid}` is the value passed to `data-testid`; without the prop no test ids are rendered.

| Element                                                                         | data-testid                                          |
| ------------------------------------------------------------------------------- | ---------------------------------------------------- |
| Input element                                                                   | `{testid}`                                           |
| Label                                                                           | `{testid}_label`                                     |
| Validation / `error` message (`idx` is zero-based)                              | `{testid}_error_{idx}`                               |
| Open/close calendar button                                                      | `{testid}_btn`                                       |
| Calendar popover (always in the DOM, content only while open)                   | `{testid}_calendar`                                  |
| Previous button (previous month in day view, previous year in month/year view)  | `{testid}_calendar_prev_btn`                         |
| Middle button, shows month and year; cycles day, month and year view            | `{testid}_calendar_middle_btn`                       |
| Next button (next month in day view, next year in month/year view)              | `{testid}_calendar_next_btn`                         |
| Day table                                                                       | `{testid}_calendar_day_table`                        |
| Day table header cell (`dd` is first two characters of the localized day name)  | `{testid}_calendar_day_table_header_{dd}`            |
| Day button (`date` is 1-31, `weekday` is 0 = Sunday to 6 = Saturday)            | `{testid}_calendar_day_table_body_{date}_{weekday}_btn` |
| Day button of previous/next month filler (disabled)                             | `{testid}_calendar_day_table_body_{date}_null_btn`   |
| Month list                                                                      | `{testid}_calendar_month_list`                       |
| Month button (`month` is 0 = January to 11 = December)                          | `{testid}_calendar_month_list_item_{month}_btn`      |
| Year list                                                                       | `{testid}_calendar_year_list`                        |
| Year button (`year` is 1900-2100)                                               | `{testid}_calendar_year_list_item_{year}_btn`        |
| Time list (`dateTime` only)                                                     | `{testid}_calendar_time_list`                        |
| Time slot button (`minutes` since midnight, e.g. `570` is 09:30)                | `{testid}_calendar_time_list_item_{minutes}_btn`     |

Typing the value into the input is the most stable way to set a date in tests. Use the default format unless `inputFormat` is customized.

Cypress example, typing a date and time:

```ts
cy.get('[data-testid="startsAt"]').type('15.06.2026 09:30:00');
cy.get('[data-testid="startsAt"]').blur();
cy.get('[data-testid="startsAt"]').should('have.value', '15.06.2026 09:30:00');
```

Playwright example, picking a time slot from the calendar:

```ts
await page.getByTestId('startsAt_btn').click();
await page.getByTestId('startsAt_calendar_time_list_item_570_btn').click();
await expect(page.getByTestId('startsAt')).toHaveValue(/ 09:30:00$/);
```