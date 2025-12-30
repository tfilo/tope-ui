import React, { useMemo, type ElementType } from 'react';
import type { ButtonProps } from './Button.types';

const theme = {
    base: (showChildren: boolean, additionalClassName: string) => {
        const mobile = showChildren ? 'mobile:w-fit w-full px-md' : 'w-fit';
        return `${mobile} border flex flex-row justify-center items-center gap-md cursor-pointer disabled:cursor-default font-medium ${additionalClassName}`.trim();
    },
    variant: {
        primary: 'bg-primary border-transparent rounded-sm hover:bg-primary-dark disabled:bg-primary-light text-white fill-white',
        secondary: 'bg-secondary border-transparent rounded-sm  hover:bg-secondary-dark disabled:bg-secondary-light text-white fill-white',
        danger: 'bg-danger border-transparent rounded-sm  hover:bg-danger-dark disabled:bg-danger-light text-white fill-white',
        outline: 'bg-transparent rounded-sm hover:border-dark disabled:border-light disabled:text-disabled',
        transparent:
            'bg-transparent focus:outline-none focus:bg-primary-light border-transparent disabled:text-disabled hover:text-primary-dark'
    },
    textDecoration: {
        underline: 'underline underline-offset-2',
        none: ''
    },
    icon: 'w-xl fill-inherit'
} as const;

/**
 * Button component that can render as any HTML element or custom component.
 */
export const Button = <T extends ElementType = 'button'>({
    as,
    variant = 'primary',
    children,
    icon,
    textDecoration = 'none',
    showChildren = true,
    additionalClassName = 'min-w-[32px] min-h-[32px]',
    className = [theme.variant[variant], theme.textDecoration[textDecoration], theme.base(showChildren, additionalClassName)].join(' '),
    ref,
    ...props
}: ButtonProps<T>) => {
    const Component = (as ?? 'button') as ElementType;
    const Icon = icon ?? null;
    const hasIcon = Icon !== null;
    const isButton = as === undefined || as === 'button';

    const title = useMemo(() => {
        if (showChildren === false && typeof children === 'string') {
            return children;
        }
        return undefined;
    }, [children, showChildren]);

    return (
        <Component
            type={isButton ? 'button' : undefined}
            {...props}
            className={className}
            ref={ref}
            title={title}
        >
            {hasIcon && <Icon className={theme.icon} />}
            {showChildren && children}
        </Component>
    );
};
