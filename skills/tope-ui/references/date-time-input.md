# DateTimeInput

Text input with a calendar popover for picking a local date or date-time. Users can type the value in a configurable format or pick it from the calendar (day, month and year views, plus time slots in `dateTime` mode).

## When to use

- You need a calendar date (`type='date'`) or a local date with time (`type='dateTime'`) bound to a form field.
- The value is a **local calendar value without timezone** (birth date, due date, appointment time in the user's local context).

Do NOT use for absolute timestamps (ISO with `Z` or offset, Unix timestamps), date ranges, or min/max constrained dates. None of these are supported.

## Import

Component should be always imported using useAppForm and used using form.AppField see example below.

```tsx
import { useAppForm } from '@tfilo/tope-ui';
```

Requires a modern browser (Popover API + CSS anchor positioning).

## Critical: must be used inside a TanStack Form field

`DateTimeInput` reads its state via `useFieldContext<string>()`. It has **no `value` or `onChange` props**, and it does not work standalone.

- Render it inside a field of a form created with the library's `useAppForm`, registered as a field component.
- The field value type is always `string`.
- Empty value is `''`. Always use `''` as the default value, never `undefined` or `null`.
- Never pass `value`, `onChange`, `ref`, `type='text'` or other native `type` values. `type` here means `'date' | 'dateTime'`.
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

<form.AppField name='appointment'>
    {(field) => (
        <field.DateTimeInput
            label='Appointment'
            type='dateTime'
            slots={30}
        />
    )}
</form.AppField>
```

## Field value format

The form value is a **local calendar string without timezone**. It is independent of how the text is displayed in the input (`inputFormat`).

| State                        | `type='date'` | `type='dateTime'`     |
| ---------------------------- | ------------- | --------------------- |
| Valid value                  | `2026-03-26`  | `2026-03-26T09:30:12` |
| Empty                        | `''`          | `''`                  |
| Invalid or incomplete typing | `'UNKNOWN'`   | `'UNKNOWN'`           |

- Years must be within **1900–2100**. Anything outside is `'UNKNOWN'`.
- Offsets, `Z` and Unix timestamps are not supported and are never converted.
- Seconds are always present in `dateTime` values (`:00` when the input format has no seconds).
- An initial/external value that does not exactly match `YYYY-MM-DD` (or `YYYY-MM-DDTHH:mm:ss` in `dateTime`) is not parsed: the input stays empty and the picker has no selection.

### Critical: `'UNKNOWN'` is a sentinel, not a valid date

While the user types an incomplete or invalid date, the field value is the string `'UNKNOWN'`. The component does **not** add a validation error itself, so the form must reject it:

```tsx
<form.AppField
    name='birthDate'
    validators={{
        onChange: ({ value }) => (value === 'UNKNOWN' ? 'Invalid date' : undefined)
    }}
>
    {(field) => <field.DateTimeInput label='Birth date' />}
</form.AppField>
```

Do the same in schema validation (reject `'UNKNOWN'`, and for required fields also reject `''`). Never submit `'UNKNOWN'` to an API.

## Props

| Prop                            | Type                   | Required | Default                                       | Description                                                                                                                                                                                                        |
| ------------------------------- | ---------------------- | -------- | --------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `label`                         | `string`               | no       | `undefined`                                   | Renders as label of component (`<label htmlFor>` bound to the input).                                                                                                                                              |
| `error`                         | `string`               | no       | `undefined`                                   | External error. **Overrides** form validation errors when not `undefined` (even an empty string hides form errors). Shown regardless of touched state.                                                             |
| `type`                          | `'date' \| 'dateTime'` | no       | `'date'`                                      | `'dateTime'` enables time selection (time slots in the picker and time in the text input).                                                                                                                         |
| `lastDayInWeek`                 | `WeekDayType`          | no       | `WeekDay.Sunday`                              | Day treated as the **last** day of the week. The week starts on the next day (Sunday → week starts on Monday).                                                                                                     |
| `slots`                         | `number`               | no       | `15`                                          | Interval in minutes between time slots (`dateTime` only). Integer 0–1440. `0` generates no slots (time can only be typed). Other values throw `RangeError` during render, **even when `type='date'`**.             |
| `inputFormat`                   | `string[]`             | no       | `config.dateFormat` / `config.dateTimeFormat` | date-fns patterns for the text input. See "Input format" below.                                                                                                                                                    |
| `placeholder`                   | `string`               | no       | localized default                             | Placeholder of the text input. Defaults depend on `type`.                                                                                                                                                          |
| `inputIconTitle`                | `string`               | no       | localized open/close                          | Accessible text of the calendar button. Defaults to localized "open calendar" / "close calendar".                                                                                                                  |
| `closeDateTimePickerIfSelected` | `boolean`              | no       | `true`                                        | Close the popover after a day or time is selected. Month and year navigation never closes it.                                                                                                                      |
| `disabled`                      | `boolean`              | no       | `undefined`                                   | Disables the input and the calendar button, and applies disabled styling to the label and wrapper.                                                                                                                 |
| `readOnly`                      | `boolean`              | no       | `undefined`                                   | Input is not editable and the calendar button does not open the popover.                                                                                                                                           |
| `required`                      | `boolean`              | no       | `undefined`                                   | Adds `*` to the label and sets `aria-required` on input. Visual only, validation is up to the form.                                                                                                                |
| `id`                            | `string`               | no       | auto                                          | Base id (auto-generated with `useId` when omitted). Never used as-is, see [IDs](#ids). Pass it explicitly when you need stable selectors.                                                                          |
| `data-testid`                   | `string`               | no       | `undefined`                                   | Playwright attribute. Set on the input and used as prefix for data-testid of all inner elements, see [data-testid](#playwright-testing---data-testid-attribute).                                                   |
| other `<input>` attributes      | –                      | no       | `undefined`                                   | Spread onto the `<input>` (e.g. `autoComplete`, `aria-label`, `title`). `type`, `id`, `name`, `value`, `placeholder`, `onChange` and `onBlur` are always controlled by the component and override anything passed. |

### Types

```ts
const WeekDay = {
    Sunday: 0,
    Monday: 1,
    Tuesday: 2,
    Wednesday: 3,
    Thursday: 4,
    Friday: 5,
    Saturday: 6
} as const;

type WeekDayType = (typeof WeekDay)[keyof typeof WeekDay]; // numeric 0-6, 0 = Sunday
```

## IDs

`id` is a base id. The component derives every id from it (when `id` is omitted, `useId()` is used instead):

| Element                   | Id / name                       |
| ------------------------- | ------------------------------- |
| `<input>`                 | `date-input-${id}`              |
| Label                     | `date-input-${id}-label`        |
| Error messages (by index) | `date-input-${id}-error-${idx}` |
| CSS anchor name (popover) | `--calendar_${id}`              |

- `<input id='date-input-birthDate'>` for `id='birthDate'`. Do not look the input up by the raw `id`.
- Label and error `<label>` elements use `htmlFor` pointing to the input id.
- Auto-generated ids are not stable between renders/environments. Use an explicit `id` or `data-testid` for tests.
- Use unique `id` per field on a page, the anchor name for the calendar position is derived from it.

## Playwright testing - data-testid attribute

When `data-testid='x'` is passed, it is set on the `<input>` itself and these attributes are derived for inner elements:

| Element                                                                | data-testid                                        |
| ---------------------------------------------------------------------- | -------------------------------------------------- |
| `<input>`                                                              | `x`                                                |
| Label                                                                  | `x_label`                                          |
| Error messages (by index, form errors or `error` prop)                 | `x_error_${idx}`                                   |
| Calendar toggle button                                                 | `x_btn`                                            |
| Calendar popover (always in the DOM, content rendered only while open) | `x_calendar`                                       |
| Previous month / year button                                           | `x_calendar_prev_btn`                              |
| Middle button (month + year label, cycles day → month → year views)    | `x_calendar_middle_btn`                            |
| Next month / year button                                               | `x_calendar_next_btn`                              |
| Day view table                                                         | `x_calendar_day_table`                             |
| Day view header cell                                                   | `x_calendar_day_table_header_${xx}`                |
| Day view button                                                        | `x_calendar_day_table_body_${date}_${weekday}_btn` |
| Time list `<ul>` (`dateTime` only)                                     | `x_calendar_time_list`                             |
| Time list button                                                       | `x_calendar_time_list_item_${minute}_btn`          |
| Month view list `<ul>`                                                 | `x_calendar_month_list`                            |
| Month view button                                                      | `x_calendar_month_list_item_${month}_btn`          |
| Year view list `<ul>`                                                  | `x_calendar_year_list`                             |
| Year view button                                                       | `x_calendar_year_list_item_${year}_btn`            |

Notes on the dynamic parts:

- `${idx}` is 0-based index of the error message.
- `${xx}` in the header is the **first two characters** of the localized day name (`localization.dateTimeInput.days`), in the order given by `lastDayInWeek`.
- `${date}` is the day of the month and `${weekday}` is the weekday index (0 = Sunday … 6 = Saturday). Days from adjacent months (disabled cells) have `${weekday}` equal to `null`, e.g. `x_calendar_day_table_body_30_null`. Example: 26 March 2026 (Thursday) is `x_calendar_day_table_body_26_4_btn`.
- `${minute}` is minutes since midnight, e.g. `09:30` is `570`.
- `${month}` is 0-based (0 = January, 11 = December).
- The popover element has `x_calendar` (and the class `tope-ui-calendar`). It is always in the DOM, but its content is rendered only while the calendar is open.
- Without `data-testid`, none of these attributes are rendered.

## Input format

`inputFormat` controls only how the user types and sees the date. It does not change the form value.

- Must be an **array** with at least one date-fns pattern, e.g. `['dd.MM.yyyy HH:mm:ss', 'd.M.yyyy H:mm:ss']`.
- The **first** pattern is the canonical one: used for display after picking from the calendar and after blur.
- Other patterns are only tried for parsing typed input, in order. The first one that produces a valid date wins.
- Each pattern must contain a full date (and time in `dateTime` mode).
- Timezone and timestamp tokens (`x`, `X`, `O`, `z`, `t`, `T` outside quotes) throw an `Error` during render. Quote literal text, e.g. `"yyyy-MM-dd'T'HH:mm:ss"`.
- Defaults come from `config.dateFormat` and `config.dateTimeFormat` (`['dd.MM.yyyy', 'd.M.yyyy']` and `['dd.MM.yyyy HH:mm:ss', 'd.M.yyyy H:mm:ss']`). Placeholder defaults match them.
- Parsing is attempted only when the typed text is at least as long as one of the patterns (quotes excluded). Shorter text keeps the value as `'UNKNOWN'`.

## Behavior

- **Opening:** click the calendar button (it toggles, click again closes). Typing does not open the popover.
- **Typing:** every change re-parses the text. Valid text updates the field value and the picker state. Empty text sets `''`. Invalid or incomplete text sets `'UNKNOWN'`.
- **Picking a day:** sets the date and closes the popover (unless `closeDateTimePickerIfSelected={false}`). In `dateTime` mode with no time selected yet, the current local time of day (including seconds) is used.
- **Picking a time:** sets the time with seconds `0` and closes the popover (unless `closeDateTimePickerIfSelected={false}`). If no date is selected yet, today's date is used.
- **Navigation:** previous/next buttons move by month in the day view and by year in the month/year views. Choosing a month returns to the day view, choosing a year goes to the month view. Navigation is limited to years 1900–2100. It never closes the popover.
- **Navigation changes the value:** if a day is already selected, changing month or year immediately updates the text and the field value. A day that does not exist in the new month is clamped (31 March → 28 February).
- **Time list:** the selected slot (or the slot nearest to the current time when nothing is selected) is scrolled into view when the calendar opens.
- **Closing:** `mousedown` outside the popover and the calendar button (clicking the text input also counts as outside), or `Escape` (document-level listener, active only while open). Closing resets the picker to the day view.
- **Blur:** leaving the input normalizes the text to the first pattern of `inputFormat` (if the value is valid) and calls `field.handleBlur()` (marks the field touched). Invalid text is left as typed.
- **Errors:** form errors are shown only after the field is touched, one message per line (strings or objects with `message`, e.g. Standard Schema issues). The `error` prop, if set, replaces them and is shown immediately.
- **External value changes** (`form.reset`, `setFieldValue`): the input and picker sync immediately, except while the user is typing. An external clear (`''`) always applies.
- **Weeks:** the calendar always shows full weeks, with days of adjacent months disabled. Today is outlined and the selected day is highlighted.
- Popover uses the Popover API (`popover='manual'`) and CSS anchor positioning. Requires a modern browser.

## Keyboard

| Key      | Context                    | Action                                                   |
| -------- | -------------------------- | -------------------------------------------------------- |
| typing   | input                      | Edits the date text and updates the value                |
| `Tab`    | input / calendar           | Standard focus order. Calendar items are regular buttons |
| `Enter`  | calendar button / item     | Activates the focused button (native button behavior)    |
| `Escape` | anywhere while picker open | Closes the popover                                       |

There is no arrow-key navigation inside the calendar grid.

## Localization

Texts come from `localization.dateTimeInput` in `utils/constants`: `months`, `days`, `defaultDateInputPlaceholder`, `defaultDateTimeInputPlaceholder`, `openCalendar`, `closeCalendar`, `previousMonth`, `nextMonth`, `previousYear`, `nextYear`. The label wrapper also uses `localization.requiredField` for the required `*`. Default formats come from `config.dateFormat` and `config.dateTimeFormat`. Do not hardcode these strings. Override them via the library's localization mechanism.

`localization.dateTimeInput.days` is indexed from Sunday (0) and is reordered according to `lastDayInWeek`. Header cells show the first two characters and have the full name as `aria-label`. Month buttons show the first three characters of the month name.

## Common mistakes

- Passing `value`/`onChange`/`ref`, or a native `type` such as `'text'` or `'date'` (use `'date' | 'dateTime'`).
- Passing `onBlur`/`id`/`name`/`placeholder` expecting them to be applied as-is. The component controls them (use the `placeholder` and `id` props of the component, which are handled separately).
- Using it outside a form field context. It throws or misbehaves.
- Using `undefined` or `null` as default value. Use `''`.
- Not rejecting `'UNKNOWN'` in validation, which lets invalid dates reach the API.
- Expecting a `Date`, timestamp or ISO string with timezone. The value is a local string. Do not parse date-only values with `new Date('2026-03-26')` (it is interpreted as UTC). Parse with date-fns `parse(value, "yyyy-MM-dd", new Date())` or send the string as is.
- Putting `T`, `Z`, `X`, `x`, `O` or `z` into `inputFormat` without quoting, which throws during render.
- Passing a string instead of an array to `inputFormat`, or an empty array.
- Passing `slots` that is not an integer between 0 and 1440, which throws `RangeError` (also with `type='date'`).
- Expecting `minDate`/`maxDate`, range selection or years outside 1900–2100. They are not supported.
- Setting `lastDayInWeek` to the first day of the week. It is the **last** day, so Sunday gives a Monday-first calendar.
- Passing `error=''` to "clear" the error: it still overrides form validation errors. Pass `undefined` instead.
- Targeting the input by the raw `id` in tests. The real id is `date-input-${id}`.
- Omitting `label` without providing `aria-label` on the input, which leaves the input without an accessible name.
