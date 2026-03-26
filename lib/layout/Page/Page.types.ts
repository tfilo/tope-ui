import type { PropsWithChildren } from 'react';

/**
 * Page props containing title and children, optionally is possible to change type of title from h1 to another h1-6 elements
 */
export type PageProps = PropsWithChildren<{
    title?: string;
    // Header element to use, defaults to h1
    titleType?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
}>;
