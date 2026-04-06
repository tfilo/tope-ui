export type CardProps = {
    imageUrl?: string;
    description?: string;
    onClick?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => Promise<void> | void;
    onAction?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => Promise<void> | void;
};
