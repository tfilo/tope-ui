import type { TableCellComponent } from './Table.types';

export const TableCell: TableCellComponent = ({ row, metadata }) => {
    if (metadata.cell) {
        return <>{metadata.cell(row, row[metadata.accessor], metadata.accessor)}</>;
    }

    if (metadata.formatter) {
        return <>{metadata.formatter(row[metadata.accessor])}</>;
    }

    return <>{String(row[metadata.accessor])}</>;
};
