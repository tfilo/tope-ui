import type { ReactElement } from 'react';

export interface ListProps {
    listType?: 'unordered' | 'ordered';
    items?: (ReactElement | string | number | bigint)[];
}
