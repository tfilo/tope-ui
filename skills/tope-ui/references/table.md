# Table

## When to use

Use `Table` to display **rows of records** with sortable columns, custom cells (action buttons, links) and optional server-side pagination.

- **Static data** (`data` prop): all rows are given at once. Sorting is done by the table, there is no pagination.
- **Fetched data** (`onFetch` prop): the table loads one page at a time, shows a loader and an error with retry, and has pagination. Sorting and paging are done by your `onFetch`.
- Exactly **one** of `data` and `onFetch` must be given, otherwise the table throws.
- Below the tablet breakpoint it can switch to a custom compact row layout (`renderMobileRow`).
- It is a standalone component with no form context.

## Import

```tsx
import { Table, createColumns } from '@tfilo/tope-ui';
```

Always define columns with `createColumns<Row>()`, it checks that every `accessor` is a key of the row.

```tsx
type Vehicle = { name: string; year: number; active: boolean };

const columns = createColumns<Vehicle>([
    { header: 'Name', accessor: 'name', sortable: true, defaultSortDirection: 'asc' },
    { header: 'Year', accessor: 'year', sortable: true },
    { header: 'Active', accessor: 'active', formatter: (active) => (active ? 'Yes' : 'No') },
    {
        header: 'Actions',
        accessor: 'name',
        cell: (row) => (
            <Button
                icon={PencilIcon}
                showChildren={false}
                variant='transparent'
                onClick={() => edit(row)}
            >
                Edit
            </Button>
        )
    }
]);

<Table
    data-testid='vehicles'
    columns={columns}
    data={vehicles}
    onRowClick={(row) => openDetail(row)}
/>;
```

Server-side paging and sorting. Keep `onFetch` **stable** (module level or `useCallback`), a new function resets the table to the first page and loads again:

```tsx
const fetchVehicles = useCallback(
    async (page: number, pageSize: number, sort: { accessor: keyof Vehicle; direction: 'asc' | 'desc' }[], signal?: AbortSignal) => {
        const params = new URLSearchParams({ page: String(page), size: String(pageSize) });
        sort.forEach((s) => params.append('sort', `${String(s.accessor)},${s.direction}`));
        const res = await fetch(`/api/vehicles?${params}`, { signal });
        if (!res.ok) throw new Error('Fetch failed');
        const body: { items: Vehicle[]; total: number } = await res.json();
        return { data: body.items, page, pageSize, totalRecords: body.total };
    },
    []
);

<Table
    data-testid='vehicles'
    columns={columns}
    onFetch={fetchVehicles}
    pageSize={20}
/>;
```

Compact layout on small screens. Below the tablet breakpoint the table is replaced by a list of rows rendered by `renderMobileRow`:

```tsx
<Table
    columns={columns}
    data={vehicles}
    renderMobileRow={(row) => (
        <div>
            <strong>{row.name}</strong>
            <div>{row.year}</div>
        </div>
    )}
/>
```

## Props

