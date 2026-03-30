import { ArrowDownIcon, ArrowLeftIcon, ArrowRightIcon, ArrowsUpDownIcon, ArrowUpIcon } from '@heroicons/react/16/solid';
import { Button } from '../button';
import type { CellProps, TableProps } from './Table.types';
import { useCallback, useEffect, useEffectEvent, useMemo, useState } from 'react';
import { localization } from '../../utils/constants';
import { Select } from '../../form';

type DataType = Exclude<TableProps['data'], undefined>;
type SortDirection = 'asc' | 'desc' | null;

const Cell: React.FC<CellProps> = ({ row, metadata }) => {
    if (metadata.cell) {
        return <>{metadata.cell(row, row[metadata.accessor], metadata.accessor)}</>;
    }

    if (metadata.formatter) {
        return <>{metadata.formatter(row[metadata.accessor])}</>;
    }

    return <>{String(row[metadata.accessor])}</>;
};

const getSortIcon = (sortDirection: SortDirection) => {
    if (sortDirection === null) {
        return ArrowsUpDownIcon;
    }

    return sortDirection === 'asc' ? ArrowUpIcon : ArrowDownIcon;
};

const getSortIconLabel = (sortDirection: SortDirection): string => {
    if (sortDirection === null) {
        return localization.sortNotSet;
    }

    return sortDirection === 'asc' ? localization.sortNotSet : localization.sortDsc;
};

const baseCompareFn = (a: unknown, b: unknown): number => {
    const valueA = `${a ?? ''}`.toLocaleLowerCase();
    const valueB = `${b ?? ''}`.toLocaleLowerCase();
    return valueA.localeCompare(valueB, undefined, {
        sensitivity: 'base'
    });
};

