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

### Form

- **Autocomplete**
- **FileInput**
- **Input**
- **Select**
- **TextArea**
- **ElementWrapper**

### General

- **Button**
- **Dropdown**
- **List**

### Visual

- **Tag**

### Layout

- **Card**
- **Column**
- **Content**
- **Flex**
- **Grid**
- **Header**
- **Page**
- **Section**


## Styles

The library builds a bundled stylesheet. Consumers can import:

- `tope-ui/style.css`
- Tailwind-based theme styles are defined in `lib/main.css` and `lib/theme.css`.
