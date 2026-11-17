import type { Icon } from '../../common/Icon';

export type CardProps = {
    imageUrl?: string;
    ariaLabel?: string;
    title?: string;
    description?: string;
    onClick?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => Promise<void> | void;
    actionIcon?: Icon;
    actionLabel?: string;
    onAction?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => Promise<void> | void;
};
