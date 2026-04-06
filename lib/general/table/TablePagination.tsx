import { ArrowLeftIcon, ArrowRightIcon } from '@heroicons/react/16/solid';
import { Button } from '../button';
import { Select } from '../../form/select';
import { localization } from '../../utils/constants';
import { type TablePaginationProps } from './Table.types';
import { useMemo } from 'react';

export const TablePagination: React.FC<TablePaginationProps> = ({ onNextPage, onPrevPage, onPageChange, page, totalPages }) => {
    const paginationOptions = useMemo(() => {
        return [...new Array(totalPages).keys()].map((i) => ({
            label: `${i + 1}`,
            value: `${i}`
        }));
    }, [totalPages]);

    return (
        <div className='w-full flex gap-md items-center py-sm justify-between'>
            <Button
                icon={ArrowLeftIcon}
                showChildren={false}
                variant='outline'
                onClick={onPrevPage}
                disabled={page === 0}
            >
                {localization.prevPage}
            </Button>
            <div className='text-sm flex gap-md items-center'>
                {localization.page}
                <Select
                    options={paginationOptions}
                    value={page.toString()}
                    onChange={onPageChange}
                    aria-label={localization.currentPage}
                />
                {localization.of} {totalPages}
            </div>
            <Button
                icon={ArrowRightIcon}
                showChildren={false}
                variant='outline'
                onClick={onNextPage}
                disabled={page === totalPages - 1}
            >
                {localization.nextPage}
            </Button>
        </div>
    );
};
