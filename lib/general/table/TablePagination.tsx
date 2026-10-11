import { ArrowLeftIcon, ArrowRightIcon } from '@heroicons/react/16/solid';

import { localization } from '../../utils/constants';
import { Dropdown } from '../dropdown/Dropdown';
import { Button } from '../button';
import { type TablePaginationProps } from './Table.types';

const theme = {
    wrapper: 'flex w-full items-center justify-between gap-md py-sm',
    pageInfo: 'flex items-center gap-md text-sm'
} as const;

export const TablePagination: React.FC<TablePaginationProps> = ({ onNextPage, onPrevPage, onPageChange, page, totalPages }) => {
    const paginationOptions = [...new Array(totalPages).keys()].map((i) => ({
        label: `${i + 1}`,
        onClick: () => onPageChange(i)
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
                <Dropdown
                    options={paginationOptions}

                    buttonProps={{
                        'aria-label': localization.currentPage
                    }}
                >
                    {page + 1}
                </Dropdown>
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
