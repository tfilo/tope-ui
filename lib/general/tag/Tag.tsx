import { XMarkIcon } from '@heroicons/react/16/solid';

import type { TagProps } from './Tag.types';

const theme = {
    base: 'inline-flex items-center wrap-anywhere gap-sm border text-md font-medium cursor-default px-sm m-xs focus-within:outline-2 outline-offset-2 outline-primary disabled:cursor-not-allowed min-h-[26px]',
    variant: {
        primary: 'bg-primary border-transparent rounded-sm hover:bg-primary-dark has-disabled:bg-primary-light text-white',
        secondary: 'bg-secondary border-transparent rounded-sm hover:bg-secondary-dark has-disabled:bg-secondary-light text-white',
        danger: 'bg-danger border-transparent rounded-sm hover:bg-danger-dark has-disabled:bg-danger-light text-white',
        outline: 'bg-transparent rounded-sm hover:border-dark'
    },
    mainButton: (isClickable: boolean) => `outline-none disabled:cursor-default ${isClickable ? 'cursor-pointer' : ''}`,
    removeButton: (variant: TagProps['variant']) =>
        `cursor-pointer outline-none rounded-full focus:ring-2 ${variant !== 'outline' ? 'focus:ring-white' : 'focus:ring-primary'}`,
    removeIcon: (variant: TagProps['variant']) => `w-xl h-xl ${variant !== 'outline' ? 'fill-white' : ''}`
} as const;

export const Tag: React.FC<TagProps> = ({
    label,
    onRemove,
    onClick,
    disabled,
    variant = 'primary',
    className = [theme.base, theme.variant[variant]].join(' '),
    ...props
}) => {
    const isClickable = onClick !== undefined && typeof onClick === 'function';

    return (
        <span
            className={className}
            {...props}
        >
            <button
                className={theme.mainButton(isClickable)}
                onClick={onClick}
                disabled={disabled}
                tabIndex={isClickable ? 0 : -1}
            >
                {label}
            </button>
            {!disabled && onRemove && (
                <button
                    type='button'
                    className={theme.removeButton(variant)}
                    onClick={onRemove}
                    aria-label={`Remove ${label}`}
                >
                    <XMarkIcon className={theme.removeIcon(variant)} />
                </button>
            )}
        </span>
    );
};
