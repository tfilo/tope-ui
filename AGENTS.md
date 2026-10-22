# Working on TOPE-UI

## Project

TOPE-UI (`@tfilo/tope-ui`) is a personal React UI component library in active development. Read `README.md` and the relevant implementation and stories before making changes. Do not assume the library is production-ready.

The stack is React 19, TypeScript, Vite, Tailwind CSS 4, TanStack React Form, and Storybook. Node.js 24.x is recommended. Use npm and the existing `package-lock.json`.

## Priorities and scope

These priorities apply to every agent working on this repository, including reviews, implementation, documentation, and tests.

- This library is used only in the owner's personal projects. Optimize for those applications rather than a general-purpose public component library.
- Correct behavior and reliable integration with TanStack Start, TanStack Form, and Zod come first. Prevent incorrect values, broken interactions, and server-rendering or hydration failures.
- Prefer simple solutions that a human can understand and maintain in the future. Follow existing patterns, keep control flow clear, and introduce abstractions or dependencies only when they solve a concrete problem.
- Components should be accessible, and existing accessible behavior should be preserved. Accessibility improvements are welcome when straightforward, but accessibility is a secondary priority after functionality and maintainability. Avoid broad accessibility work unless requested.
- Keep effort proportional to personal use. Avoid speculative features, elaborate infrastructure, and support for scenarios the owner's applications do not need.

## Storybook and tests

- Storybook primarily serves as a demo and visual preview of components and their intended usage. Keep stories useful to a human exploring the library.
- Storybook tests should cover basic behavior and important interactions. Extensive coverage and exhaustive edge-case matrices are not required.
- Keep tests short, explicit, and easy to understand. Prefer a few direct interactions and assertions over complex test helpers, abstractions, or elaborate fixtures.
- When fixing a meaningful bug, add a small, readable regression test where useful. Do not expand the test suite just to maximize coverage or test implementation details.
- Keep uncommon setup or integration checks separate from demo stories when they would make the examples difficult to follow.

## Repository map

- `lib/main.ts`: runtime entry point and stylesheet import.
- `lib/index.ts`: public exports shared by the runtime entry and declaration build.
- `lib/general/`: reusable components such as Button, Dropdown, Modal, and Table.
- `lib/form/`: form components connected to TanStack Form.
- `lib/hooks/form.tsx`: `useAppForm`, `withForm`, and `withFieldGroup`, with registered field and form components.
- `lib/hooks/form-context.tsx`: shared field and form contexts.
- `lib/layout/`: page structure and responsive layout components.
- `lib/common/`: shared types such as Icon, Option, and OptionGroup.
- `lib/utils/`: utilities, configuration, and localization.
- `lib/main.css` and `lib/theme.css`: global styles and theme tokens.
- `lib/**/*.stories.tsx`: usage examples, documentation, and interaction tests.
- `lib/Example.stories.tsx`: a complete form and layout example.
- `.storybook/`: Storybook configuration.
- `vite.config.ts`: library build and Storybook browser test configuration.

## Commands

- `npm install`: install dependencies.
- `npm run build`: TypeScript checks and library bundles in `dist/`.
- `npm run storybook`: start Storybook on port 6006.
- `npm run build-storybook`: generate the static Storybook in `storybook-static/`.
- `npm run lint`: check library code with ESLint.
- `npm run prettier`: check formatting.
- `npm run test-storybook`: run the Storybook tests with Vitest and Playwright Chromium.

Browser tests require the browser matching the installed Playwright version. If the executable is missing, `npx playwright install chromium --only-shell` installs the required headless shell. Do not install system packages or additional browsers unless needed for the task.

Run checks appropriate to the change. For component behavior changes, run the build, lint, and Storybook tests; for public API or styling changes, also check relevant stories. Report any checks that could not run. Avoid running formatting or lint fixes across unrelated files.

## Implementation conventions

- Follow nearby code and existing component patterns rather than introducing a new structure.
- Components commonly have a component file, a `.types.ts` file, a `.stories.tsx` file, and an `index.ts` barrel. Follow the local folder's naming and capitalization.
- Keep public exports consistent with the existing barrel structure and `lib/main.ts`.
- Use strict TypeScript and preserve useful type inference, especially for TanStack Form fields and polymorphic component props.
- Use existing Tailwind utilities, theme tokens, and component-local theme objects. Check the custom spacing, color, typography, and breakpoint tokens before selecting classes.
- Keep form elements integrated with the shared TanStack Form contexts and registered `useAppForm` components. Follow existing stories for field validation and submission patterns.
- Reuse shared types and utilities. Place user-facing default text in the existing localization system; defaults are currently Slovak.
- Preserve accessible labels, keyboard behavior, focus handling, and native element semantics in line with the priorities above. For behavior changes, add or update only the simple, relevant tests needed to cover basic functionality or a meaningful regression.
- Preserve existing public APIs and defaults unless the requested task calls for changing them. Explain breaking changes and consumer migration needs.
- Keep changes focused. Avoid unrelated refactors, dependency changes, or generated output edits.

## Consumer integration

Consumers import components and hooks from `@tfilo/tope-ui`, and bundled styles from `@tfilo/tope-ui/style.css`. Verify package exports when updating consumer documentation; the README currently uses an unscoped stylesheet example.

The owner's applications use TanStack Start and Zod validation with TanStack Form. Preserve compatibility with that setup. When changing relevant code, check browser globals during server rendering, deterministic hydration, field value types, and display of Zod validation issues. Verify the current implementation rather than assuming a component is server-rendering safe.

The build generates TypeScript declarations from `lib/index.ts` using `tsconfig.types.json` after Vite builds the JavaScript and CSS. Package type exports point to `dist/index.d.ts`. Keep declaration generation after Vite, which clears `dist/`.
