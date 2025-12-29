import type { PropsWithChildren } from 'react';

/**
 * Props for a row-oriented Flex container.
 */
interface FlexBaseRow {
    /** Layout direction; for this variant it's a horizontal row. */
    direction?: 'row';
    /** How items are aligned along the main axis: start, center, end, or spaced between. */
    justify?: 'none' | 'start' | 'center' | 'end' | 'between';
    /** Spacing between children (none -> xl). */
    gap?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
}

/**
 * Props for a column-oriented Flex container.
 */
interface FlexBaseCol {
    /** Layout direction; for this variant it's a vertical column. */
    direction?: 'column';
    /** Justification is not applicable for column variant. */
    justify?: never;
    /** Spacing between children (none -> xl). */
    gap?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
}

/**
 * Combined Flex props including children and optional extra class name.
 */
export type FlexProps = PropsWithChildren<FlexBaseRow | FlexBaseCol> & {
    /** Optional additional CSS class name(s) applied to the container. */
    additionalClassName?: string;
};
