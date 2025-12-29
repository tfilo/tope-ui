import type { PropsWithChildren } from 'react';

/**
 * Props for a wrapper component that surrounds a form element with
 * label, error message and common accessibility/behavior flags.
 */
export type ElementWrapperProps = PropsWithChildren<{
    /** Visible label text for the wrapped element (optional). */
    label?: string;
    /** Error message to display beneath the element (optional). */
    error?: string;
    /** When true, indicates the field is required (visual only). */
    required?: boolean;
    /** When true, disables the wrapped element and related UI (visual only). */
    disabled?: boolean;
    /** ID of the wrapped element — used to associate the label via htmlFor. */
    elementId: string;
}>;
