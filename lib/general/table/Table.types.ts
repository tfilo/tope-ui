type Column = {
    /** Header is the display name of the column */
    header: string;
    /** Accessor is the key in the data object that this column corresponds to */
    accessor: string;
    /** Additional class name for the column, which will be applied to both header and cells of this column */
    additionalClassName?: string;
} & (
    | {
          /** Cell is an optional function that takes the entire row, the value of the column for that row, and the accessor, and returns a React node to be rendered in the cell */
          cell?: (row: Record<string, unknown>, column: unknown, accessor: string) => React.ReactNode;
          /** Formatter is an optional function that takes the value of the column for a row and returns a string to be rendered in the cell */
          formatter?: never;
      }
    | {
          /** Cell is an optional function that takes the entire row, the value of the column for that row, and the accessor, and returns a React node to be rendered in the cell */
          cell?: never;
          /** Formatter is an optional function that takes the value of the column for a row and returns a string to be rendered in the cell */
          formatter?: (column: unknown) => string;
      }
) &
    (
        | {
              /** Enables sorting on column */
              onSort: (accessor: string, direction: 'asc' | 'desc' | null) => void;
              /** Sort direction */
              sortDirection: 'asc' | 'desc' | null;
          }
        | {
              onSort?: never;
              sortDirection?: never;
          }
    );

export type CellProps = {
    row: Record<string, unknown>;
    metadata: Pick<Column, 'cell' | 'formatter' | 'accessor'>;
};

export type TableProps = {
    columns: Column[];
    /** Data is an array of objects where keys are strings and values can be of any type */
    data: Record<string, unknown>[];
};