export const Table: React.FC<TableProps> = ({ columns, pageSize: _pageSize = 10, data: _data, onFetch }) => {
    console.log('Table rendered');
    const [pageSize, setPageSize] = useState(_pageSize);

    if (_pageSize < 1) {
        throw new Error('PageSize must be at least 1!');
    }
    if (columns.length < 1) {
        throw new Error('Table must have at least one column!');
    }
    if (_data === undefined && onFetch === undefined) {
        throw new Error('Data or onFetch method must be provided!');
    }
    if (_data !== undefined && onFetch !== undefined) {
        throw new Error('Only data or onFetch must be provided, not both at a same time!');
    }

    const [page, setPage] = useState(0);
    const [totalRecords, setTotalRecords] = useState(0);
    const [data, setData] = useState<DataType>([]);
    const [sort, setSort] = useState<{ accessor: string; direction: 'asc' | 'desc' }[]>(() => {
        return columns
            .filter((col) => col.defaultSortDirection !== undefined)
            .map((col) => ({
                accessor: col.accessor,
                direction: col.defaultSortDirection!
            }));
    });

    const hasStaticData = _data !== undefined;
    const hasFetch = onFetch !== undefined;
    const totalPages = Math.ceil(totalRecords / pageSize);

    const paginationOptions = useMemo(() => {
        return [...new Array(totalPages).keys()].map((i) => ({
            label: `${i + 1}`,
            value: `${i}`
        }));
    }, [totalPages]);

    const onPrevPage = useCallback(() => {
        setPage((prev) => {
            return Math.max(0, prev - 1);
        });
    }, []);

    const onNextPage = useCallback(() => {
        setPage((prev) => {
            return Math.min(totalPages - 1, prev + 1);
        });
    }, [totalPages]);

    const onPageChange = useCallback((e: React.ChangeEvent<HTMLSelectElement, HTMLSelectElement>) => {
        setPage(+e.currentTarget.value);
    }, []);

    const onSortChange = useCallback((accessor: string) => {
        setSort((prev) => {
            let result = [...prev];
            const idx = result.findIndex((s) => s.accessor === accessor);
            if (idx === -1) {
                result.push({
                    accessor,
                    direction: 'asc'
                });
            } else if (result[idx].direction === 'asc') {
                result[idx].direction = 'desc';
            } else {
                result = result.filter((s) => s.accessor !== accessor);
            }

            return result;
        });
        setPage(0);
    }, []);

    const onSetData = useEffectEvent((data: DataType, page?: number, pageSize?: number, totalRecords?: number) => {
        setData(data);
        if (page !== undefined) {
            setPage(page);
        }
        if (pageSize !== undefined) {
            setPageSize(pageSize);
        }
        if (totalRecords !== undefined) {
            setTotalRecords(totalRecords);
        }
    });

    useEffect(() => {
        if (hasFetch) {
            onFetch(page, pageSize, sort).then((res) => {
                onSetData(res.data, res.page, res.pageSize, res.totalRecords);
            });
        }
    }, [onFetch, hasFetch, page, pageSize, sort]);

    useEffect(() => {
        if (hasStaticData) {
            const sorted = [..._data].sort((rowA, rowB) => {
                const _sort = [...sort];
                let sortResult = 0;
                let s:
                    | {
                          accessor: string;
                          direction: 'asc' | 'desc';
                      }
                    | undefined = undefined;
                do {
                    s = _sort.shift();
                    if (s !== undefined) {
                        const accessor = s.accessor;
                        const valueA = rowA[accessor];
                        const valueB = rowB[accessor];
                        const comparatorFn = columns.find((col) => col.accessor === accessor)?.compare ?? baseCompareFn;

                        if (s.direction === 'asc') {
                            sortResult = comparatorFn(valueA, valueB);
                        } else {
                            sortResult = comparatorFn(valueB, valueA);
                        }
                    }
                } while (sortResult === 0 && s !== undefined);
                return sortResult;
            });
            onSetData(sorted);
        }
    }, [_data, columns, hasStaticData, sort]);

    useEffect(() => {
        if (hasStaticData) {
            onSetData(_data);
        }
    }, [hasStaticData, _data, _pageSize]);

    useEffect(() => {
        setPageSize(_pageSize);
    }, [_pageSize]);

    return (
        <div className='w-full'>
            <div className='overflow-y-auto w-full'>
                <table className='w-full table-auto border-separate border-spacing-none'>
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
                                        {col.sortable && (
                                            <div className='-my-md items-center flex gap-xs'>
                                                {sort.length > 1 ? (
                                                    <span className='bg-primary-extra-light rounded-full px-md aspect-square flex items-center'>
                                                        {sort.findIndex((s) => s.accessor === col.accessor) + 1}
                                                    </span>
                                                ) : null}
                                                <Button
                                                    onClick={() => onSortChange(col.accessor)}
                                                    icon={getSortIcon(sort.find((s) => s.accessor === col.accessor)?.direction ?? null)}
                                                    showChildren={false}
                                                    variant='transparent'
                                                    additionalClassName='min-w-[32px] min-h-[32px] rounded-md'
                                                >
                                                    {getSortIconLabel(sort.find((s) => s.accessor === col.accessor)?.direction ?? null)}
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((row) => (
                            <tr key={Object.values(row).join('_')}>
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
            </div>
            {!hasStaticData && (
                <div className='w-full flex gap-md items-center py-sm justify-between'>
                    <Button
                        icon={ArrowLeftIcon}
                        showChildren={false}
                        variant='outline'
                        onClick={onPrevPage}
                        disabled={page === 0}
                    />
                    <div className='text-sm flex gap-md items-center'>
                        {localization.page}
                        <Select
                            options={paginationOptions}
                            value={page.toString()}
                            onChange={onPageChange}
                        />
                        {localization.of} {totalPages}
                    </div>
                    <Button
                        icon={ArrowRightIcon}
                        showChildren={false}
                        variant='outline'
                        onClick={onNextPage}
                        disabled={page === totalPages - 1}
                    />
                </div>
            )}
        </div>
    );
};
