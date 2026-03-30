type ColumnFormatter = {
    /** Cell is an optional function that takes the entire row, the value of the column for that row, and the accessor, and returns a React node to be rendered in the cell */
    cell?: never;
    /** Formatter is an optional function that takes the value of the column for a row and returns a string to be rendered in the cell */
    formatter?: (column: unknown) => string;
};

type ColumnCell = {
    /** Cell is an optional function that takes the entire row, the value of the column for that row, and the accessor, and returns a React node to be rendered in the cell */
    cell?: (row: Record<string, unknown>, column: unknown, accessor: string) => React.ReactNode;
    /** Formatter is an optional function that takes the value of the column for a row and returns a string to be rendered in the cell */
    formatter?: never;
};

type ColumnCellOrFormater = ColumnCell | ColumnFormatter;

type Column = {
    /** Header is the display name of the column */
    header: string;
    /** Accessor is the key in the data object that this column corresponds to */
    accessor: string;
    /** Additional class name for the column, which will be applied to both header and cells of this column */
    additionalClassName?: string;
    /** Default sort direction */
    defaultSortDirection?: 'asc' | 'desc';
    /** Enable sort */
    sortable?: boolean;
    /** Compare method, applicable only for sortable column and table with static data */
    compare?: (a: unknown, b: unknown) => number;
} & ColumnCellOrFormater;

type TableData = {
    /** Data is an array of objects where keys are strings and values can be of any type */
    data: Readonly<Record<string, unknown>[]>;
    /** Fetch is method to fetch page of data */
    onFetch?: never;
    /** Pagesize for paginated table */
    pageSize?: never;
};

type TableFetch = {
    /** Data is an array of objects where keys are strings and values can be of any type */
    data?: never;
    /** Fetch is method to fetch page of data */
    onFetch: (
        page: number,
        pageSize: number,
        sort: { accessor: string; direction: 'asc' | 'desc' }[]
    ) => Promise<{
        data: Record<string, unknown>[];
        page: number;
        pageSize: number;
        totalRecords: number;
    }>;
    /** Pagesize for paginated table */
    pageSize?: number;
};

type TableDataOrFetch = TableData | TableFetch;

export type CellProps = {
    row: Record<string, unknown>;
    metadata: Pick<Column, 'cell' | 'formatter' | 'accessor'>;
};

export type TableProps = {
    columns: Column[];
} & TableDataOrFetch;
