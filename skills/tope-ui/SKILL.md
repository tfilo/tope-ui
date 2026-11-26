---
name: tope-ui
description: React user interface library. This skills provides information how to use tope-ui react library. Use this skill when building user interface.
---

# TOPE-UI library

## Overview

TOPE-UI (`@tfilo/tope-ui`) is a personal React UI component library. Library si developed using React 19, TypeScript, Vite, Tailwind CSS 4, TanStack React Form. Use this library for development of graphical user interface in React applications.

## Prerequisites

- React 19 project with Tailwindcss 4 installed and configured.
- Configured `.npmrc` file in home directory or project root directory with access to repository

If installation fails with "E404/Not Found - GET https://registry.npmjs.org/@tfilo%2ftope-ui - Not found" ask user to set up correctly `.npmrc` file and provide user this template. It is GitHub personal access token (classic) with `read:packages` permission and access to the package. User can crete it in his profile on github.:

```ini
@tfilo:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=NODE_AUTH_TOKEN
```

## Installation & Setup

The release workflow publishes `@tfilo/tope-ui` to GitHub Packages. Install library and it's peer dependency by following command:

```bash
npm i --save @tfilo/tope-ui @tanstack/react-form
```

Configure styles so application can work correctly. In main css file of project you are working on add this just after `@import 'tailwindcss';` import so it looks like this:

```css
@import 'tailwindcss';
@import '@tfilo/tope-ui/theme.css';
@import '@tfilo/tope-ui/base.css';

@source '../node_modules/@tfilo/tope-ui/dist';

/* Other custom styles or customized theme */
```

For more information how to customize theme follow `references/theme.md`.

## General example

When developing application using TOPE-UI library, use only tailwind classes provided by TOPE-UI theme so application is uniform.
Library provides multiple components for designing forms, views, tables etc. It provides some basic layout components too. App should use this common pattern to wrap all components. Usually this is added in main router file:

```tsx
import { Content, Header, type MenuItem } from '@tfilo/tope-ui';
import { HomeIcon } from '@heroicons/react/16/solid';

function App() {
    const router = useRouter();

    const menu: MenuItem[] = [
        {
            label: t('navigation.home'),
            icon: HomeIcon,
            onClick: () => router.navigate({ to: '/' }),
            active: pathname === '/'
        }
    ];

    const handleLogout = () => {
        // Logout user and redirec to login screen
    };

    return (
        <>
            <Header
                /* All Header props are optional, renders null if no props are provided or only menu is provided with empty array. Usefull for logged out user. */
                menu={menu}
                onLogout={isLoggedIn ? handleLogout : undefined}
            />
            <Content>
                <Outlet /> {/* Router framework outlet */}
            </Content>
        </>
    );
}
```

Than each page should looks like:

```tsx
import { Column, Flex, Grid, Page, Section, useAppForm } from '@tfilo/tope-ui';

function MyPage() {
    const form = useAppForm({
        defaultValues: {
            name: '',
            surname: '',
            address: {
                street: '',
                buildingNumber: '',
                country: '',
                zip: ''
            },
            note: ''
        },
        onSubmit: ({ value }) => {
            // process submission here
        }
    });

    const onSearch = () => {
        // process autocomplete search here, see Autocomplete documentation
    };

    const onFetch = () => {
        // process autocomplete fetch here, see Autocomplete documentation
    };

    return (
        <form
            onSubmit={(e) => {
                e.preventDefault();
                form.handleSubmit();
            }}
            onKeyDown={(e) => {
                if (e.key === 'Enter') e.preventDefault();
            }}
            noValidate
        >
            <Page title='Optional page title'>
                <Grid maxRows={4}>
                    <Column>
                        <form.AppField name='name'>{(field) => <field.Input label='First name' />}</form.AppField>
                    </Column>
                    <Column>
                        <form.AppField name='surname'>{(field) => <field.Input label='Last name' />}</form.AppField>
                    </Column>
                </Grid>

                <Section title='Address'>
                    <Grid maxRows={1}>
                        <Column>
                            <form.AppField name='address.street'>{(field) => <field.Input label='Street' />}</form.AppField>
                        </Column>
                        <Column>
                            <form.AppField name='address.buildingNumber'>
                                {(field) => <field.Input label='Building number' />}
                            </form.AppField>
                        </Column>
                        <Column>
                            <form.AppField name='address.country'>
                                {(field) => (
                                    <field.Autocomplete
                                        label='Country'
                                        onSearch={onSearch}
                                        onFetch={onFetch}
                                    />
                                )}
                            </form.AppField>
                        </Column>
                        <Column>
                            <form.AppField name='address.zip'>
                                {(field) => (
                                    <field.Input
                                        label='Zip'
                                        type='number'
                                    />
                                )}
                            </form.AppField>
                        </Column>
                    </Grid>
                </Section>

                <Flex>
                    <form.AppForm>
                        <form.SubscribeButton>Submit</form.SubscribeButton>
                    </form.AppForm>
                    <form.AppForm>
                        <form.ResetButton>Reset</form.ResetButton>
                    </form.AppForm>
                </Flex>
            </Page>
        </form>
    );
}
```

## Supported components

### Common interfaces/types

Shared types for multiple components, includes this types/interfaces:

- Icon (used by Input, Button, Card, Dropdown, Modal, Header, Section)
- Option (used by Autocomplete, Select, OptionGroup)
- OptionGroup (used by Select)

### Form components

Components ment to be used inside forms. This components depends on `@tanstack/react-form` and should be used using useAppForm hook exported by `@tfilo/tope-ui` library.

- Autocomplete - for information how to use follow `references/autocomplete.md`
- DateTimeInput - for information how to use follow `references/date-time-input.md`
- FileInput - for information how to use follow `references/file-input.md`
- Input - for information how to use follow `references/input.md`
- ResetButton - for information how to use follow `references/reset-button.md`
- Select - for information how to use follow `references/select.md`
- SubmitButton - for information how to use follow `references/submit-button.md`
- Switch - for information how to use follow `references/switch.md`
- TextArea - for information how to use follow `references/textarea.md`

### General components

Components that are designed for general purpose. Includes components that can be used standalone.

- Button - for information how to use follow `references/button.md`
- Card - for information how to use follow `references/card.md`
- Dropdown - for information how to use follow `references/dropdown.md`
- List - for information how to use follow `references/list.md`
- LoadingOverlay - for information how to use follow `references/loading-overlay.md`
- Modal - for information how to use follow `references/modal.md`
- Table - for information how to use follow `references/table.md`
- Tag - for information how to use follow `references/tag.md`

### Layout components

Components that are used to define base layout of application. It helps to improve visually your application.

- Column - for information how to use follow `references/column.md`
- Content - for information how to use follow `references/content.md`
- Flex - for information how to use follow `references/flex.md`
- Grid - for information how to use follow `references/grid.md`
- Header - for information how to use follow `references/header.md`
- Page - for information how to use follow `references/page.md`
- Section - for information how to use follow `references/section.md`

### Hooks

Provides `@tanstack/react-form` hooks created by `createFormHook` with included fieldComponents and formComponents.

- useAppForm
- withForm
- withFieldGroup

### Utils

- constants - exports `setLocalization` and `setConfig` allows to set custom localizations of aria labels and other text in components. IMPORTANT: App is by default localized in Slovak language.
- string-utils - simple utilities like `isEmpty`, `isNotEmpty`, `isBlank`, `isNotBlank` and mainly internal function `sb` used to stringify boolean value
