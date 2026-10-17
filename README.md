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
