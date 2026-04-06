import { ArrowDownIcon, ArrowsUpDownIcon, ArrowUpIcon } from '@heroicons/react/16/solid';
import { Button } from '../button';
import type { TableHeaderCellComponent } from './Table.types';
import { localization } from '../../utils/constants';
import { useCallback } from 'react';

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
        <div className='flex gap-md'>
            <div className='flex-1'>{col.header}</div>
            {col.sortable && (
                <div className='-my-md items-center flex gap-xs'>
                    {isMultiSorted && (
                        <span className='bg-primary-extra-light rounded-full px-md aspect-square flex items-center'>{sortIndex + 1}</span>
                    )}
                    <Button
                        onClick={handleSort}
                        icon={icon}
                        showChildren={false}
                        variant='transparent'
                        additionalClassName='min-w-[32px] min-h-[32px] rounded-md'
                    >
                        {title}
                    </Button>
                </div>
            )}
        </div>
    );
};
