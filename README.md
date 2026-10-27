# TOPE-UI

**Important:** library is in development phase, NOT READY TO BE USED YET!

Personal React UI component library built with TypeScript, Vite, Tailwind CSS, and Storybook.

## Requirements

- Node.js **24.x** (recommended)

## Install

```bash
npm install
```

## Run (development)

Storybook is the primary way to develop and preview components:

```bash
npm run storybook
```

Then open:

- http://localhost:6006

## Build

Build library bundles to `dist/`:

```bash
npm run build
```

Build Storybook static site:

```bash
npm run build-storybook
```

## Lint & format

```bash
npm run lint
npm run lint:fix

npm run prettier
npm run prettier:fix
```

## Tests

Run Storybook-powered tests (via Vitest):

```bash
npm run test-storybook
```

## Components

### Common

- **Icon** - type definition used in Input, Button, Dropdown, Modal, Header
- **Option** - interface used in Autocomplete, Select and OptionGroup
- **OptionGroup** - interface used in Select

### Form

Form elements can be used only using Tanstack Form. See example bellow:

```html
<form.AppField
    name="basic"
    children="{(field)"
    =""
>
    (<field.Input label="Basic example" />)} />
    <form.AppForm>
        <form.SubscribeButton>Submit</form.SubscribeButton>
    </form.AppForm></form.AppField
>
```

- **Autocomplete**
- **DateTimeInput**
- **FileInput**
- **Input**
- **ResetButton**
- **Select**
- **SubscribeButton**
- **Switch**
- **TextArea**
- **ElementWrapper** - internal component

#### Numeric Input values

`<field.Input type="number" />` stores numbers in TanStack Form using the native
`valueAsNumber`. Clearing the input, or entering a value the browser cannot parse
as a number, stores `null`; it does not become `0` or `NaN`. Empty values
display as an empty input. Other input types store strings.

Allow the empty value in your form's type, for example:

```tsx
const form = useAppForm({
    defaultValues: { amount: null as number | null }
});
```

With Zod, use `z.number()` for a required value or `z.number().nullable()` when
empty is allowed. Schema coercion used as a TanStack Form validator does not
replace the stored form values with parsed output.

If you previously used string defaults with `type="number"`, migrate them to
`number | null` and remove code that expects numeric input values as strings.

#### DateTimeInput values

`DateTimeInput` stores local calendar strings in TanStack Form:

- `type="date"`: `YYYY-MM-DD`, for example `2026-01-31`.
- `type="dateTime"`: `YYYY-MM-DDTHH:mm:ss`, for example `2026-01-31T23:30:00`.
- Empty input stores `''`; invalid or incomplete typed input stores `'UNKNOWN'`.

Values have no timezone meaning: the same calendar fields display on the server
and in the browser, including times during daylight-saving transitions. Years
must be between 1900 and 2100. Invalid external values display as empty and do not
initialize the picker; the component does not rewrite the form value on mount.
Use Zod validation to reject invalid values before submission.

Timestamps with `Z` or an offset, fractional seconds, and datetime values without
seconds are unsupported. Migrate those defaults/API values to the formats above;
choose the intended calendar fields in the consuming application rather than
silently removing an offset. Date mode accepts only a date, not a datetime.
`inputFormat` controls display and typing, not storage, and must include the full
date (and time for datetime mode). Timezone and timestamp format tokens are not
supported. Internal UTC-backed arithmetic only preserves calendar fields; stored
strings are not UTC timestamps.

### General

- **Button**
- **Dropdown**
- **List**
- **Modal**
- **Table**
- **Tag**

### Hooks

- **form-context** - Tanstack form specific context
- **form** - Tanstack form specific context
- **useWindowSize** - Hook to detect breakpoint change in code when user resize window

### Layout

- **Card**
- **Column**
- **Content**
- **Flex**
- **Grid**
- **Header**
- **Page**
- **Section**

### Utils

#### Constants

- **setLocalization** - allows to set custom localizations for hardcoded values, default in Slovak language
- **setConfig** - allows to set custom configuration, currently just locale used in internal compare funcion for sorting table rows

#### String utils

- **isEmpty**
- **isNotEmpty**
- **isBlank**
- **isNotBlank**
- **sb** - convert boolean to string 'true' | 'false'

## Styles

The library builds a bundled stylesheet. Consumers can import:

- `tope-ui/style.css`
- Tailwind-based theme styles are defined in `lib/main.css` and `lib/theme.css`.

## Localization

Library provides default localization with hardcoded values. You can provide your own by calling setLocalization methods that will update original object holding locales.
