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
npm i --save @tfilo/tope-ui @tanstack/react-form
```

Import components and hooks from `@tfilo/tope-ui`. Load the bundled stylesheet
once in your application's main css file like this:

```css
@import 'tailwindcss';
@import '@tfilo/tope-ui/theme.css';
@import '@tfilo/tope-ui/base.css';

@source '../node_modules/@tfilo/tope-ui/dist';

@theme static {
    /* Optionally customize theme to your liking ussing some or all variables mentioned bellow */
    /*
    --color-primary: #0852ba;
    --color-primary-dark: #083c82;
    --color-primary-light: #3686f7;
    --color-primary-extra-light: #8ebbfa;

    --color-secondary: #57585c;
    --color-secondary-dark: #444446;
    --color-secondary-light: #b1b6bd;
    --color-secondary-extra-light: #ebebed;

    --color-success: #006600;
    --color-success-dark: #004700;
    --color-success-light: #b3e1b1;

    --color-warning: oklch(85.2% 0.199 91.936);
    --color-warning-dark: oklch(85.2% 0.199 91.936);
    --color-warning-light: oklch(85.2% 0.199 91.936);

    --color-danger: #a72416;
    --color-danger-dark: #7c1a0e;
    --color-danger-light: #ed9891;

    --color-transparent: transparent;
    --color-black: #000;
    --color-white: #fff;

    --font-weight-regular: 400;
    --font-weight-medium: 500;
    --font-weight-bold: 700;

    --text-color-default: #222;
    --text-color-disabled: #999;
    --fill-disabled: #999;

    --border-color-default: #d1d5db;
    --border-color-dark: #9ca3af;
    --border-color-light: #e5e7eb;

    --text-headline-1: 2.25rem;
    --text-headline-1--line-height: 2.5rem;
    --text-headline-1--font-weight: var(--font-weight-bold);

    --text-headline-2: 2rem;
    --text-headline-2--line-height: 2.25rem;
    --text-headline-2--font-weight: var(--font-weight-bold);

    --text-headline-3: 1.75rem;
    --text-headline-3--line-height: 2rem;
    --text-headline-3--font-weight: var(--font-weight-bold);

    --text-headline-4: 1.5rem;
    --text-headline-4--line-height: 1.75rem;
    --text-headline-4--font-weight: var(--font-weight-bold);

    --text-headline-5: 1.25rem;
    --text-headline-5--line-height: 1.5rem;
    --text-headline-5--font-weight: var(--font-weight-bold);

    --text-sm: 0.75rem;
    --text-sm--line-height: 0.875rem; 

    --text-base: 1rem; 
    --text-base--line-height: 1.25rem;

    --text-lg: 1.25rem;
    --text-lg--line-height: 1.5rem;

    --radius-none: 0rem;
    --radius-xs: 0.125rem;
    --radius-sm: 0.25rem;
    --radius-md: 0.5rem;
    --radius-lg: 0.75rem;
    --radius-xl: 1rem; 
    --radius-full: calc(infinity * 1px);

    --spacing-none: 0rem;
    --spacing-xs: 0.125rem;
    --spacing-sm: 0.25rem;
    --spacing-md: 0.5rem;
    --spacing-lg: 0.75rem;
    --spacing-xl: 1rem; 
    --spacing-2xl: 1.25rem;
    --spacing-3xl: 1.5rem;

    --breakpoint-mobile: 32rem;
    --breakpoint-tablet: 48rem;
    --breakpoint-desktop: 80rem;
    */
}
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
                name='basic'
                children={(field) => <field.Input label='Basic example' />}
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
- **Card**
- **Dropdown**
- **List**
- **LoadingOverlay**
- **Modal**
- **Table**
- **Tag**

#### Table row navigation and mobile layout

For a dots-only actions menu, use `<Dropdown showChevron={false}>⋮</Dropdown>`
with the usual `options` and an accessible trigger label in `buttonProps`.
Other dropdowns continue to show their chevron by default.

`Table` accepts two optional callbacks:

- `onRowClick(row)` opens the row's detail using your application's router. Clickable rows support Enter and Space and have a subtle hover/focus highlight. Buttons, links, form controls, and dropdown actions inside the row keep their own behavior without opening the detail. Selecting text does not open the row.
- `renderMobileRow(row)` renders a compact list item below the tablet breakpoint (768px). The normal columns remain visible on larger screens. Without this callback, tables retain their existing layout on every screen.

Both layouts use the same fetched/sorted rows, loading state, error handling, and pagination. CSS switches their visibility without a window-size hook, including during SSR. Renderers should return presentational content; both layouts are mounted, so avoid side effects or duplicate fixed HTML IDs in cell/row renderers. Mobile rows replace column headings; include meaningful labels and units in their content. Desktop sorting stays in the table headings; apps needing mobile sorting can provide a separate control.

```tsx
<Table
    columns={columns}
    onFetch={fetchRecords}
    onRowClick={(row) => openDetail(row.id)}
    renderMobileRow={(row) => (
        <div>
            <strong>{row.title}</strong>
            <p>
                {row.date} · {row.total}
            </p>
        </div>
    )}
/>
```

See **General → Table → Responsive rows** in Storybook for a fuel-record example with independent row actions.

### Hooks

- **form-context** - shared TanStack Form field and form contexts
- **form** - `useAppForm`, `withForm`, and `withFieldGroup`, with registered field and form components

### Layout

- **Column**
- **Content**
- **Flex**
- **Grid**
- **Header**
- **Page**
- **Section**

Header uses CSS media queries to show icon-only navigation below the tablet
breakpoint (768px by default), including during server rendering. Button labels
remain available to assistive technology and through native tooltips. Buttons
and dropdowns outside Header keep their usual label visibility.

Header menu items accept `active?: boolean`. Active buttons use the primary
variant, and a dropdown trigger is primary when it or any of its options is
active. Active dropdown options are highlighted as well. The application decides
which items are active from its current route; Header does not depend on a router.

Navigation items share a rounded `secondary-extra-light` background. Inactive
items use transparent buttons, while Profile and Logout sit outside the group.
These styles are scoped to Header and do not change standalone buttons or dropdowns.

#### Page loading overlay

`LoadingOverlay` shows a centered spinner over the previous page with a
translucent, blurred backdrop after 200ms. It renders nothing when `active` is
false. Text defaults to the existing Slovak `localization.loading`; pass `label`
for a translated message from your application.

Keep Header outside a relatively positioned container and keep the previous
page mounted inside it. The application supplies navigation state and makes the
covered content `inert` to block clicks and keyboard focus while loading:

```tsx
import { Content, Header, LoadingOverlay } from '@tfilo/tope-ui';

<>
    <Header />
    <main className='relative flex flex-1 flex-col'>
        <div
            inert={isNavigating}
            aria-busy={isNavigating}
        >
            <Content>{children}</Content>
        </div>
        <LoadingOverlay active={isNavigating} />
    </main>
</>;
```

The component uses CSS for the reveal delay and supports server rendering without
browser APIs. Spinner animation respects reduced-motion preferences. Router state,
data loading, and content interaction remain under the application's control.

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

The library builds a bundled stylesheet. Import it once in your application main css file:

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

### Starting a paginated table on another page

For tables using `onFetch`, pass `initialPage` as a zero-based starting index (default `0`). For example, `<Table columns={columns} onFetch={onFetch} pageSize={25} initialPage={1} />` starts on the second page. It initializes state on mount; changing the prop later does not control pagination. Existing reset behavior when the fetch callback changes is preserved.
