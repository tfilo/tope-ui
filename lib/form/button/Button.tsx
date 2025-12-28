import type React from 'react';
import { useMemo, type ElementType, type PropsWithChildren } from 'react';
import type { UserIcon } from '@heroicons/react/16/solid';

type ButtonBaseProps<T extends ElementType> = PropsWithChildren<{
    as?: T;
    variant?: 'primary' | 'secondary' | 'danger' | 'outline' | 'transparent';
    icon?: typeof UserIcon;
    hideChildren?: boolean;
    textDecoration?: 'underline' | 'none';
}>;

type ButtonProps<T extends ElementType> = ButtonBaseProps<T> & Omit<React.ComponentPropsWithRef<T>, keyof ButtonBaseProps<T>>;

const base =
    'mobile:w-auto w-full flex flex-row justify-center gap-md cursor-pointer disabled:cursor-default px-md py-sm font-medium rounded-sm min-w-[34px] min-h-[34px]';

const theme = {
    primary: 'bg-primary border border-transparent hover:bg-primary-dark disabled:bg-primary-light text-white',
    secondary: 'bg-secondary border border-transparent hover:bg-secondary-dark disabled:bg-secondary-light text-white',
    danger: 'bg-danger border border-transparent hover:bg-danger-dark disabled:bg-danger-light text-white',
    outline: 'bg-transparent border hover:border-dark disabled:border-light disabled:text-disabled',
    transparent: 'bg-transparent border border-transparent disabled:text-disabled hover:text-primary-dark'
} as const;

const textDecoration = {
    underline: 'underline underline-offset-2',
    none: ''
} as const;

export const Button = <T extends ElementType = 'button'>({
    as,
    variant = 'primary',
    children,
    icon,
    hideChildren = false,
    underline = 'none',
    className = [theme[variant], textDecoration[underline], base].join(' '),
    ...props
}: ButtonProps<T>) => {
    const Component = (as ?? 'button') as ElementType;
    const Icon = icon ?? null;

    const title = useMemo(() => {
        if (hideChildren === true && typeof children === 'string') {
            return children;
        }
        return undefined;
    }, [children, hideChildren]);

    return (
        <Component {...props} className={className}>
            {Icon !== null && <Icon className='w-xl' title={title} />}
            {hideChildren !== true && children}
        </Component>
    );
};
