import type { Icon } from '../../common/Icon';

export type CardProps = {
    imageUrl?: string;
    ariaLabel?: string;
    title?: string;
    description?: string;
    /** Use the compact horizontal layout below the tablet breakpoint. Defaults to true. Set false to keep the square image Card. */
    compactOnMobile?: boolean;
    onClick?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => Promise<void> | void;
    actionIcon?: Icon;
    actionLabel?: string;
    onAction?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => Promise<void> | void;
};
