import type { RowObject, SortObject, TableProps } from './Table.types';
import { useCallback, useEffect, useEffectEvent, useState, type ReactElement } from 'react';
import { TableCell } from './TableCell';
import { TablePagination } from './TablePagination';
import { TableHeaderCell } from './TableHeaderCell';
import { config } from '../../utils/constants';

/**
 * Base compare method, compares all values as strings except number or bigint that are compared as numbers
 *
 * @param a first value
 * @param b second value
 * @returns number
 */
const baseCompareFn = (a: unknown, b: unknown): number => {
    if (typeof a === 'bigint' || typeof b === 'bigint' || typeof a === 'number' || typeof b === 'number') {
        const valueA = +(a ?? 0);
        const valueB = +(b ?? 0);

        return valueA - valueB;
    }

    const valueA = `${a ?? ''}`.toLocaleLowerCase(config.locale);
    const valueB = `${b ?? ''}`.toLocaleLowerCase(config.locale);
    return valueA.localeCompare(valueB, config.locale, {
        sensitivity: 'base'
    });
};

/**
 * Table component that renders as Table with pagination if onFetch used or without if data provided. In case of data provided it handles sort internally, in case of onFetch it pass sort order together with pagination to onFetch method
 */
export const Table = <TData extends RowObject>({ columns, pageSize = 10, data: _data, onFetch }: TableProps<TData>): ReactElement => {
    //const [pageSize, setPageSize] = useState(_pageSize);

    if (pageSize < 1) {
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
    const [data, setData] = useState<Readonly<TData[]>>([]);
    const [sort, setSort] = useState<SortObject<TData>[]>(() => {
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

    const onSortChange = useCallback((accessor: keyof TData) => {
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

    const onSetData = useEffectEvent((data: Readonly<TData[]>, page?: number, _pageSize?: number, totalRecords?: number) => {
        if (_pageSize !== undefined && _pageSize !== pageSize) {
            throw new Error('PageSize can not be changed from response');
        }
        setData(data);
        if (page !== undefined) {
            setPage(page);
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
        const abortController = new AbortController();
        (async () => {
            if (hasStaticData) {
                const sorted = [..._data].sort((rowA, rowB) => {
                    const _sort = [...sort];
                    let sortResult = 0;
                    do {
                        const s: SortObject<TData> | undefined = _sort.shift();
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
                if (!abortController.signal.aborted) {
                    onSetData(sorted);
                }
            }
        })();

        return () => {
            abortController.abort();
        };
    }, [_data, columns, hasStaticData, sort]);

    return (
        <div className='w-full'>
            <div className='overflow-y-auto w-full'>
                <table className='w-full table-auto border-separate border-spacing-none'>
                    <thead>
                        <tr>
                            {columns.map((col) => (
                                <th
                                    key={`${col.accessor.toString()}_${col.header}`}
                                    className={
                                        'border-b border-default p-md text-left font-bold text-default' +
                                        (col.additionalClassName ? ` ${col.additionalClassName}` : '')
                                    }
                                >
                                    <TableHeaderCell
                                        col={col}
                                        sort={sort}
                                        onSortChange={onSortChange}
                                    />
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((row) => (
                            <tr key={Object.values(row).join('_')}>
                                {columns.map((col) => (
                                    <td
                                        key={`${col.accessor.toString()}_${col.header}`}
                                        className={
                                            'border-b border-default p-md text-left text-default' +
                                            (col.additionalClassName ? ` ${col.additionalClassName}` : '')
                                        }
                                    >
                                        <TableCell
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
                <TablePagination
                    onPrevPage={onPrevPage}
                    onNextPage={onNextPage}
                    onPageChange={onPageChange}
                    page={page}
                    totalPages={totalPages}
                />
            )}
        </div>
    );
};
