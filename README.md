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

Form elements integrate with TanStack Form through `useAppForm`:

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
            noValidate
            onSubmit={(event) => {
                event.preventDefault();
                void form.handleSubmit();
            }}
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

```tsx
import '@tfilo/tope-ui/style.css';
```

- Tailwind-based theme styles are defined in `lib/main.css` and `lib/theme.css`.

## Localization

Defaults are Slovak. Call `setLocalization` after importing the library and before rendering components to configure localized text. The calendar month chooser reads the current month labels during rendering, with the 12 labels ordered from January to December.

`setLocalization` updates the shared configuration without scheduling React renders. If you change localization after mounting, the calendar reflects the updated month labels on its next render. Supplied top-level localization properties are replaced, so provide the complete nested configuration when updating `dateTimeInput`.
