import type { ReactElement } from 'react';

type ColumnValue = string | number | boolean | bigint | number | undefined;
export type RowObject = Record<string, ColumnValue>;

type ColumnFormatter<TData extends RowObject, TAccessor extends keyof TData> = {
    /** Cell is an optional function that takes the entire row, the value of the column for that row, and the accessor, and returns a React node to be rendered in the cell */
    cell?: never;
    /** Formatter is an optional function that takes the value of the column for a row and returns a string to be rendered in the cell */
    formatter?: (column: TData[TAccessor]) => string;
};

type ColumnCell<TData extends RowObject, TAccessor extends keyof TData> = {
    /** Cell is an optional function that takes the entire row, the value of the column for that row, and the accessor, and returns a React node to be rendered in the cell */
    cell?: (row: TData, column: TData[TAccessor], accessor: TAccessor) => React.ReactNode;
    /** Formatter is an optional function that takes the value of the column for a row and returns a string to be rendered in the cell */
    formatter?: never;
};

type ColumnCellOrFormater<TData extends RowObject, TAccessor extends keyof TData> =
    | ColumnCell<TData, TAccessor>
    | ColumnFormatter<TData, TAccessor>;

type TableData<TData extends RowObject> = {
    /** Data is an array of objects where keys are strings and values can be of any type */
    data: Readonly<TData[]>;
    /** Fetch is method to fetch page of data */
    onFetch?: never;
    /** Pagesize for paginated table */
    pageSize?: never;
};

export type SortObject<TData extends RowObject> = { accessor: keyof TData; direction: 'asc' | 'desc' };

type TableFetch<TData extends RowObject> = {
    /** Data is an array of objects where keys are strings and values can be of any type */
    data?: never;
    /** Fetch is method to fetch page of data */
    onFetch: (
        page: number,
        pageSize: number,
        sort: SortObject<TData>[]
    ) => Promise<{
        data: Readonly<TData[]>;
        page: number;
        pageSize: number;
        totalRecords: number;
    }>;
    /** Pagesize for paginated table */
    pageSize?: number;
};

type TableDataOrFetch<TData extends RowObject> = TableData<TData> | TableFetch<TData>;

export type Column<TData extends RowObject, TAccessor extends keyof TData> = {
    /** Header is the display name of the column */
    header: string;
    /** Accessor is the key in the data object that this column corresponds to */
    accessor: TAccessor;
    /** Additional class name for the column, which will be applied to both header and cells of this column */
    additionalClassName?: string;
    /** Default sort direction */
    defaultSortDirection?: 'asc' | 'desc';
    /** Enable sort */
    sortable?: boolean;
    /** Compare method, applicable only for sortable column and table with static data */
    compare?: (a: TData[TAccessor], b: TData[TAccessor]) => number;
} & ColumnCellOrFormater<TData, TAccessor>;

type TableHeaderCellProps<TData extends RowObject> = {
    col: Column<TData, keyof TData>;
    sort: SortObject<TData>[];
    onSortChange: (accessor: keyof TData) => void;
};

export type CellProps<TData extends RowObject> = {
    row: TData;
    metadata: Pick<Column<TData, keyof TData>, 'cell' | 'formatter' | 'accessor'>;
};

export type TableProps<TData extends RowObject> = {
    columns: { [K in keyof TData]: Column<TData, K> }[keyof TData][];
    showHeader?: boolean;
} & TableDataOrFetch<TData>;

export type TablePaginationProps = {
    onPrevPage: () => void;
    onNextPage: () => void;
    onPageChange: (e: React.ChangeEvent<HTMLSelectElement, HTMLSelectElement>) => void;
    page: number;
    totalPages: number;
};

export type TableHeaderCellComponent = <TData extends RowObject>(props: TableHeaderCellProps<TData>) => ReactElement;
export type TableCellComponent = <TData extends RowObject>(props: CellProps<TData>) => ReactElement;