| Prop              | Type                                                   | Required                | Default | Description                                                                                                                          |
| ----------------- | ------------------------------------------------------ | ----------------------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| `columns`         | `Column[]`                                             | Yes                     | -       | Column definitions created by `createColumns`. At least one is required. See [Columns](#columns).                                    |
| `data`            | `Row[]`                                                | One of `data`/`onFetch` | -       | Static rows. Sorted internally, the array itself is not changed.                                                                     |
| `onFetch`         | `(page, pageSize, sort, abortSignal?) => Promise<...>` | One of `data`/`onFetch` | -       | Loads one page of rows. See [onFetch contract](#onfetch-contract).                                                                   |
| `pageSize`        | `number`                                               | No                      | `10`    | Rows per page, at least `1`. Only with `onFetch`.                                                                                    |
| `initialPage`     | `number`                                               | No                      | `0`     | Zero-based first page. Read on mount only, only with `onFetch`.                                                                      |
| `showHeader`      | `boolean`                                              | No                      | `true`  | Shows the header row, including the sort buttons.                                                                                    |
| `onRowClick`      | `(row: Row) => void \| Promise<void>`                  | No                      | -       | Makes rows clickable and keyboard focusable (`Enter` / `Space`). Clicks on buttons, links and inputs inside a row do not trigger it. |
| `renderMobileRow` | `(row: Row) => ReactNode`                              | No                      | -       | Compact row layout used below the tablet breakpoint instead of the table. Shares data, sorting and pagination with the table.        |
| `data-testid`     | `string`                                               | No                      | -       | Base test id. See [Testing](#testing).                                                                                               |

`Table` accepts only these props, there is no `className`.

### Columns

Each column is an object:

| Field                  | Type                                  | Required | Description                                                                                                                                |
| ---------------------- | ------------------------------------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| `header`               | `string`                              | Yes      | Column title.                                                                                                                              |
| `accessor`             | `keyof Row`                           | Yes      | Key of the row used for the cell value and for sorting. It may repeat, e.g. in an actions column.                                          |
| `cell`                 | `(row, value, accessor) => ReactNode` | No       | Custom cell content. Cannot be combined with `formatter`.                                                                                  |
| `formatter`            | `(value) => string`                   | No       | Converts the value to text. Cannot be combined with `cell`.                                                                                |
| `sortable`             | `boolean`                             | No       | Shows a sort button in the header.                                                                                                         |
| `defaultSortDirection` | `'asc' \| 'desc'`                     | No       | Column is sorted this way initially. Several columns give a multi-column sort in column order.                                             |
| `compare`              | `(a, b) => number`                    | No       | Custom comparison for sorting. Used only with static `data`.                                                                               |
| `additionalClassName`  | `string`                              | No       | Tailwind classes applied to the header and to all cells of the column, e.g. `min-w-[150px]`, or `sticky right-none` for an actions column. |

### Row values

Row values must be **primitives**: `string`, `number`, `boolean`, `bigint` or `undefined`. Objects, arrays, `Date` and `null` are not allowed, convert them (for example a date to an ISO string) or put the data into `cell`.

Without `cell` or `formatter` the value is shown as `String(value)`, so `undefined` is displayed as the text `undefined` and booleans as `true` / `false`. Use `formatter` for those.

### onFetch contract

```ts
onFetch(page: number, pageSize: number, sort: { accessor: keyof Row; direction: 'asc' | 'desc' }[], abortSignal?: AbortSignal)
    => Promise<{ data: Row[]; page: number; pageSize: number; totalRecords: number }>
```

- `page` is **zero-based**. `sort` lists the sorted columns in order, an empty array means unsorted. Your backend must apply it.
- Return the requested `page` and **the same `pageSize`** you received (a different value throws). `totalRecords` is the total count over all pages and drives the pagination.
- Pass `abortSignal` to `fetch`. Requests are aborted when the page or sort changes. Aborted requests are ignored.
- If the promise rejects (other than abort), the table shows an error message with a retry button.

### Behavior notes

- Sort button cycles ascending, descending, unsorted. Sorting several columns shows the sort order number in the header. Changing the sort goes back to the first page.
- Default static sorting compares numbers numerically and everything else as text, case-insensitive, using `config.locale` (`sk-SK` by default). Use `compare` for custom order.
- While loading (`onFetch`), the table shows a loader and is inert.
- There is no empty-state message. When there are no rows, render your own message next to the table.
- Pagination (previous, next, page picker) is shown only with `onFetch`.
- The types `RowObject`, `Column` and `SortObject` are not exported from the library. Type `sort` inline as in the example.
- Texts (sort buttons, loading, error, retry, pagination) come from the library localization (`setLocalization`), Slovak by default.

## Types

```ts
type RowObject = Record<string, string | number | boolean | bigint | undefined>;

type SortObject<TData extends RowObject> = { accessor: keyof TData; direction: 'asc' | 'desc' };

type Column<TData extends RowObject, TAccessor extends keyof TData> = {
    header: string;
    accessor: TAccessor;
    additionalClassName?: string;
    defaultSortDirection?: 'asc' | 'desc';
    sortable?: boolean;
    compare?: (a: TData[TAccessor], b: TData[TAccessor]) => number;
} & (
    | { cell?: (row: TData, column: TData[TAccessor], accessor: TAccessor) => ReactNode; formatter?: never }
    | { cell?: never; formatter?: (column: TData[TAccessor]) => string }
);

type TableProps<TData extends RowObject> = {
    columns: Column[];
    showHeader?: boolean;
    onRowClick?: (row: TData) => void | Promise<void>;
    renderMobileRow?: (row: TData) => ReactNode;
    'data-testid'?: string;
} & (
    | { data: Readonly<TData[]>; onFetch?: never; pageSize?: never; initialPage?: never }
    | { data?: never; onFetch: OnFetch; pageSize?: number; initialPage?: number }
);

const createColumns: <TData extends RowObject>(cols: Column[]) => Column[];
```

## Testing

All test ids are derived from the `data-testid` prop. In the table `{testid}` is the value passed to `data-testid`; without the prop no test ids are rendered.

| Element                                                        | data-testid                                 |
| -------------------------------------------------------------- | ------------------------------------------- |
| Table (`<table>`)                                              | `{testid}`                                  |
| Header cell (`accessor` is the column accessor)                | `{testid}_header_cell_{accessor}`           |
| Body cell (`row` and `col` are zero-based)                     | `{testid}_body_cell_{row}_{col}`            |
| Compact row (`renderMobileRow`, `row` is zero-based)           | `{testid}_mobile_row_{row}`                 |
| Loader, `role='status'` (`onFetch`, while loading)             | `{testid}_loader`                           |
| Fetch error with the retry button (`onFetch`, after a failure) | `{testid}_fetch_error`                      |
| Previous page button                                           | `{testid}_pagination_prev`                  |
| Next page button                                               | `{testid}_pagination_next`                  |
| Page picker button                                             | `{testid}_pagination_dropdown`              |
| Page in the picker (`idx` is the zero-based page)              | `{testid}_pagination_dropdown_option_{idx}` |

- With static data, `row` in a body cell id is the **index in the source `data` array**, not the position after sorting.
- Sort buttons and the retry button have no test id. Find them by accessible name: the sort button is named `{header} - {current sort}` (e.g. `Name - Nezoradené` by default), the retry button by `localization.retry`.
- To open a row, click one of its body cells, the click reaches the row.

Cypress example, sorting and opening a row (static data):

```ts
cy.get('[data-testid="vehicles_body_cell_0_0"]').should('contain.text', 'Octavia');
cy.contains('button', 'Name - ').click();
cy.get('[data-testid="vehicles_body_cell_0_0"]').click();
```

Playwright example, paging and opening a row (`onFetch`):

```ts
await page.getByTestId('vehicles_pagination_next').click();
await expect(page.getByTestId('vehicles_loader')).toHaveCount(0);
await page.getByRole('button', { name: /^Name - / }).click();
await page.getByTestId('vehicles_body_cell_0_0').click();
```