export interface TagProps {
    /** Label to display inside the tag */
    label: string;
    /** onRemove callback, if provided a remove button will be shown */
    onRemove?: () => void | Promise<void>;
    /** onClick callback */
    onClick?: () => void | Promise<void>;
    /** Whether the tag is disabled */
    disabled?: boolean;
    /** Variant of the tag */
    variant?: 'primary' | 'secondary' | 'danger' | 'outline';
    /** Class name for custom styling */
    className?: string;
}
