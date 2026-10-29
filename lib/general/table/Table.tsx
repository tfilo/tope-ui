import { useEffect, useEffectEvent, useMemo, useState, type ReactElement } from 'react';
import { ArrowPathIcon } from '@heroicons/react/16/solid';

import { config, localization } from '../../utils/constants';
import { Button } from '../button';
import type { RowObject, SortObject, TableProps } from './Table.types';
import { TableCell } from './TableCell';
import { TablePagination } from './TablePagination';
import { TableHeaderCell } from './TableHeaderCell';

const theme = {
    wrapper: 'w-full',
    scrollWrapper: 'relative w-full overflow-y-auto',
    loading: 'absolute inset-none z-10 flex items-center justify-center bg-white/50 backdrop-blur-sm',
    error: 'flex items-center justify-between gap-md border-b border-default p-md',
    errorMessage: 'text-danger',
    table: 'w-full table-auto border-separate border-spacing-none',
    headerCell: (additional: string = '') => `border-b border-default p-md text-left font-bold text-default ${additional}`.trim(),
    bodyCell: (additional: string = '') => `border-b border-default p-md text-left text-default ${additional}`.trim()
} as const;

/**
 * Base compare method, compares all values as strings except number or bigint that are compared as numbers
 *
 * @param a first value
 * @param b second value
 * @returns number
 */
const baseCompareFn = (a: unknown, b: unknown): number => {
    if (typeof a === 'bigint' || typeof b === 'bigint') {
        // Relational comparisons preserve bigint precision, including against fractional numbers.
        // Keep the existing numeric coercion for other values (undefined becomes zero).
        const valueA = typeof a === 'bigint' ? a : +(a ?? 0);
        const valueB = typeof b === 'bigint' ? b : +(b ?? 0);

        return valueA < valueB ? -1 : valueA > valueB ? 1 : 0;
    }

    if (typeof a === 'number' || typeof b === 'number') {
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
export const Table = <TData extends RowObject>({
    columns,
    pageSize = 10,
    data: _data,
    onFetch,
    showHeader = true
}: TableProps<TData>): ReactElement => {
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
    const [isLoading, setIsLoading] = useState(false);
    const [fetchFailed, setFetchFailed] = useState(false);
    const [fetchAttempt, setFetchAttempt] = useState(0);
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

    const onPrevPage = () => {
        setPage((prev) => {
            return Math.max(0, prev - 1);
        });
    };

    const onNextPage = () => {
        setPage((prev) => {
            return Math.max(0, Math.min(totalPages - 1, prev + 1));
        });
    };

    const onPageChange = (page: number) => {
        setPage(Math.max(0, Math.min(totalPages - 1, page)));
    };

    const onSortChange = (accessor: keyof TData) => {
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
    };

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
        const abortController = new AbortController();
        if (hasFetch) {
            (async (signal: AbortSignal) => {
                try {
                    setIsLoading(true);
                    setFetchFailed(false);
                    const res = await onFetch(page, pageSize, sort, signal);
                    if (!signal.aborted) {
                        onSetData(res.data, res.page, res.pageSize, res.totalRecords);
                    }
                } catch (error) {
                    if (!signal.aborted && !(error instanceof Error && error.name === 'AbortError')) {
                        setData([]);
                        setFetchFailed(true);
                    }
                } finally {
                    if (!signal.aborted) {
                        setIsLoading(false);
                    }
                }
            })(abortController.signal);
        }

        return () => {
            abortController.abort();
        };
    }, [onFetch, hasFetch, page, pageSize, sort, fetchAttempt]);

    const staticData = useMemo(() => {
        if (_data === undefined) {
            return undefined;
        }

        // Keep each source index with its row so keys remain unique and stable while sorting.
        return Array.from(_data, (row, index) => ({ row, index })).sort(({ row: rowA }, { row: rowB }) => {
            const _sort = [...sort];
            let sortResult = 0;
            let s: SortObject<TData> | undefined;
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
    }, [_data, columns, sort]);

    return (
        <div className={theme.wrapper}>
            <div
                className={theme.scrollWrapper}
                aria-busy={hasFetch ? isLoading : undefined}
            >
                <table
                    className={theme.table}
                    inert={hasFetch && isLoading}
                >
                    {showHeader && (
                        <thead>
                            <tr>
                                {columns.map((col) => (
                                    <th
                                        key={`${col.accessor.toString()}_${col.header}`}
                                        className={theme.headerCell(col.additionalClassName)}
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
                    )}
                    <tbody>
                        {(staticData ?? data.map((row, index) => ({ row, index }))).map(({ row, index }) => (
                            <tr key={`${index}_${Object.values(row).join('_')}`}>
                                {columns.map((col) => (
                                    <td
                                        key={`${col.accessor.toString()}_${col.header}`}
                                        className={theme.bodyCell(col.additionalClassName)}
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
                {hasFetch && isLoading && (
                    <div
                        className={theme.loading}
                        role='status'
                    >
                        {localization.loading}
                    </div>
                )}
            </div>
            {hasFetch && fetchFailed && (
                <div className={theme.error}>
                    <span
                        className={theme.errorMessage}
                        role='alert'
                    >
                        {localization.tableFetchError}
                    </span>
                    <Button
                        variant='transparent'
                        icon={ArrowPathIcon}
                        showChildren={false}
                        additionalClassName='min-w-[32px] min-h-[32px] shrink-0'
                        onClick={() => setFetchAttempt((attempt) => attempt + 1)}
                    >
                        {localization.retry}
                    </Button>
                </div>
            )}
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
