import { ArrowDownIcon, ArrowsUpDownIcon, ArrowUpIcon } from '@heroicons/react/16/solid';
import { Button } from '../button';
import type { CellProps, TableProps } from './Table.types';

const Cell: React.FC<CellProps> = ({ row, metadata }) => {
    if (metadata.cell) {
        return <>{metadata.cell(row, row[metadata.accessor], metadata.accessor)}</>;
    }

    if (metadata.formatter) {
        return <>{metadata.formatter(row[metadata.accessor])}</>;
    }

    return <>{String(row[metadata.accessor])}</>;
};

const getIcon = (sortDirection: 'asc' | 'desc' | null) => {
    if (sortDirection === null) {
        return ArrowsUpDownIcon;
    }

    return sortDirection === 'asc' ? ArrowUpIcon : ArrowDownIcon;
};

const getNextSortDirection = (current: 'asc' | 'desc' | null): 'asc' | 'desc' | null => {
    if (current === null) {
        return 'asc';
    }

    if (current === 'asc') {
        return 'desc';
    }

    return null;
};

export const Table: React.FC<TableProps> = ({ columns, data }) => {
    return (
        <table className='w-full table-auto border-collapse text-sm'>
            <thead>
                <tr>
                    {columns.map((col) => (
                        <th
                            key={`${col.accessor}_${col.header}`}
                            className={
                                'border-b border-default p-md text-left font-bold text-default' +
                                (col.additionalClassName ? ` ${col.additionalClassName}` : '')
                            }
                        >
                            <div className='flex gap-md'>
                                <div className='flex-1'>{col.header}</div>
                                {col.onSort && (
                                    <div className='-my-md items-center flex'>
                                        <Button
                                            onClick={() => col.onSort(col.accessor, getNextSortDirection(col.sortDirection))}
                                            icon={getIcon(col.sortDirection)}
                                            showChildren={false}
                                            variant='transparent'
                                        >
                                            Sort
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {data.map((row, rowIndex) => (
                    <tr key={rowIndex}>
                        {columns.map((col) => (
                            <td
                                key={`${col.accessor}_${col.header}`}
                                className={
                                    'border-b border-default p-md text-left text-default' +
                                    (col.additionalClassName ? ` ${col.additionalClassName}` : '')
                                }
                            >
                                <Cell
                                    row={row}
                                    metadata={col}
                                />
                            </td>
                        ))}
                    </tr>
                ))}
            </tbody>
        </table>
    );
};
