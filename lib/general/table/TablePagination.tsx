import { ArrowLeftIcon, ArrowRightIcon } from '@heroicons/react/16/solid';

import { localization } from '../../utils/constants';
import { Dropdown } from '../dropdown/Dropdown';
import { Button } from '../button';
import { type TablePaginationProps } from './Table.types';

const theme = {
    wrapper: 'flex w-full items-center justify-between gap-md py-sm',
    pageInfo: 'flex items-center gap-md text-sm'
} as const;

export const TablePagination: React.FC<TablePaginationProps> = ({
    onNextPage,
    onPrevPage,
    onPageChange,
    page,
    totalPages,
    'data-testid': dataTestId
}) => {
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
                disabled={totalPages === 0 || page <= 0}
                data-testid={dataTestId ? `${dataTestId}_prev` : undefined}
            >
                {localization.prevPage}
            </Button>
            <div className={theme.pageInfo}>
                {localization.page}
                <Dropdown
                    options={paginationOptions}

                    buttonProps={{
                        'aria-label': localization.currentPage,
                        disabled: totalPages === 0
                    }}
                    data-testid={dataTestId ? `${dataTestId}_dropdown` : undefined}
                >
                    {totalPages === 0 ? 0 : page + 1}
                </Dropdown>
                {localization.of} {totalPages}
            </div>
            <Button
                icon={ArrowRightIcon}
                showChildren={false}
                variant='outline'
                onClick={onNextPage}
                disabled={totalPages === 0 || page >= totalPages - 1}
                data-testid={dataTestId ? `${dataTestId}_next` : undefined}
            >
                {localization.nextPage}
            </Button>
        </div>
    );
};
