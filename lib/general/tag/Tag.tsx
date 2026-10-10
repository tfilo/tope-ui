import { XMarkIcon } from '@heroicons/react/16/solid';

import { localization } from '../../utils/constants';
import type { TagProps } from './Tag.types';

const theme = {
    base: (variant: TagProps['variant']) =>
        `group inline-flex items-center wrap-anywhere gap-sm border text-md font-medium cursor-default px-sm m-xs ${variant === 'outline' ? '' : 'focus-within:outline-2 outline-offset-2 outline-primary '}disabled:cursor-not-allowed min-h-[26px]`,
    variant: {
        primary: 'bg-primary border-transparent rounded-sm hover:bg-primary-dark has-disabled:bg-primary-light text-white',
        secondary: 'bg-secondary border-transparent rounded-sm hover:bg-secondary-dark has-disabled:bg-secondary-light text-white',
        danger: 'bg-danger border-transparent rounded-sm hover:bg-danger-dark has-disabled:bg-danger-light text-white',
        outline:
            'bg-transparent rounded-sm hover:border-dark focus-within:bg-primary focus-within:hover:bg-primary-dark     focus-within:text-white focus-within:border-primary'
    },
    mainButton: (isClickable: boolean) => `outline-none disabled:cursor-default ${isClickable ? 'cursor-pointer' : ''}`,
    removeButton: 'cursor-pointer outline-none rounded-full focus:ring-2 focus:ring-white',
    removeIcon: (variant: TagProps['variant']) => `w-xl h-xl ${variant !== 'outline' ? 'fill-white' : 'group-focus-within:fill-white'}`
} as const;

export const Tag: React.FC<TagProps> = ({
    label,
    onRemove,
    onClick,
    disabled,
    variant = 'primary',
    className = [theme.base(variant), theme.variant[variant]].join(' '),
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
                    className={theme.removeButton}
                    onClick={onRemove}
                    aria-label={localization.remove(label)}
                >
                    <XMarkIcon className={theme.removeIcon(variant)} />
                </button>
            )}
        </span>
    );
};
