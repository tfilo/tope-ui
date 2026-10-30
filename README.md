# TOPE-UI

Personal React UI component library built with TypeScript, Vite, Tailwind CSS, and Storybook.

## Requirements

- React and React DOM `^19.3.0`.
- TanStack React Form `^1.33.0`.
- Node.js **24.x** is recommended for library development.

## Install in an application

The release workflow publishes `@tfilo/tope-ui` to GitHub Packages. To install a
published version, configure the registry in your application's `.npmrc`:

```ini
@tfilo:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${NODE_AUTH_TOKEN}
```

Set `NODE_AUTH_TOKEN` in your environment to a GitHub personal access token
(classic) with `read:packages` permission and access to the package. Then install
the library and its TanStack Form peer dependency in your React application:

```bash
npm install @tfilo/tope-ui @tanstack/react-form
```

Import components and hooks from `@tfilo/tope-ui`. Load the bundled stylesheet
once in your application's root entry point or root route:

```tsx
import '@tfilo/tope-ui/style.css';
```

## Set up library development

From a checkout of this repository, install the development dependencies:

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

Form components are connected to TanStack Form through the library's
`useAppForm` hook. Render fields through `form.AppField` and the registered
`field` components. They handle their own value, change, and blur bindings.
Form buttons need the `form.AppForm` context.

```tsx
import { useAppForm } from '@tfilo/tope-ui';

export function ExampleForm() {
    const form = useAppForm({
        defaultValues: { basic: '' },
        onSubmit: ({ value }) => {
            console.log(value);
        }
    });

    return (
        <form
            onSubmit={(event) => {
                event.preventDefault();
                void form.handleSubmit();
            }}
            noValidate
        >
            <form.AppField
                name="basic"
                children={(field) => <field.Input label="Basic example" />}
            />
            <form.AppForm>
                <form.SubscribeButton>Submit</form.SubscribeButton>
            </form.AppForm>
        </form>
    );
}
```

See [the complete form and layout example](lib/Example.stories.tsx) and the
component stories in `lib/` for more usage examples.

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

- **form-context** - shared TanStack Form field and form contexts
- **form** - `useAppForm`, `withForm`, and `withFieldGroup`, with registered field and form components
- **useWindowSize** - detects breakpoint changes when the user resizes the window

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

- **setLocalization** - updates the library's localized messages; defaults are in Slovak
- **setConfig** - updates configuration, including the table sorting locale and accepted date input formats

#### String utils

- **isEmpty**
- **isNotEmpty**
- **isBlank**
- **isNotBlank**
- **sb** - converts a boolean to the string `'true'` or `'false'`

## Styles

The library builds a bundled stylesheet. Import it once in your application:

```tsx
import '@tfilo/tope-ui/style.css';
```

Tailwind-based styles and theme tokens are defined in `lib/main.css` and
`lib/theme.css`.

## Localization

The library's default messages are in Slovak. Use `setLocalization` to override
selected messages:

```tsx
import { setLocalization } from '@tfilo/tope-ui';

setLocalization({
    loading: 'Loading...',
    retry: 'Try again'
});
```

`setLocalization` merges the provided values into the shared localization object.
Configure it consistently on the server and in the browser. These settings are
shared across the application; they are not scoped to a component or request.
