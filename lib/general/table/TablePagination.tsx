import { ArrowLeftIcon, ArrowRightIcon } from '@heroicons/react/16/solid';

import { localization } from '../../utils/constants';
import { Select } from '../../form/select';
import { Button } from '../button';
import { type TablePaginationProps } from './Table.types';

const theme = {
    wrapper: 'flex w-full items-center justify-between gap-md py-sm',
    pageInfo: 'flex items-center gap-md text-sm'
} as const;

export const TablePagination: React.FC<TablePaginationProps> = ({ onNextPage, onPrevPage, onPageChange, page, totalPages }) => {
    const paginationOptions = [...new Array(totalPages).keys()].map((i) => ({
        label: `${i + 1}`,
        value: `${i}`
    }));

    return (
        <div className={theme.wrapper}>
            <Button
                icon={ArrowLeftIcon}
                showChildren={false}
                variant='outline'
                onClick={onPrevPage}
                disabled={page === 0}
            >
                {localization.prevPage}
            </Button>
            <div className={theme.pageInfo}>
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
