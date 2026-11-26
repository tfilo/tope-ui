# Theme

To customize theme to project preferencies you can override any of these properties. In projects main css file add this after `@source '../node_modules/@tfilo/tope-ui/dist';` so whole css file looks like this:

```css
@import 'tailwindcss';
@import '@tfilo/tope-ui/theme.css';
@import '@tfilo/tope-ui/base.css';

@source '../node_modules/@tfilo/tope-ui/dist';

@theme static {
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
}
```

You can customize only some part of theme, don't need to add unmodified properties as these are already imported in `@import '@tfilo/tope-ui/theme.css';`. So you need to include only properties you really change. Example above includes all posible properties with it's default values.
