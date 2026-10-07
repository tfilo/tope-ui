import { useCallback } from 'react';
import { ArrowDownIcon, ArrowsUpDownIcon, ArrowUpIcon } from '@heroicons/react/16/solid';

import { localization } from '../../utils/constants';
import { Button } from '../button';
import type { TableHeaderCellComponent } from './Table.types';

const theme = {
    wrapper: 'flex gap-md',
    content: 'flex-1',
    sortButttonWrapper: '-my-md flex items-center gap-xs',
    sortButton: 'min-w-[32px] min-h-[32px] rounded-md',
    sortIndex: 'flex aspect-square items-center rounded-full bg-primary-extra-light px-md'
} as const;

type SortDirection = 'asc' | 'desc' | null;

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

    return sortDirection === 'asc' ? localization.sortAsc : localization.sortDsc;
};

export const TableHeaderCell: TableHeaderCellComponent = ({ col, sort, onSortChange }) => {
    const sortIndex = sort.findIndex((s) => s.accessor === col.accessor);
    const isMultiSorted = sortIndex > -1 && sort.length > 1;
    const sortDirection = sort[sortIndex]?.direction ?? null;
    const icon = getSortIcon(sortDirection);
    const title = `${col.header} - ${getSortIconLabel(sortDirection)}`;

    const handleSort = useCallback(() => {
        onSortChange(col.accessor);
    }, [col.accessor, onSortChange]);

    return (
        <div className={theme.wrapper}>
            <div className={theme.content}>{col.header}</div>
            {col.sortable && (
                <div className={theme.sortButttonWrapper}>
                    {isMultiSorted && <span className={theme.sortIndex}>{sortIndex + 1}</span>}
                    <Button
                        onClick={handleSort}
                        icon={icon}
                        showChildren={false}
                        variant='transparent'
                        additionalClassName={theme.sortButton}
                    >
                        {title}
                    </Button>
                </div>
            )}
        </div>
    );
};
