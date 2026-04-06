import type { PropsWithChildren } from 'react';

/**
 * GridProps allow to set children and maxRows, default it is 4 rows on desktop, 2 on tabled and 1 on mobile
 */
export type GridProps = PropsWithChildren<{
    maxRows?: 4 | 2 | 1;
}>;
