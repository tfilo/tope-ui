import type { PropsWithChildren } from 'react';

/**
 * Section props containing title and children, optionally is possible to change type of title from h2 to another h2-6 elements, can have border
 */
export type SectionProps = PropsWithChildren<{
    title?: string;
    // Header element to use, defaults to h2
    titleType?: 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
    hasBorder?: boolean;
}>;
