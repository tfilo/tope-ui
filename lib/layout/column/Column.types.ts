import type { PropsWithChildren } from 'react';

export type ColumnProps = PropsWithChildren<{
    colspan?: 4 | 3 | 2 | 1;
    className?: string;
    /** Optional attribute for Playwright testing */
    'data-testid'?: string;
}>;
