import type { PropsWithChildren } from 'react';

import type { Icon } from '../../common/Icon';
import type { ButtonProps } from '../../general/button/Button.types';

export type SectionAction = {
    icon: Icon;
    title: string;
    onClick: NonNullable<ButtonProps<'button'>['onClick']>;
    disabled?: boolean;
    /** Defaults to transparent. */
    variant?: ButtonProps<'button'>['variant'];
};

/**
 * Section props containing title and children, optionally is possible to change type of title from h2 to another h2-6 elements, can have border
 */
export type SectionProps = PropsWithChildren<{
    title?: string;
    // Header element to use, defaults to h2
    titleType?: 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
    hasBorder?: boolean;
    /** Icon buttons displayed at the top right of the header, beside the title. */
    actions?: SectionAction[];
}>;
